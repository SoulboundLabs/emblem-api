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
    $rank: Int!
  ) {
    upsertRanking(
      input: {
        ranking: { winnerId: $winnerId, protocolId: $protocolId, rank: $rank }
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
    $globalAwardNumber: Int!
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
          globalAwardNumber: $globalAwardNumber
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
        globalAwardNumber
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
