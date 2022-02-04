import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import { postgraphile } from "postgraphile";
import {
  connectionString,
  getPostgraphileOptions,
  port,
  schemas,
} from "./database/database";

require("express-async-errors");

dotenv.config();

const postgraphileMiddleware = postgraphile(
  connectionString,
  schemas,
  getPostgraphileOptions({ isMiddleware: true })
);

const whitelist = ["https://emblemdao.com"];

const isDev = process.env.NODE_ENV === "development";
console.log({ isDev });

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    const whitelisted = whitelist.includes(origin as string) || isDev;
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
