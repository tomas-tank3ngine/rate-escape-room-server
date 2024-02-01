/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("rooms", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("description").notNullable();
      table.string("theme").notNullable();
      table.string("address").notNullable();
      table.string("cost").notNullable();
      table.integer("group-size").notNullable();
      table.integer("duration").notNullable();
      table.string("difficulty").notNullable();
      table.float("success-rate").notNullable();
      table.float("overall-rating").notNullable();
      table.float("atmosphere-rating").notNullable();
      table.float("puzzle-fairness-rating").notNullable();
      table.float("tech-rating").notNullable();
      table.float("storyline-rating").notNullable();
      table.float("staff-rating").notNullable();

      table.timestamp("updated_at").defaultTo(knex.fn.now());  
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
      return knex.schema.dropTable('rooms');
  };