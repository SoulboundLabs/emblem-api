import { exit } from "process";
import { THE_GRAPH } from "./constants";
import {
  connectionString,
  getPostgraphileOptions,
  schemas,
} from "./database/database";
import { makeQueryRunner } from "./database/query-runner";
import {
  populateBadgeTracksAndDefinitions,
  populateEarnedBadges,
  populateWinnerMetadataAndRank,
  populateWinnersGraphDisplayName,
} from "./populate";

const validProtocols = [THE_GRAPH];

async function main() {
  const protocol = process.argv.slice(2)[0];

  console.log(
    `Populating tracks, definitions, earned badges, winners, and rankings for: ${protocol}...`
  );

  if (!validProtocols.includes(protocol)) {
    throw new Error("Protocol Not Found");
  }

  try {
    const queryRunner = await makeQueryRunner(
      connectionString,
      schemas,
      getPostgraphileOptions({ isMiddleware: false })
    );
    await populateBadgeTracksAndDefinitions(protocol, queryRunner);
    await populateEarnedBadges(protocol, queryRunner);
    await populateWinnerMetadataAndRank(protocol, queryRunner);
    await populateWinnersGraphDisplayName(protocol, queryRunner);
    queryRunner.release();

    console.log("Finished!");
  } catch (e) {
    console.error(e);
    exit(1);
  } finally {
    exit(0);
  }
}

main();
