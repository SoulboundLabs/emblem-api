import express = require("express");
import { Request, Response } from "express";
import { postgraphile } from "postgraphile";
import { connectionString, options, port, schemas } from "./database";
import { makeQueryRunner } from "./query-runner";

const middleware = postgraphile(connectionString, schemas, options);

const app = express();
app.use(middleware);

const server = app.listen(port, () => {
  console.log(`PostGraphile listening on ${port} 🚀`);
});

const populateAccount = async () => {
  const queryRunner = await makeQueryRunner(connectionString, schemas, options);

  const result = await queryRunner.query(`query {allAccounts {
    edges {
      node {
        id
      }
    }
  }}
  `);

  await queryRunner.release();

  return result;
};

app.get("/account", async (req: Request, res: Response) => {
  const result = await populateAccount();
  res.send(result);
});

// app.get("/populate-the-graph", async (req: Request, res: Response) => {
//   await populateBadgeDefinitions(THE_GRAPH);
//   await populateBadgeTracks(THE_GRAPH);
//   const badgeAwards = await populateBadgeAwards(THE_GRAPH);
//   const winners = await populateWinners(THE_GRAPH, badgeAwards);
//   const winnersWithNames = await populateWinnersGraphDisplayName(
//     firestore,
//     winners
//   );
//   await mergeWinnerBackToBadgeAwards(THE_GRAPH, winnersWithNames);
//   await populateLeaderboardRankHandler(THE_GRAPH);
//   res.send("winner inserted");
// });
