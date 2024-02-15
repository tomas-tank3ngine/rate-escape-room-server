/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("favorites", (table) => {
        table.uuid("id").primary();
        table.uuid("user_id").notNullable();
        table.uuid("room_id").notNullable();
        table.boolean("isFavorite").defaultTo(false);

        // Add foreign key constraints if needed
        table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table
            .foreign("room_id")
            .references("id")
            .inTable("rooms")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");

        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("favorites");
};
