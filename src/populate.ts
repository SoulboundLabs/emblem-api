import { subgraphTheGraphBadges } from "./constants";
import {
  upsertBadgeDefinition,
  upsertProtocol,
  upsertTrack,
} from "./database/mutations";
import { queryLastBadgeAward } from "./database/queries";
import { removeRomanNumerals } from "./string";
import {
  queryAllBadgeAwards,
  queryAllBadgeDefinitions,
} from "./subgraph/queries";
import { BadgeAward, BadgeDefinition as BadgeDefinitionType } from "./types";
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

export const populateBadgeAwards = async (
  protocolId: string,
  queryRunner: any
) => {
  const { data } = await queryRunner.query(queryLastBadgeAward, {
    protocolId,
  });

  console.log(data.allDefinitionsList);

  const globalAwardNumberSync = 0;

  const response: { badgeAwards: BadgeAward[] } = await querySubgraph({
    query: queryAllBadgeAwards,
    subgraph: subgraphTheGraphBadges,
    variables: { globalAwardNumberSync },
  });

  console.log(response);

  return;

  const badgeAwards = response.badgeAwards.map((award: BadgeAward) => ({
    ...award,
    blockAwarded: Number(award.blockAwarded),
    timestampAwarded: Number(award.timestampAwarded),
    definitionId: award.definition.id,
    protocolId: protocolId,
  }));

  const lastBadgeAwarded = badgeAwards[badgeAwards.length - 1];

  if (lastBadgeAwarded) {
    const globalAwardNumberSync = lastBadgeAwarded.globalAwardNumber;
    const lastBlockAwardedSync = lastBadgeAwarded.blockAwarded;
    console.log({ globalAwardNumberSync, lastBlockAwardedSync });
  }

  return badgeAwards;
};
