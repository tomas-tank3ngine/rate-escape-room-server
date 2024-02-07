/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("rooms", (table) => {
      table.uuid("id").primary();
      //make a new int field called owner_id
      table.uuid("user_id").notNullable();
  
      //using the specified field, write to it by
      //referencing the associated id in the associated table - when it updates, cascade all data
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE");
      table.string("name").notNullable();
      table.string("description").notNullable();
      table.string("theme").notNullable();
      table.string("address");
      table.string("cost").notNullable();
      table.integer("group_size").notNullable();
      table.integer("duration").notNullable();
      table.string("difficulty").notNullable();
      table.float("completion_rate").defaultTo(0);
      table.float("overall_rating").defaultTo(0);
      table.float("atmosphere_rating").defaultTo(0);
      table.float("puzzle_fairness_rating").defaultTo(0);
      table.float("tech_rating").defaultTo(0);
      table.float("storyline_rating").defaultTo(0);
      table.float("staff_rating").defaultTo(0);
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
  