/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("player_fav_rooms", (table) => {
    table.uuid("id").primary();
    //make a new int field called player_id - it is a primary key
    table.uuid("player_id").notNullable();
    
    //using the specified field, write to it by
    //referencing the associated id in the associated table - when it updates, cascade all data
    table.foreign("player_id").references("id").inTable("players").onUpdate("CASCADE");
    
    //Do this for the other table
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
    return knex.schema.dropTable('player_fav_rooms');
};
