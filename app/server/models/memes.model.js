"use strict";

const { Model } = require("objection");
const { customAlphabet } = require("nanoid/non-secure");
const nanoid = customAlphabet("0123456789abcdef", 24);

const { memeDb } = require("../../../connections/postgres.init");

Model.knex(memeDb);

class MemesModel extends Model {
    static get tableName() {
        return "memes";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            properties: {
                _id: {
                    type: "string",
                    minLength: 1
                },
                createdAt: {
                    type: "string",
                    format: "date"
                },
                updatedAt: {
                    type: "string",
                    format: "date"
                },
                active: { type: "boolean" },
                publicId: { type: "string", minLength: 1 },
                url: { type: "string", minLength: 1 },
                textX: { type: "number" },
                textY: { type: "number"}
            }
        };
    }

    $beforeInsert() {
        this._id = nanoid();
    }

    $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }

    static async addMeme(publicId, url, textX, textY) {
        return this.query().insert({
            publicId, url, textX, textY
        });
    }
}

module.exports = MemesModel;
