import { Model } from "objection";

export class BadgeDefinition extends Model {
  static get tableName() {
    return "badge_definitions";
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
}
