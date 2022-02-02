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
