import { subgraphTheGraphBadges } from "./constants";
import {
  upsertBadgeDefinition,
  upsertEarnedBadge,
  upsertProtocol,
  upsertTrack,
  upsertWinner,
} from "./database/mutations";
import { queryLastEarnedBadge } from "./database/queries";
import { removeRomanNumerals } from "./string";
import {
  queryAllBadgeDefinitions,
  queryAllEarnedBadges,
} from "./subgraph/queries";
import { BadgeDefinition as BadgeDefinitionType, EarnedBadge } from "./types";
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

  // console.log(data.allDefinitionsList);

  const globalAwardNumberSync = 0;

  const response: { earnedBadges: EarnedBadge[] } = await querySubgraph({
    query: queryAllEarnedBadges,
    subgraph: subgraphTheGraphBadges,
    variables: { globalAwardNumberSync },
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
