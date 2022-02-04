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

export const queryWinnersWithProtocolBadgeCountKnex = () =>
  knex
    .from("earned_badges")
    .select(knex.raw("winners.*, COUNT(*) as badge_count"))
    .join("winners", "earned_badges.winner_id", "=", "winners.id")
    .groupBy("earned_badges.winner_id", "winners.id")
    .where("protocol_id", "the-graph")
    .orderBy("badge_count", "desc");
// export const queryWinnersWithProtocolBadgeCountSQL = `SELECT winners.*, COUNT(*) as badge_count
// FROM earned_badges
// INNER JOIN winners
// ON winners.id = earned_badges.winner_id
// WHERE earned_badges.protocol_id = 'the-graph'
// GROUP BY earned_badges.winner_id, winners.id
// ORDER BY badge_count DESC`
