import { Model } from "objection";

export class BadgeDefinition extends Model {
  static get tableName() {
    return "tracks";
  }

  static get idColumn() {
    return ["id", "protocol_id"];
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
    const Protocol = require("./Protocol");

    return {
      protocol: {
        relation: Model.BelongsToOneRelation,
        modelClass: Protocol,
        join: {
          from: "badge_definitions.protocol_id",
          to: "protocols.id",
        },
      },
    };
  }
}
