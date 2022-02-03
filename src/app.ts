import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { postgraphile } from "postgraphile";
import { THE_GRAPH } from "./constants";
import { connectionString, options, port, schemas } from "./database";
import { populateBadgeTracksAndDefinitions } from "./populate";
import { makeQueryRunner } from "./query-runner";

require("express-async-errors");

dotenv.config();

const middleware = postgraphile(connectionString, schemas, options);

const app = express();
app.use(middleware);

const server = app.listen(port, () => {
  console.log(`PostGraphile listening on ${port} 🚀`);
});

// const populateAccount = async () => {
//   const queryRunner = await makeQueryRunner(connectionString, schemas, options);

//   const result = await queryRunner.query(createAccount, { ens: "Wee" });

//   await queryRunner.release();

//   return result;
// };

// app.get("/account", async (req: Request, res: Response) => {
//   const result = await populateAccount();
//   res.send(result);
// });

app.get("/populate-the-graph", async (req: Request, res: Response) => {
  const queryRunner = await makeQueryRunner(connectionString, schemas, options);
  await populateBadgeTracksAndDefinitions(THE_GRAPH, queryRunner);
  // const badgeAwards = await populateBadgeAwards(THE_GRAPH);
  // const winners = await populateWinners(THE_GRAPH, badgeAwards);
  // const winnersWithNames = await populateWinnersGraphDisplayName(
  //   firestore,
  //   winners
  // );
  // await mergeWinnerBackToBadgeAwards(THE_GRAPH, winnersWithNames);
  // await populateLeaderboardRankHandler(THE_GRAPH);
  await queryRunner.release();
  res.send(200);
});
