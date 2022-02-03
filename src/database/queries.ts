import { gql } from "postgraphile";

// TODO REplace with badgeAwards
export const queryLastBadgeAward = gql`
  query MyQuery {
    allDefinitionsList(
      filter: { protocolId: { equalTo: "the-graph" } }
      first: 1
      orderBy: ID_DESC
    ) {
      id
    }
  }
`;
