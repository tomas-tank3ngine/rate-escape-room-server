/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("reviews", (table) => {
        table.uuid("id").primary();
        table.uuid("player_id").notNullable();
        table.foreign("player_id").references("id").inTable("players").onUpdate("CASCADE");
        
        table.uuid("room_id").notNullable();
        table.foreign("room_id").references("id").inTable("rooms").onUpdate("CASCADE");
  
        table.string("comment").notNullable();
      
    
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.timestamp("created_at").defaultTo(knex.fn.now());      
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('reviews');
};
