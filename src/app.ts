import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { postgraphile } from "postgraphile";
import { THE_GRAPH } from "./constants";
import {
  connectionString,
  getPostgraphileOptions,
  port,
  schemas,
} from "./database/database";
import { makeQueryRunner } from "./database/query-runner";
import {
  populateBadgeTracksAndDefinitions,
  populateEarnedBadges,
  populateWinnerMetadataAndRank,
} from "./populate";

require("express-async-errors");

dotenv.config();

const postgraphileMiddleware = postgraphile(
  connectionString,
  schemas,
  getPostgraphileOptions({ isMiddleware: true })
);

const app = express();

app.use(postgraphileMiddleware);

app.listen(port, () => {
  console.log(`PostGraphile listening on ${port} 🚀`);
});

const validProtocols = [THE_GRAPH];

app.get("/populate/:protocol", async (req: Request, res: Response) => {
  const { protocol } = req.params;
  if (!validProtocols.includes(protocol)) {
    res.status(500).send("Protocol Not Found");
    return;
  }

  const queryRunner = await makeQueryRunner(
    connectionString,
    schemas,
    getPostgraphileOptions({ isMiddleware: false })
  );
  await populateBadgeTracksAndDefinitions(protocol, queryRunner);
  await populateEarnedBadges(protocol, queryRunner);
  await populateWinnerMetadataAndRank(protocol, queryRunner);
  await queryRunner.release();
  res.sendStatus(200);
});
