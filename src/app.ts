require("dotenv").config();

import cors, { CorsOptions } from "cors";
import express from "express";
import { postgraphile } from "postgraphile";
import {
  connectionString,
  getPostgraphileOptions,
  port,
  schemas,
} from "./database/database";
import { makeQueryRunner } from "./database/query-runner";
import { THE_GRAPH } from "./lib/constants";
import {
  populateBadgeTracksAndDefinitions,
  populateEarnedBadges,
  populateWinnerMetadataAndRank,
  populateWinnersGraphDisplayName,
} from "./lib/populate";

require("express-async-errors");

const postgraphileMiddleware = postgraphile(
  connectionString,
  schemas,
  getPostgraphileOptions({ isMiddleware: true })
);

const whitelist = ["https://emblemdao.com"];

const isDev = process.env.NODE_ENV === "development";
console.log({ NODE_ENV: process.env.NODE_ENV });

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // const whitelisted = whitelist.includes(origin as string) || isDev;
    const whitelisted = true; // TODO: Lock down to only allow whitelisted origins
    whitelisted
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
};

const app = express();

app.use(cors(corsOptions));

app.use(postgraphileMiddleware);

app.listen(port, () => {
  console.log(`PostGraphile listening on ${port} 🚀`);
});

app.get("/populate/:protocol", async (req, res) => {
  const protocol = req.params.protocol;
  const validProtocols = [THE_GRAPH];

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

    res.send("Finished!");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
