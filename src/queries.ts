import { gql } from "graphql-request";
import { MAX_FIRESTORE_BATCH } from "./constants";

export const queryAllBadgeTracks = gql`
  query AllBadgeTracks {
    badgeTracks(first: ${MAX_FIRESTORE_BATCH}) {
      id
      protocolRole
      protocol {
        id
      }

      badgeDefinitions {
        id
        description
        image
        awardCount
      }
    }
  }
`;

export const queryAllBadgeDefinitions = gql`
  query AllBadgeDefinitions {
    badgeDefinitions(first: ${MAX_FIRESTORE_BATCH}) {
      id
      metric
      threshold
      ipfsURI
    }
  }
`;

export const queryAllBadgeAwards = gql`
  query AllBadgeAwards($globalAwardNumberSync: Int) {
    badgeAwards(first: ${MAX_FIRESTORE_BATCH}, orderBy: globalAwardNumber, orderDirection: asc, where: { globalAwardNumber_gt: $globalAwardNumberSync }) {
      id
      winner {
        id
        awardCount
      }
      blockAwarded
      transactionHash
      timestampAwarded
      globalAwardNumber
      awardNumber
      metadata {
        name
        value
      }
      definition {
        id
        badgeTrack {
          id
          protocolRole
        }
      }
    }
  }
`;

export const queryGraphAccountDisplayNames = gql`
  query GraphAccounts($beneficiaryID: String!) {
    graphAccounts(
      where: {
        defaultDisplayName_not: null
        tokenLockWallet_in: $beneficiaryID
      }
    ) {
      id
      defaultDisplayName
    }
  }
`;

// 1. Badgeth awards badges to beneficiary IDs
// 2. Unclear if defaultDisplayName is in beneficiary ID or in tokenLockWallet graphAccounts
// 3. Need to see if we need to query tokenLockWallets { graphAccounts { defaultDisplayName } } and filter from there
export const queryGraphAccountsMainnetNetwork = gql`
  query GraphAccounts($beneficiaryIDs: [String!]!) {
    graphAccounts(
      where: { defaultDisplayName_not: null, id_in: $beneficiaryIDs }
    ) {
      id
      defaultDisplayName
    }
  }
`;
