import { GraphQLClient } from "graphql-request";
import {
  BADGE_AWARDS,
  BADGE_DEFINITIONS,
  BADGE_TRACKS,
  PROTOCOLS,
  WINNERS,
} from "./constants";

/* Firestore DB Refs */
export const getBadgeTracksRef = (
  firestore: FirebaseFirestore.Firestore,
  protocol: string
) => getProtocolRef(firestore, protocol).collection(BADGE_TRACKS);

export const getWinnerRef = (
  firestore: FirebaseFirestore.Firestore,
  winnerID: string
) => firestore.collection(WINNERS).doc(winnerID);

export const getWinnersRef = (firestore: FirebaseFirestore.Firestore) =>
  firestore.collection(WINNERS);

export const getBadgeDefinitionsRef = (
  firestore: FirebaseFirestore.Firestore,
  protocol: string
) => getProtocolRef(firestore, protocol).collection(BADGE_DEFINITIONS);

export const getBadgeAwardsRef = (
  firestore: FirebaseFirestore.Firestore,
  protocol: string
) => getProtocolRef(firestore, protocol).collection(BADGE_AWARDS);

export const getBadgeAwardRef = (
  firestore: FirebaseFirestore.Firestore,
  protocol: string,
  badgeAwardID: string
) => getBadgeAwardsRef(firestore, protocol).doc(badgeAwardID);

export const getProtocolRef = (
  firestore: FirebaseFirestore.Firestore,
  protocol: string
) => firestore.collection(PROTOCOLS).doc(protocol);

/* GraphQL */
export const querySubgraph = async ({
  subgraph,
  query,
  variables,
}: {
  subgraph: string;
  query: string;
  variables?: Record<string, any>;
}) => {
  const graphQLClient = new GraphQLClient(subgraph);
  const { data } = await graphQLClient.rawRequest(query, variables);
  return data;
};
