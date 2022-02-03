const createWinners = (knex) => {
  return knex.schema.createTable("winners", (table) => {
    table.string("id").primary();
    table.string("ens");
  });
};

const createProtocols = (knex) => {
  return knex.schema.createTable("protocols", (table) => {
    table.string("id").primary();
  });
};

const createRoles = (knex) => {
  return knex.schema.createTable("roles", (table) => {
    table.string("id").primary();
    table.string("protocol_id").references("protocols.id").notNullable();

    table.unique(["id", "protocol_id"]);
  });
};

const createRankings = (knex) => {
  return knex.schema.createTable("rankings", (table) => {
    table.increments("id").primary();
    table.integer("rank").notNullable();
    table.string("winner_id").references("winners.id").notNullable();
    table.string("protocol_id").references("protocols.id").notNullable();
  });
};

const createDefinitions = (knex) => {
  return knex.schema.createTable("definitions", (table) => {
    table.string("id").primary();
    table.string("protocol_id").references("protocols.id").notNullable();
    table.string("role_id").references("roles.id");
    table.string("track_id").references("tracks.id").notNullable();
    table.string("definition");
    table.string("metric");
    table.string("threshold");
    table.string("ipfs_uri");

    table.unique(["id", "protocol_id"]);
  });
};

const createTracks = (knex) => {
  return knex.schema.createTable("tracks", (table) => {
    table.string("id").primary();
    table.string("protocol_id").references("protocols.id").notNullable();
    table.unique(["id", "protocol_id"]);
  });
};

const createAwards = (knex) => {
  return knex.schema.createTable("awards", (table) => {
    table.increments("id").primary();
    table.string("definition_id").references("definitions.id").notNullable();
    table.string("winner_id").references("winners.id").notNullable();
    table.integer("block_awarded");
    table.string("transaction_hash");
    table.string("award_number");
    table.string("global_award_number");
  });
};

exports.up = async function (knex) {
  await createWinners(knex);
  await createProtocols(knex);
  await createTracks(knex);

  await createRoles(knex);
  await createRankings(knex);
  await createDefinitions(knex);
  await createAwards(knex);
  return true;
};

const tables = [
  "winners",
  "protocols",
  "rankings",
  "roles",
  "definitions",
  "awards",
  "tracks",
];

exports.down = function (knex) {
  return Promise.all(
    tables.map(async function (table) {
      try {
        console.log(table, "down start");
        await knex.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        console.log(table, "down finish");
      } catch (err) {
        console.error(err.detail);
      }

      return true;
    })
  );
};
