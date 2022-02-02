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
    createProtocol(input: { id: { id: $id } }) {
      protocol {
        id
      }
    }
  }
`;

export const upsertTrack = gql`
  mutation UpsertTrack($id: String!, $protocol: String!) {
    upsertTrack(input: { track: { id: $id, protocol: $protocol } }) {
      track {
        id
        protocol
      }
    }
  }
`;

export const upsertBadgeDefinition = gql`
  mutation UpsertBadgeDefinition(
    $id: String!
    $protocol_id: String!
    $threshold: String!
    $metric: String!
    $ipfsURI: String
  ) {
    upsertBadgeDefinition(
      input: {
        track: {
          id: $id
          metric: $metric
          threshold: $threshold
          protocol_id: $protocol
          ipfsURI: $ipfsURI
        }
      }
    ) {
      badgeDefinition {
        id
        protocol
      }
    }
  }
`;
