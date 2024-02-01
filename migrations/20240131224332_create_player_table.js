/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("players", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.string("email").notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('players');
};
