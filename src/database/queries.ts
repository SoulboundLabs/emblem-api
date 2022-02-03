import { gql } from "graphql-request";
// TODO REplace with badgeAwards
export const queryLastEarnedBadge = gql`
  query LastEarnedBadgeed($protocolId: String!) {
    allDefinitionsList(
      filter: { protocolId: { equalTo: $protocolId } }
      first: 1
      orderBy: ID_DESC
    ) {
      id
    }
  }
`;
