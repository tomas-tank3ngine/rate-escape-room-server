/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("rooms", (table) => {
    table.uuid("id").primary();
    //make a new int field called owner_id
    table.uuid("owner_id").notNullable();

    //using the specified field, write to it by
    //referencing the associated id in the associated table - when it updates, cascade all data
    table
      .foreign("owner_id")
      .references("id")
      .inTable("owners")
      .onUpdate("CASCADE");
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.string("theme").notNullable();
    table.string("address");
    table.string("cost");
    table.integer("group_size").notNullable();
    table.integer("duration").notNullable();
    table.string("difficulty");
    table.float("success_rate");
    table.float("overall_rating");
    table.float("atmosphere_rating");
    table.float("puzzle_fairness_rating");
    table.float("tech_rating");
    table.float("storyline_rating");
    table.float("staff_rating");
    table.string("thumbnail");
    table.string("website_url");

    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("rooms");
};
