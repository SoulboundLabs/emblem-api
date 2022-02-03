import { subgraphTheGraphBadges } from "./constants";
import {
  upsertBadgeDefinition,
  upsertProtocol,
  upsertTrack,
} from "./mutations";
import { queryAllBadgeDefinitions } from "./queries";
import { removeRomanNumerals } from "./string";
import { BadgeDefinition as BadgeDefinitionType } from "./types";
import { querySubgraph } from "./utils";

export const populateBadgeTracksAndDefinitions = async (
  protocol: string,
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
    id: protocol,
  });

  for (const definition of badgeDefinitionsWithTrack) {
    await queryRunner.query(upsertTrack, {
      id: definition.trackId,
      protocolId: protocol,
    });

    await queryRunner.query(upsertBadgeDefinition, {
      ...definition,
      protocolId: protocol,
    });
  }
};
