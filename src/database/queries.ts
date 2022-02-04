import { gql } from "graphql-request";
import knex from "../../knex/knex";
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

export const queryWinnersByProtocol = gql`
  query WinnerByProtocol($protocolId: String!) {
    allWinnersList(
      filter: {
        earnedBadgesByWinnerIdList: {
          some: { protocolId: { equalTo: $protocolId } }
        }
      }
    ) {
      id
    }
  }
`;

// export const queryWinnersByProtocolBadgeCount = gql`
//   query WinnerByProtocolByBadgeCount($protocolId: String!) {
//     allEarnedBadges(filter: { protocolId: { equalTo: $protocolId } }) {
//       groupedAggregates(groupBy: [WINNER_ID]) {
//         keys
//         distinctCount {
//           id
//         }
//       }
//     }
//   }
// `;

export const queryWinnersWithProtocolBadgeCountKnex = (protocolId: string) =>
  knex
    .from("earned_badges")
    .select(knex.raw("winners.*, COUNT(*) as badge_count"))
    .join("winners", "earned_badges.winner_id", "=", "winners.id")
    .groupBy("earned_badges.winner_id", "winners.id")
    .where("protocol_id", protocolId)
    .orderBy("badge_count", "desc");
