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
