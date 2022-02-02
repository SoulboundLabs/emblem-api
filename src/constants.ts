import { Contract } from "@ethersproject/contracts";
import { InfuraProvider } from "@ethersproject/providers";
import dotenv from "dotenv";
import ReverseRecordsABI from "./abis/ReverseRecords.json";

dotenv.config();

/* Protocols */
export const THE_GRAPH = "the-graph";
export const UNISWAP = "uniswap";
export const BADGETH = "badgeth";
export const EVEREST = "everest";
export const GITCOIN = "gitcoin";
export const ALCHEMIX = "alchemix";
export const OPENSEA = "opensea";
export const AAVE = "aave";
export const CURVE = "curve";
export const GODS_UNCHAINED = "gods-unchained";
export const COMETH = "cometh";
export const CRYPTO_PUNKS = "crypto-punks";

/* Collections */
export const PROTOCOLS = "protocols";
export const WINNERS = "winners";
export const BADGE_DEFINITIONS = "badgeDefinitions";
export const BADGE_TRACKS = "badgeTracks";
export const BADGE_AWARDS = "badgesAwarded";

/* Subgraphs */
export const subgraphTheGraphBadges = process.env
  .SUBGRAPH_THE_GRAPH_BADGES as string;
export const subgraphTheGraphNetwork = process.env
  .SUBGRAPH_THE_GRAPH_NETWORK as string;

/* Smart Contracts */
const infuraKey = process.env.INFURA_KEY;
export const mainnetProvider = new InfuraProvider("mainnet", infuraKey);
export const ensRecordsMainnetAddress =
  "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C";
export const ensRecordsContract = new Contract(
  ensRecordsMainnetAddress,
  ReverseRecordsABI,
  mainnetProvider
);

/* Misc */
export const MAX_FIRESTORE_BATCH = 497;
