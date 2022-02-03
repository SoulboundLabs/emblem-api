import { chunk } from "lodash";
import {
  ensRecordsContract,
  subgraphTheGraphBadges,
  subgraphTheGraphNetwork,
} from "./constants";
import {
  upsertBadgeDefinition,
  upsertProtocol,
  upsertTrack,
} from "./database/mutations";
import { removeRomanNumerals } from "./string";
import {
  queryAllBadgeDefinitions,
  queryAllEarnedBadges,
  queryGraphAccountsMainnetNetwork,
} from "./subgraph/queries";
import {
  BadgeDefinition as BadgeDefinitionType,
  EarnedBadge,
  GraphAccount,
  MiniWinner,
} from "./types";
import {
  getBadgeDefinitionsRef,
  getEarnedBadgeRef,
  getProtocolRef,
  getWinnerRef,
  getWinnersRef,
  querySubgraph,
} from "./utils";

export const badgeDefinitionWithProtocol = (badgeDefinition, protocol) => ({
  ...badgeDefinition,
  protocol: {
    id: protocol,
  },
});

export const populateBadgeTracksAndDefinitions = async (
  protocol: string,
  queryRunner: any
) => {
  const { badgeDefinitions }: { badgeDefinitions: BadgeDefinitionType[] } =
    await querySubgraph({
      query: queryAllBadgeDefinitions,
      subgraph: subgraphTheGraphBadges,
    });

  const badgeTracks = badgeDefinitions.reduce<string[]>((acc, definition) => {
    const trackName = removeRomanNumerals(definition.id);
    return acc.includes(trackName) ? acc : [...acc, trackName];
  }, []);

  await queryRunner.query(upsertProtocol, {
    id: protocol,
  });

  badgeTracks.forEach(async (badgeTrack) => {
    await queryRunner.query(upsertTrack, {
      id: badgeTrack,
      protocol_id: protocol,
    });
  });

  badgeDefinitions.forEach(async (def) => {
    await queryRunner.query(upsertBadgeDefinition, {
      ...def,
      protocol_id: protocol,
    });
  });
};

export const populateBadgeDefinitions = async (
  firestore: FirebaseFirestore.Firestore,
  protocol: string
) => {
  const { badgeDefinitions } = await querySubgraph({
    query: queryAllBadgeDefinitions,
    subgraph: subgraphTheGraphBadges,
  });

  const batch = firestore.batch();

  const badgeTracksRef = getBadgeDefinitionsRef(firestore, protocol);

  badgeDefinitions.forEach((definition) => {
    const newRef = badgeTracksRef.doc(definition.id);
    batch.set(newRef, badgeDefinitionWithProtocol(definition, protocol));
  });

  await batch.commit();
};

export const populateEarnedBadges = async (
  firestore: FirebaseFirestore.Firestore,
  protocol: string
) => {
  const protocolRef = getProtocolRef(firestore, protocol);
  const snapshot = await protocolRef.get();
  const { lastGlobalAwardNumberSynced = 0 } = snapshot.data() || {};

  const response: { badgeAwards: EarnedBadge[] } = await querySubgraph({
    query: queryAllEarnedBadges,
    subgraph: subgraphTheGraphBadges,
    variables: { lastGlobalAwardNumberSynced },
  });

  const badgeAwards = response.badgeAwards.map((award: EarnedBadge) => ({
    ...award,
    blockAwarded: Number(award.blockAwarded),
    timestampAwarded: Number(award.timestampAwarded),
    definition: badgeDefinitionWithProtocol(award.definition, protocol),
  }));

  const batch = firestore.batch();

  badgeAwards.forEach((award) => {
    const badgeAwardRef = getEarnedBadgeRef(firestore, protocol, award.id);
    batch.set(badgeAwardRef, award);
  });

  const lastEarnedBadge = badgeAwards[badgeAwards.length - 1];

  if (lastEarnedBadge) {
    const lastGlobalAwardNumberSynced = lastEarnedBadge.globalAwardNumber;
    const lastBlockAwardedSync = lastEarnedBadge.blockAwarded;
    batch.set(
      protocolRef,
      { lastGlobalAwardNumberSynced, lastBlockAwardedSync },
      { merge: true }
    );
  }

  await batch.commit();

  return badgeAwards;
};

export const populateWinners = async (
  firestore: FirebaseFirestore.Firestore,
  protocol: string,
  badgeAwards: EarnedBadge[]
) => {
  const winnerIDs = badgeAwards.map((award) => award.winner.id);

  const chunkSize = 100;
  const nestedWinnerENSDomains: string[][] = await Promise.all(
    chunk(winnerIDs, chunkSize).map(async (subWinnerIds) => {
      // Chunking to not run into json-rpc 5s timeout
      return await ensRecordsContract.getNames(subWinnerIds);
    })
  );

  const winnerENSDomains = nestedWinnerENSDomains.flat();

  const increment = admin.firestore.FieldValue.increment(1);

  const winners = badgeAwards.map((award, index) => ({
    id: award.winner.id,
    ens: winnerENSDomains[index],
    awardCounts: {
      [protocol]: increment,
    },
    lastAwarded: {
      [protocol]: award.timestampAwarded,
    },
    roles: {
      [protocol]: {
        [award.definition.badgeTrack.protocolRole]: true,
      },
    },
    tracks: {
      [protocol]: {
        [award.definition.badgeTrack.id]: true,
      },
    },
    awards: {
      [protocol]: {
        [award.definition.id]: {
          id: award.id,
          transactionHash: award.transactionHash,
          globalAwardNumber: award.globalAwardNumber,
          awardNumber: award.awardNumber,
          blockAwarded: award.blockAwarded,
          timestampAwarded: award.timestampAwarded,
          definition: award.definition,
        },
      },
    },
  }));

  const batch = firestore.batch();

  winners.forEach((winner) => {
    const winnerRef = getWinnerRef(firestore, winner.id);
    batch.set(winnerRef, winner, { merge: true });
  });

  await batch.commit();

  return winners;
};

export const populateWinnersGraphDisplayName = async (
  firestore: FirebaseFirestore.Firestore,
  winners: MiniWinner[]
) => {
  const winnerIDs = winners.map((winner) => winner.id);
  const { graphAccounts }: { graphAccounts: GraphAccount[] } =
    await querySubgraph({
      query: queryGraphAccountsMainnetNetwork,
      subgraph: subgraphTheGraphNetwork,
      variables: { beneficiaryIDs: winnerIDs },
    });

  const batch = firestore.batch();

  graphAccounts.forEach((graphAccount) => {
    const updatedDisplayName = {
      ens: graphAccount.defaultDisplayName + ".eth",
      defaultDisplayName: graphAccount.defaultDisplayName + ".eth",
    };

    const winner = winners.find((winner) => winner.id === graphAccount.id);
    winner.ens = updatedDisplayName.ens;

    const winnerRef = getWinnerRef(firestore, graphAccount.id);
    batch.set(winnerRef, updatedDisplayName, { merge: true });
  });

  await batch.commit();

  return winners;
};

export const mergeWinnerBackToEarnedBadges = async (
  firestore: FirebaseFirestore.Firestore,
  protocol: string,
  winners: MiniWinner[]
) => {
  const batch = firestore.batch();

  winners.forEach((winner) => {
    Object.values(winner.awards[protocol]).forEach(
      (badgeAward: EarnedBadge) => {
        const ref = getEarnedBadgeRef(firestore, protocol, badgeAward.id);
        batch.set(
          ref,
          {
            winner: {
              id: winner.id,
              ens: winner.ens,
            },
          },
          { merge: true }
        );
      }
    );
  });

  await batch.commit();
};

export const populateLeaderboardRankHandler = async (
  firestore: FirebaseFirestore.Firestore,
  protocol: string
) => {
  const ref = getWinnersRef(firestore);

  // Order first by badge count, then by timestamp of last badge award
  const query = ref
    .where(`awardCounts.${protocol}`, ">", 0)
    .orderBy(`awardCounts.${protocol}`, "desc")
    .orderBy(`lastAwarded.${protocol}`, "desc");
  const snapshot = await query.get();

  const winners = [];

  snapshot.forEach((doc) => {
    const winner = doc.data();
    winners.push(winner);
  });

  const winnersRanked = winners.map((winner, index) => ({
    id: winner.id,
    leaderboardRank: {
      [protocol]: index + 1,
    },
  }));

  const batches = chunk(winnersRanked, 500).map((winnersChunked) => {
    const batch = firestore.batch();
    winnersChunked.forEach((winner) => {
      const winnerRef = getWinnerRef(firestore, winner.id);
      batch.set(winnerRef, winner, { merge: true });
    });
    return batch.commit();
  });

  await Promise.all(batches);

  const protocolRef = getProtocolRef(firestore, protocol);
  await protocolRef.set({ winnerCount: winnersRanked.length }, { merge: true });
};
