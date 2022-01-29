const createAccounts = (knex) => {
  return knex.schema.createTable("accounts", (table) => {
    table.string("id").primary();
    table.string("ens");
  });
};

const createProtocols = (knex) => {
  return knex.schema.createTable("protocols", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
  });
};

const createRoles = (knex) => {
  return knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.integer("protocol_id").references("protocols.id").notNullable();
    table.string("name").notNullable();
  });
};

const createRankings = (knex) => {
  return knex.schema.createTable("rankings", (table) => {
    table.increments("id").primary();
    table.integer("rank").notNullable();
    table.string("account_id").references("accounts.id").notNullable();
    table.integer("protocol_id").references("protocols.id").notNullable();
  });
};

const createDefinitions = (knex) => {
  return knex.schema.createTable("definitions", (table) => {
    table.increments("id").primary();
    table.integer("protocol_id").references("protocols.id").notNullable();
    table.integer("role_id").references("roles.id").notNullable();
    table.string("name").notNullable();
    table.string("definition");
    table.string("metric");
    table.string("threshold");
    table.string("ipfs");
  });
};

const createAwards = (knex) => {
  return knex.schema.createTable("awards", (table) => {
    table.increments("id").primary();
    table.integer("definition_id").references("definitions.id").notNullable();
    table.string("account_id").references("accounts.id").notNullable();
    table.integer("block_awarded");
    table.string("transaction_hash");
    table.string("award_number");
    table.string("global_award_number");
  });
};

exports.up = async function (knex) {
  await createAccounts(knex);
  await createProtocols(knex);
  await createRoles(knex);
  await createRankings(knex);
  await createDefinitions(knex);
  await createAwards(knex);
  return true;
};

const tables = [
  "accounts",
  "protocols",
  "rankings",
  "roles",
  "definitions",
  "awards",
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
