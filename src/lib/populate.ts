import { chunk, flattenDeep } from "lodash";
import {
  upsertBadgeDefinition,
  upsertEarnedBadge,
  upsertProtocol,
  upsertRankingKnex,
  upsertRole,
  upsertTrack,
  upsertWinner,
} from "../database/mutations";
import {
  queryLastEarnedBadge,
  queryProtocolRankings,
  queryRecentWinnersByProtocol,
  queryRoleRankings,
  queryRoles,
} from "../database/queries";
import {
  queryAllBadgeDefinitions,
  queryAllEarnedBadges,
  queryGraphAccountsMainnetNetwork,
} from "../subgraph/queries";
import {
  BadgeDefinition as BadgeDefinitionType,
  EarnedBadge,
  GraphAccount,
  Ranking,
  Role,
  Winner,
} from "../types";
import {
  ensRecordsContract,
  subgraphTheGraphBadges,
  subgraphTheGraphNetwork,
} from "./constants";
import { removeRomanNumerals } from "./string";
import { delay, querySubgraph } from "./utils";

export const populateBadgeTracksAndDefinitions = async (
  protocolId: string,
  queryRunner: any
) => {
  console.log(`Populating badge tracks and definitions for ${protocolId}...`);
  const { badgeDefinitions }: { badgeDefinitions: BadgeDefinitionType[] } =
    await querySubgraph({
      query: queryAllBadgeDefinitions,
      subgraph: subgraphTheGraphBadges,
    });

  const trackLevelCount: Record<string, number> = {};

  const badgeDefinitionsWithTrack = badgeDefinitions
    .sort((a, b) => a.threshold - b.threshold)
    .reduce<BadgeDefinitionType[]>((acc, definition) => {
      const trackId = removeRomanNumerals(definition.id);
      const level = trackLevelCount[trackId] || 0;
      trackLevelCount[trackId] = level + 1;
      return [...acc, { ...definition, trackId, level }];
    }, []);

  await queryRunner.query(upsertProtocol, {
    id: protocolId,
  });

  for (const definition of badgeDefinitionsWithTrack) {
    const trackId = definition.trackId as string;
    const metric = definition.metric.id;
    const threshold = Number(definition.threshold);
    const soulScore = Number(definition.soulScore);
    const role = definition.protocolRole;

    await queryRunner.query(upsertRole, {
      id: role,
      protocolId,
    });

    await queryRunner.query(upsertTrack, {
      id: trackId,
      protocolId,
      roleId: role,
    });

    await queryRunner.query(upsertBadgeDefinition, {
      ...definition,
      protocolId,
      soulScore,
      threshold,
      metric,
    });
  }
};

export const populateBadgesAndWinners = async (
  protocolId: string,
  queryRunner: any
) => {
  console.log(`Populating earned badges for ${protocolId}`);
  const { data } = await queryRunner.query(queryLastEarnedBadge, {
    protocolId,
  });

  const lastGlobalBadgeNumberSynced =
    data.allEarnedBadgesList[0]?.globalBadgeNumber || 0;

  const response: {
    earnedBadgeCounts: {
      globalBadgeNumber: number;
      earnedBadge: EarnedBadge;
    }[];
  } = await querySubgraph({
    query: queryAllEarnedBadges,
    subgraph: subgraphTheGraphBadges,
    variables: { lastGlobalBadgeNumberSynced },
  });

  const earnedBadges = response.earnedBadgeCounts.map(
    ({ earnedBadge, globalBadgeNumber }) => ({
      ...earnedBadge,
      globalBadgeNumber: Number(globalBadgeNumber),
      blockAwarded: Number(earnedBadge.blockAwarded),
      timestampAwarded: Number(earnedBadge.timestampAwarded),
      definitionId: earnedBadge.definition.id,
      protocolId: protocolId,
      metadata: JSON.stringify(earnedBadge.metadata),
    })
  );

  for (const earnedBadge of earnedBadges) {
    const winnerId = earnedBadge.badgeWinner.id;
    const totalSoulScore = Number(earnedBadge.badgeWinner.soulScore);
    const definitionId = earnedBadge.definitionId;

    await queryRunner.query(upsertWinner, {
      id: winnerId,
    });

    await queryRunner.query(upsertEarnedBadge, {
      ...earnedBadge,
      protocolId,
      definitionId,
      winnerId,
    });

    /* Cross-Protocol Ranking */
    await upsertRankingKnex({
      winner_id: winnerId,
      soul_score: totalSoulScore,
      protocol_id: protocolId,
      rank: 0,
    });

    /* Individual Role Rankings */
    for (const role of earnedBadge.badgeWinner.roles) {
      const roleId = role.protocolRole;
      const soulScore = Number(role.soulScore) || 0;

      await upsertRankingKnex({
        winner_id: winnerId,
        role_id: roleId,
        soul_score: soulScore,
        protocol_id: protocolId,
        rank: 0,
      });
    }
  }

  return earnedBadges;
};

export const populateWinnerRank = async (
  protocolId: string,
  queryRunner: any
) => {
  console.log("Populating winner rankings");

  const rolesResponse = await queryRunner.query(queryRoles, {
    protocolId,
  });

  const roles = rolesResponse.data.allRolesList.map((role: Role) => role.id);

  const updateLeaderboardRankings = async (query: string, role?: string) => {
    const { data } = await queryRunner.query(query, {
      protocolId,
      roleId: role,
    });

    const winnerRankings = data.allRankingsList.map(
      (ranking: Ranking, i: number) =>
        upsertRankingKnex({
          winner_id: ranking.winnerId,
          protocol_id: protocolId,
          soul_score: ranking.soulScore,
          role_id: ranking.roleId,
          rank: i + 1,
        })
    );

    return await Promise.all(winnerRankings);
  };

  updateLeaderboardRankings(queryProtocolRankings);

  for (const role of roles) {
    await updateLeaderboardRankings(queryRoleRankings, role);
  }
};

export const populateWinnerEns = async (
  protocolId: string,
  queryRunner: any
) => {
  console.log("Populating winner ens");
  const { data } = await queryRunner.query(queryRecentWinnersByProtocol, {
    protocolId,
  });

  const winnerIds = data.allWinnersList.map((winner: Winner) => winner.id);

  const chunkSize = 100;

  const nestedWinnerEnsDomains = [];

  for (const subWinnerIds of chunk(winnerIds, chunkSize)) {
    // Chunking && delaying to not run into json-rpc 5s timeout
    const ensDomains = await ensRecordsContract.getNames(subWinnerIds);
    nestedWinnerEnsDomains.push(ensDomains);
    delay(1000);
  }

  const winnerENSDomains = flattenDeep(nestedWinnerEnsDomains);

  const upsertWinnerPromises = winnerENSDomains.map((_ens, i) =>
    queryRunner.query(upsertWinner, {
      id: winnerIds[i],
      ens: winnerENSDomains[i],
    })
  );

  await Promise.all(upsertWinnerPromises);
};

export const populateWinnersGraphDisplayName = async (
  protocolId: string,
  queryRunner: any
) => {
  console.log("Populating graph display names");
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
