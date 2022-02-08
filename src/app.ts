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
