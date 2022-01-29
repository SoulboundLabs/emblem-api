import express = require("express");
import { Request, Response } from "express";
import { postgraphile } from "postgraphile";
import { database, options, port, schemas } from "./database";
import { Account } from "./models/Account";

const middleware = postgraphile(database, schemas, options);

const app = express();
app.use(middleware);

const server = app.listen(port, () => {
  const address = server.address();
  if (typeof address !== "string") {
    const href = `http://localhost:${address.port}${
      options.graphiqlRoute || "/graphiql"
    }`;
    console.log(`PostGraphiQL available at ${href} 🚀`);
  } else {
    console.log(`PostGraphile listening on ${address} 🚀`);
  }
});

app.get("/account", async (req: Request, res: Response) => {
  const accountExample = await Account.query().insert({
    id: "0x1406ae6F7902916Fe585357efIFDd8a412200745",
  });
  res.send("account inserted");
});
