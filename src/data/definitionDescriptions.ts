import { THE_GRAPH } from "../lib/constants";
import { pluralize } from "../lib/pluralize";

export const definitionDescriptions: Record<
  string,
  Record<string, (threshold: number) => string>
> = {
  [THE_GRAPH]: {
    Allegiance: (threshold: number) =>
      `Receive GRT from ${threshold} ${pluralize({
        singular: "Delegator",
        count: threshold,
      })}`,
    Beacon: (threshold: number) =>
      `Attract ${threshold} GRT of signal from Curators`,
    Guardian: (threshold: number) =>
      `Delegate to ${threshold} ${pluralize({
        singular: "Delegator",
        count: threshold,
      })}`,
    "House Odds": (threshold: number) =>
      `Be the first to curate on your own subgraph`,
    Nexus: (threshold: number) =>
      `Open ${threshold} ${pluralize({
        singular: "Allocation",
        count: threshold,
      })}`,
    Pathfinder: (threshold: number) =>
      `Signal ${threshold} ${pluralize({
        singular: "Subgraph",
        count: threshold,
      })}`,
    "Planet of the Aped": (threshold: number) =>
      `Curate on another user's subgraph within ${threshold} blocks`,
    "Query Collector": (threshold: number) =>
      `Receive ${threshold} GRT in query fees`,
    "Subgraph Alchemist": (threshold: number) =>
      `Index ${threshold} ${pluralize({
        singular: "Subgraph",
        count: threshold,
      })}`,
    "Subgraph Smith": (threshold: number) =>
      `Deploy ${threshold} ${pluralize({
        singular: "Subgraph",
        count: threshold,
      })} to the Decentralized Network`,
  },
};
