/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("room_reviews", (table) => {
      table.uuid("id").primary();
      table.integer("player_id").unsigned().notNullable();
      table.foreign("player_id").references("id").inTable("players").onUpdate("CASCADE");
      
      table.integer("room_id").unsigned().notNullable();
      table.foreign("room_id").references("id").inTable("rooms").onUpdate("CASCADE");

      table.string("comment").notNullable();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
  
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("created_at").defaultTo(knex.fn.now());      
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
      return knex.schema.dropTable('room_reviews');
  };
  