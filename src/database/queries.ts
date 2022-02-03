import { gql } from "graphql-request";
// TODO REplace with badgeAwards
export const queryLastEarnedBadge = gql`
  query LastEarnedBadges($protocolId: String!) {
    allEarnedBadgesList(
      filter: { protocolId: { equalTo: $protocolId } }
      first: 1
      orderBy: BLOCK_AWARDED_DESC
    ) {
      id
    }
  }
`;
