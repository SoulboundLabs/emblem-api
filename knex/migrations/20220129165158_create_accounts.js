const createWinners = (knex) => {
  return knex.schema.createTable("winners", (table) => {
    table.string("id").primary();
    table.string("ens");
    table.string("default_display_name");
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
    table.string("winner_id").references("winners.id").notNullable();
    table.string("protocol_id").references("protocols.id").notNullable();
    table.integer("rank").notNullable();
    table.primary(["winner_id", "protocol_id"]);
  });
};

const createDefinitions = (knex) => {
  return knex.schema.createTable("definitions", (table) => {
    table.string("id").primary();
    table.string("protocol_id").references("protocols.id").notNullable();
    table.string("track_id").references("tracks.id").notNullable();
    table.string("description");
    table.string("metric");
    table.float("threshold");
    table.string("ipfs_uri");
    table.integer("level");
    table.integer("soul_power");

    table.unique(["id", "protocol_id"]);
  });
};

const createTracks = (knex) => {
  return knex.schema.createTable("tracks", (table) => {
    table.string("id").primary();
    table.string("protocol_id").references("protocols.id").notNullable();
    table.string("role_id").references("roles.id");
  });
};

const createEarnedBadges = (knex) => {
  return knex.schema.createTable("earned_badges", (table) => {
    table.string("id").primary();
    table.string("definition_id").references("definitions.id").notNullable();
    table.string("protocol_id").references("protocols.id").notNullable();
    table.string("winner_id").references("winners.id").notNullable();
    table.integer("block_awarded");
    table.string("transaction_hash");
    table.integer("timestampAwarded");
    table.integer("award_number");
    table.integer("global_badge_number");
    table.jsonb("metadata");
  });
};

exports.up = async function (knex) {
  await createWinners(knex);
  await createProtocols(knex);
  await createRoles(knex);

  await createTracks(knex);

  await createRankings(knex);
  await createDefinitions(knex);
  await createEarnedBadges(knex);
  return true;
};

const tables = [
  "winners",
  "protocols",
  "rankings",
  "roles",
  "definitions",
  "earned_badges",
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
