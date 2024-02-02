/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("owner_rooms", (table) => {
      table.uuid("id").primary();
      table.uuid("owner_id").notNullable();
      table.foreign("owner_id").references("id").inTable("owners").onUpdate("CASCADE");
      
      table.uuid("room_id").notNullable();
      table.foreign("room_id").references("id").inTable("rooms").onUpdate("CASCADE");
  
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("created_at").defaultTo(knex.fn.now());      
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
      return knex.schema.dropTable('owner_rooms');
  };
  