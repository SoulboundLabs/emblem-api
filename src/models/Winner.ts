import { Model } from "objection";

export class Winner extends Model {
  static get tableName() {
    return "winners";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["id"],

      properties: {
        id: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const Heart = require("./Heart");

    return {
      received_hearts: {
        relation: Model.HasManyRelation,
        modelClass: Heart,
        join: {
          from: "winners.id",
          to: "hearts.receiverId",
        },
      },

      given_hearts: {
        relation: Model.HasManyRelation,
        modelClass: Heart,
        join: {
          from: "winners.id",
          to: "hearts.giverId",
        },
      },
    };
  }
}
