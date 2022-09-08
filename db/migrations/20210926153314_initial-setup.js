"use strict";

exports.up = function(knex) {
    return knex.schema
        .dropTableIfExists("memes")
        .createTable("memes", function(table) {
            table.string("_id").primary().notNullable();
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt").defaultTo(knex.fn.now());
            table.boolean("active").defaultTo(true);

            table.string("publicId", 255).notNullable();
            table.text("url").notNullable();
            table.integer("textX").defaultTo(0);
            table.integer("textY").defaultTo(0);

            table.unique("publicId");
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable("memes");
};
