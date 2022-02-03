import { gql } from "graphql-request";
// TODO REplace with badgeAwards
export const queryLastBadgeAward = gql`
  query LastBadgeAwarded($protocolId: String!) {
    allDefinitionsList(
      filter: { protocolId: { equalTo: $protocolId } }
      first: 1
      orderBy: ID_DESC
    ) {
      id
    }
  }
`;
