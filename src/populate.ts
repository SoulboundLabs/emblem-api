import { chunk, flattenDeep } from "lodash";
import {
  ensRecordsContract,
  subgraphTheGraphBadges,
  subgraphTheGraphNetwork,
} from "./constants";
import {
  upsertBadgeDefinition,
  upsertEarnedBadge,
  upsertProtocol,
  upsertRanking,
  upsertTrack,
  upsertWinner,
} from "./database/mutations";
import {
  queryLastEarnedBadge,
  queryRecentWinnersByProtocol,
  queryWinnersWithProtocolBadgeCountKnex,
} from "./database/queries";
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
  Winner,
} from "./types";
import { querySubgraph } from "./utils";

export const populateBadgeTracksAndDefinitions = async (
  protocolId: string,
  queryRunner: any
) => {
  const { badgeDefinitions }: { badgeDefinitions: BadgeDefinitionType[] } =
    await querySubgraph({
      query: queryAllBadgeDefinitions,
      subgraph: subgraphTheGraphBadges,
    });

  const badgeDefinitionsWithTrack = badgeDefinitions.reduce<
    BadgeDefinitionType[]
  >((acc, definition) => {
    const trackId = removeRomanNumerals(definition.id);
    console.log(trackId);
    return [...acc, { ...definition, trackId }];
  }, []);

  await queryRunner.query(upsertProtocol, {
    id: protocolId,
  });

  for (const definition of badgeDefinitionsWithTrack) {
    await queryRunner.query(upsertTrack, {
      id: definition.trackId,
      protocolId,
    });

    await queryRunner.query(upsertBadgeDefinition, {
      ...definition,
      protocolId,
    });
  }
};

export const populateEarnedBadges = async (
  protocolId: string,
  queryRunner: any
) => {
  const { data } = await queryRunner.query(queryLastEarnedBadge, {
    protocolId,
  });

  const lastGlobalAwardNumberSynced =
    data.allEarnedBadgesList[0]?.globalAwardNumber || 0;

  const response: { earnedBadges: EarnedBadge[] } = await querySubgraph({
    query: queryAllEarnedBadges,
    subgraph: subgraphTheGraphBadges,
    variables: { lastGlobalAwardNumberSynced },
  });

  const earnedBadges = response.earnedBadges.map((award: EarnedBadge) => ({
    ...award,
    blockAwarded: Number(award.blockAwarded),
    timestampAwarded: Number(award.timestampAwarded),
    definitionId: award.definition.id,
    protocolId: protocolId,
    metadata: JSON.stringify(award.metadata),
  }));

  for (const earnedBadge of earnedBadges) {
    await queryRunner.query(upsertWinner, {
      id: earnedBadge.badgeWinner.id,
    });
    await queryRunner.query(upsertEarnedBadge, {
      ...earnedBadge,
      protocolId,
      definitionId: earnedBadge.definition.id,
      winnerId: earnedBadge.badgeWinner.id,
    });
  }

  return earnedBadges;
};

export const populateWinnerMetadataAndRank = async (
  protocolId: string,
  queryRunner: any
) => {
  const winners: Winner[] = await queryWinnersWithProtocolBadgeCountKnex(
    protocolId
  );

  const winnerIds = winners.map(({ id }) => id);

  const chunkSize = 100;
  const nestedWinnerENSDomains: string[][] = await Promise.all(
    chunk(winnerIds, chunkSize).map(async (subWinnerIds) => {
      // Chunking to not run into json-rpc 5s timeout
      return await ensRecordsContract.getNames(subWinnerIds);
    })
  );

  const winnerENSDomains = flattenDeep(nestedWinnerENSDomains);

  const upsertWinnerPromises = winnerENSDomains.map((_ens, i) =>
    queryRunner.query(upsertWinner, {
      id: winnerIds[i],
      ens: winnerENSDomains[i],
    })
  );

  const winnerRankings = winners.map((winner, i) =>
    queryRunner.query(upsertRanking, {
      winnerId: winner.id,
      protocolId: protocolId,
      rank: i + 1,
    })
  );

  await Promise.all(upsertWinnerPromises);
  await Promise.all(winnerRankings);
};

export const populateWinnersGraphDisplayName = async (
  protocolId: string,
  queryRunner: any
) => {
  const { data } = await queryRunner.query(queryRecentWinnersByProtocol, {
    protocolId,
  });

  const winnerIDs = data.allWinnersList.map((winner: Winner) => winner.id);

  const { graphAccounts }: { graphAccounts: GraphAccount[] } =
    await querySubgraph({
      query: queryGraphAccountsMainnetNetwork,
      subgraph: subgraphTheGraphNetwork,
      variables: { beneficiaryIDs: winnerIDs },
    });

  const queuedUpserts = [];

  for (const graphAccount of graphAccounts) {
    const winnerId = winnerIDs.find((id: string) => id === graphAccount.id);
    if (winnerId) {
      const upsert = queryRunner.query(upsertWinner, {
        id: winnerId,
        defaultDisplayName: graphAccount.defaultDisplayName + ".eth",
      });
      queuedUpserts.push(upsert);
    }
  }

  await Promise.all(queuedUpserts);
};
