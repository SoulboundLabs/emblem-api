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

const app = express();

app.use(postgraphileMiddleware);

app.listen(port, () => {
  console.log(`PostGraphile listening on ${port} 🚀`);
});
