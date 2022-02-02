import { Model } from "objection";

export class BadgeDefinition extends Model {
  static get tableName() {
    return "badge_definitions";
  }

  static get idColumn() {
    return ["id", "protocol_id"];
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["id", "metric", "threshold"],

      properties: {
        id: { type: "string" },
        protocol_id: { type: "integer" },
        metric: { type: "string" },
        threshold: { type: "number" },
        ipfsURI: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    const Protocol = require("./Protocol");
    const Track = require("./Track");

    return {
      protocol: {
        relation: Model.BelongsToOneRelation,
        modelClass: Protocol,
        join: {
          from: "badge_definitions.protocol_id",
          to: "protocols.id",
        },
      },
      track: {
        relation: Model.BelongsToOneRelation,
        modelClass: Track,
        join: {
          from: ["badge_definitions.track_id", "badge_definitions.protocol_id"],
          to: ["tracks.id", "tracks.protocol_id"],
        },
      },
    };
  }
}
