import { gql } from "graphql-request";
import knex from "../../knex/knex";
import { MAX_RESULTS } from "../lib/constants";
export const queryLastEarnedBadge = gql`
  query LastEarnedBadges($protocolId: String!) {
    allEarnedBadgesList(
      filter: { protocolId: { equalTo: $protocolId } }
      first: 1
      orderBy: GLOBAL_AWARD_NUMBER_DESC
    ) {
      id
      globalAwardNumber
    }
  }
`;

// export const queryWinnersByProtocol = gql`
//   query WinnerByProtocol($protocolId: String!) {
//     allWinnersList(
//       filter: {
//         earnedBadgesByWinnerId: {
//           some: { protocolId: { equalTo: $protocolId } }
//         }
//       }
//     ) {
//       id
//     }
//   }
// `;

export const queryRecentWinnersByProtocol = gql`
  query RecentWinnerByProtocol($protocolId: String!) {
    allWinnersList(
      filter: {
        earnedBadgesByWinnerId: {
          some: { protocolId: { equalTo: $protocolId } }
        }
      }
      orderBy: EARNED_BADGES_BY_WINNER_ID_MAX_GLOBAL_AWARD_NUMBER_DESC
      first: ${MAX_RESULTS}
    ) {
      id
      earnedBadgesByWinnerIdList {
        id
        globalAwardNumber
      }
    }
  }
`;

export const queryWinnersWithProtocolBadgeCountKnex = (protocolId: string) =>
  knex
    .from("earned_badges")
    .select(knex.raw("winners.*, COUNT(*) as badge_count"))
    .join("winners", "earned_badges.winner_id", "=", "winners.id")
    .groupBy("earned_badges.winner_id", "winners.id")
    .where("protocol_id", protocolId)
    .orderBy("badge_count", "desc");
