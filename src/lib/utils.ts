import { GraphQLClient } from "graphql-request";

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
