import { Model } from "objection";

export class Heart extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "hearts";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["receivedId", "giverId"],

      properties: {
        id: { type: "integer" },
        receivedId: { type: ["string"] },
        giverId: { type: "string" },
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    const Heart = require("./Heart");

    return {
      receiver: {
        relation: Model.BelongsToOneRelation,
        modelClass: Heart,
        join: {
          from: "hearts.receiverId",
          to: "winners.id",
        },
      },

      given_hearts: {
        relation: Model.BelongsToOneRelation,
        modelClass: Heart,
        join: {
          from: "hearts.giverId",
          to: "winners.id",
        },
      },
    };
  }
}
