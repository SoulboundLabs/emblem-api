import { Model } from "objection";

export class Account extends Model {
  static get tableName() {
    return "accounts";
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
          from: "accounts.id",
          to: "hearts.receiverId",
        },
      },

      given_hearts: {
        relation: Model.HasManyRelation,
        modelClass: Heart,
        join: {
          from: "accounts.id",
          to: "hearts.giverId",
        },
      },
    };
  }
}
