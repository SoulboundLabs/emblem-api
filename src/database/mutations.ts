import { gql } from "graphql-request";

export const upsertAccount = gql`
  mutation UpsertAccount($ens: String) {
    upsertAccount(input: { account: { id: "55", ens: $ens } }) {
      account {
        id
        ens
      }
    }
  }
`;

export const upsertProtocol = gql`
  mutation UpsertProtocol($id: String!) {
    upsertProtocol(input: { protocol: { id: $id } }) {
      protocol {
        id
      }
    }
  }
`;

export const upsertTrack = gql`
  mutation UpsertTrack($id: String!, $protocolId: String!, $roleId: String) {
    upsertTrack(
      input: { track: { id: $id, protocolId: $protocolId, roleId: $roleId } }
    ) {
      track {
        id
        protocolId
      }
    }
  }
`;

export const upsertRole = gql`
  mutation UpsertRole($id: String!, $protocolId: String!) {
    upsertRole(input: { role: { id: $id, protocolId: $protocolId } }) {
      role {
        id
        protocolId
      }
    }
  }
`;

export const upsertWinnerRole = gql`
  mutation UpsertRole(
    $winnerId: String!
    $protocolId: String!
    $roleId: String!
    $soulScore: Int!
  ) {
    upsertWinnerRole(
      input: {
        winnerRole: {
          winnerId: $winnerId
          protocolId: $protocolId
          roleId: $roleId
          soulScore: $soulScore
        }
      }
    ) {
      winnerRole {
        winnerId
        protocolId
      }
    }
  }
`;

export const upsertWinner = gql`
  mutation UpsertWinnner(
    $id: String!
    $ens: String
    $defaultDisplayName: String
  ) {
    upsertWinner(
      input: {
        winner: { id: $id, ens: $ens, defaultDisplayName: $defaultDisplayName }
      }
    ) {
      winner {
        id
      }
    }
  }
`;

export const upsertRanking = gql`
  mutation UpsertRankings(
    $winnerId: String!
    $protocolId: String!
    $soulScore: Int!
    $rank: Int!
  ) {
    upsertRanking(
      input: {
        ranking: {
          winnerId: $winnerId
          protocolId: $protocolId
          rank: $rank
          soulScore: $soulScore
        }
      }
    ) {
      ranking {
        winnerId
      }
    }
  }
`;

export const upsertEarnedBadge = gql`
  mutation UpsertEarnedBadge(
    $id: String!
    $blockAwarded: Int!
    $transactionHash: String!
    $timestampAwarded: Int!
    $globalBadgeNumber: Int!
    $awardNumber: Int!
    $metadata: JSON!
    $definitionId: String!
    $protocolId: String!
    $winnerId: String!
  ) {
    upsertEarnedBadge(
      input: {
        earnedBadge: {
          id: $id
          blockAwarded: $blockAwarded
          transactionHash: $transactionHash
          timestampAwarded: $timestampAwarded
          globalBadgeNumber: $globalBadgeNumber
          awardNumber: $awardNumber
          metadata: $metadata
          definitionId: $definitionId
          protocolId: $protocolId
          winnerId: $winnerId
        }
      }
    ) {
      earnedBadge {
        blockAwarded
        transactionHash
        timestampAwarded
        globalBadgeNumber
        awardNumber
        metadata
        definitionId
        protocolId
      }
    }
  }
`;

export const upsertBadgeDefinition = gql`
  mutation UpsertBadgeDefinition(
    $id: String!
    $protocolId: String!
    $soulScore: Int
    $threshold: Float!
    $metric: String!
    $ipfsURI: String
    $trackId: String!
    $description: String
    $level: Int
  ) {
    upsertDefinition(
      input: {
        definition: {
          id: $id
          metric: $metric
          threshold: $threshold
          ipfsUri: $ipfsURI
          trackId: $trackId
          soulScore: $soulScore
          protocolId: $protocolId
          description: $description
          level: $level
        }
      }
    ) {
      definition {
        id
        protocolId
      }
    }
  }
`;
