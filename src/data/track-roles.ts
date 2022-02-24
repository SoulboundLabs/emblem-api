import {
  CURATOR,
  DELEGATOR,
  INDEXER,
  SUBGRAPH_DEVELOPER,
  THE_GRAPH,
} from "../lib/constants";

export const rolesByTrack: Record<string, Record<string, string>> = {
  [THE_GRAPH]: {
    "Delegation Received": INDEXER,
    "Signal Acquired": SUBGRAPH_DEVELOPER,
    "Delegation Diversity": DELEGATOR,
    "Allocation Opened": INDEXER,
    "Signal Diversity": CURATOR,
    "Query Collector": INDEXER,
    "Indexing Diversity": INDEXER,
    "Subgraph Deployed": SUBGRAPH_DEVELOPER,
  },
};
