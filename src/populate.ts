import { subgraphTheGraphBadges } from "./constants";
import {
  upsertBadgeDefinition,
  upsertProtocol,
  upsertTrack,
} from "./database/mutations";
import { removeRomanNumerals } from "./string";
import { queryAllBadgeDefinitions } from "./subgraph/queries";
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

// export const populateBadgeAwards = async (protocol: string, queryRunner) => {
//   await queryRunner.query(queryLastBadgeAward, {
//     id: protocol,
//   });

//   const response: { badgeAwards: BadgeAward[] } = await querySubgraph({
//     query: queryAllBadgeAwards,
//     subgraph: subgraphTheGraphBadges,
//     variables: { globalAwardNumberSync },
//   });

//   const badgeAwards = response.badgeAwards.map((award: BadgeAward) => ({
//     ...award,
//     blockAwarded: Number(award.blockAwarded),
//     timestampAwarded: Number(award.timestampAwarded),
//     definition: badgeDefinitionWithProtocol(award.definition, protocol),
//   }));

//   const batch = firestore.batch();

//   badgeAwards.forEach((award) => {
//     const badgeAwardRef = getBadgeAwardRef(firestore, protocol, award.id);
//     batch.set(badgeAwardRef, award);
//   });

//   const lastBadgeAwarded = badgeAwards[badgeAwards.length - 1];

//   if (lastBadgeAwarded) {
//     const globalAwardNumberSync = lastBadgeAwarded.globalAwardNumber;
//     const lastBlockAwardedSync = lastBadgeAwarded.blockAwarded;
//     batch.set(
//       protocolRef,
//       { globalAwardNumberSync, lastBlockAwardedSync },
//       { merge: true }
//     );
//   }

//   await batch.commit();

//   return badgeAwards;
// };
