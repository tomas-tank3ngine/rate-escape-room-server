/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("owner_rooms", (table) => {
      table.increments("id").primary();
      table.integer("owner_id").unsigned().notNullable();
      table.foreign("owner_id").references("id").inTable("owners").onUpdate("CASCADE");
      
      table.integer("room_id").unsigned().notNullable();
      table.foreign("room_id").references("id").inTable("rooms").onUpdate("CASCADE");
  
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
      return knex.schema.dropTable('owner_rooms');
  };
  