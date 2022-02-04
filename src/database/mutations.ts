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
  mutation UpsertTrack($id: String!, $protocolId: String!) {
    upsertTrack(input: { track: { id: $id, protocolId: $protocolId } }) {
      track {
        id
        protocolId
      }
    }
  }
`;

export const upsertWinner = gql`
  mutation UpsertWinnner($id: String!, $ens: String) {
    upsertWinner(input: { winner: { id: $id, ens: $ens } }) {
      winner {
        id
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
    $threshold: String!
    $metric: String!
    $ipfsURI: String
    $trackId: String!
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
