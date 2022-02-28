import { gql } from "graphql-request";
import knex from "../../knex/knex";
import { MAX_RESULTS } from "../lib/constants";
export const queryLastEarnedBadge = gql`
  query LastEarnedBadges($protocolId: String!) {
    allEarnedBadgesList(
      filter: { protocolId: { equalTo: $protocolId } }
      first: 1
      orderBy: GLOBAL_BADGE_NUMBER_DESC
    ) {
      id
      globalBadgeNumber
    }
  }
`;

export const queryRecentWinnersByProtocol = gql`
  query RecentWinnerByProtocol($protocolId: String!) {
    allWinnersList(
      filter: {
        earnedBadgesByWinnerId: {
          some: { protocolId: { equalTo: $protocolId } }
        }
      }
      orderBy: EARNED_BADGES_BY_WINNER_ID_MAX_GLOBAL_BADGE_NUMBER_DESC
      first: ${MAX_RESULTS}
    ) {
      id
      earnedBadgesByWinnerIdList {
        id
        globalBadgeNumber
      }
    }
  }
`;

export const queryRoleRankings = gql`
  query Rankings($protocolId: String!, $roleId: String) {
    allRankingsList(
      orderBy: SOUL_SCORE_DESC
      filter: {
        protocolId: { equalTo: $protocolId }
        roleId: { equalTo: $roleId }
      }
    ) {
      winnerId
      soulScore
      protocolId
      roleId
      rank
    }
  }
`;

export const queryProtocolRankings = gql`
  query Rankings($protocolId: String!) {
    allRankingsList(
      orderBy: SOUL_SCORE_DESC
      filter: { protocolId: { equalTo: $protocolId }, roleId: { isNull: true } }
    ) {
      winnerId
      soulScore
      protocolId
      roleId
      rank
    }
  }
`;

export const queryRoles = gql`
  query Roles($protocolId: String!) {
    allRolesList(filter: { protocolId: { equalTo: $protocolId } }) {
      id
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
