import {
  CURATOR,
  DELEGATOR,
  INDEXER,
  SUBGRAPH_DEVELOPER,
  THE_GRAPH,
} from "../lib/constants";

export const rolesByTrack: Record<string, Record<string, string>> = {
  [THE_GRAPH]: {
    Allegiance: INDEXER,
    Beacon: SUBGRAPH_DEVELOPER,
    Guardian: DELEGATOR,
    "House Odds": CURATOR,
    Nexus: INDEXER,
    Pathfinder: CURATOR,
    "Planet of the Aped": CURATOR,
    "Query Collector": INDEXER,
    Alchemist: INDEXER,
    "Subgraph Smith": SUBGRAPH_DEVELOPER,
  },
};
