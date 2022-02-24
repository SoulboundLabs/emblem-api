import { gql } from "graphql-request";
import { MAX_RESULTS } from "../lib/constants";

export const queryAllBadgeTracks = gql`
  query AllBadgeTracks {
    badgeTracks(first: ${MAX_RESULTS}) {
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
    badgeDefinitions(first: ${MAX_RESULTS}) {
      id
      metric {
        id
      }
      threshold
      soulPower
      ipfsURI
      description
    }
  }
`;

export const queryAllEarnedBadges = gql`
  query AllEarnedBadges($lastGlobalBadgeNumberSynced: Int) {
    earnedBadgeCounts(first: ${MAX_RESULTS}, orderBy: globalBadgeNumber, orderDirection: asc, where: { globalBadgeNumber_gt: $lastGlobalBadgeNumberSynced }) {
      globalBadgeNumber
      earnedBadge {
        id
        blockAwarded
        transactionHash
        timestampAwarded
        awardNumber
        badgeWinner {
          id
        }
        metadata {
          name
          value
        }
        definition {
          id
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
