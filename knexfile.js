// Update with your config settings.
require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      // user: "emblem",
      // password: "[db_password]",
      database: "emblem",
      charset: "utf8",
    },
    migrations: {
      directory: __dirname + "/knex/migrations",
    },
    seeds: {
      directory: __dirname + "/knex/seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
