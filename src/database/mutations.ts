import { gql } from "graphql-request";
import knex from "../../knex/knex";
export const upsertAccount = gql`
  mutation UpsertAccount($ens: String) {
    upsertAccount(input: { account: { id: "55", ens: $ens } }) {
      account {
        id
        ens
      }
    }
  }
`;

export const upsertProtocol = gql`
  mutation UpsertProtocol($id: String!) {
    upsertProtocol(input: { protocol: { id: $id } }) {
      protocol {
        id
      }
    }
  }
`;

export const upsertTrack = gql`
  mutation UpsertTrack($id: String!, $protocolId: String!, $roleId: String) {
    upsertTrack(
      input: { track: { id: $id, protocolId: $protocolId, roleId: $roleId } }
    ) {
      track {
        id
        protocolId
      }
    }
  }
`;

export const upsertRole = gql`
  mutation UpsertRole($id: String!, $protocolId: String!) {
    upsertRole(input: { role: { id: $id, protocolId: $protocolId } }) {
      role {
        id
        protocolId
      }
    }
  }
`;

export const upsertWinner = gql`
  mutation UpsertWinnner(
    $id: String!
    $ens: String
    $defaultDisplayName: String
  ) {
    upsertWinner(
      input: {
        winner: { id: $id, ens: $ens, defaultDisplayName: $defaultDisplayName }
      }
    ) {
      winner {
        id
      }
    }
  }
`;

export const upsertRanking = gql`
  mutation UpsertRankings(
    $winnerId: String!
    $protocolId: String!
    $soulScore: Int!
    $roleId: String
    $rank: Int!
  ) {
    upsertRanking(
      where: { roleId: $roleId, winnerId: $winnerId, protocolId: $protocolId }
      input: {
        ranking: {
          roleId: $roleId
          winnerId: $winnerId
          protocolId: $protocolId
          rank: $rank
          soulScore: $soulScore
        }
      }
    ) {
      ranking {
        winnerId
      }
    }
  }
`;

const upsert = (
  table: string,
  object: Record<string, any>,
  constraint: string
) => {
  const insert = knex(table).insert(object);
  const update = knex.queryBuilder().update(object);
  return knex.raw(`? ON CONFLICT ${constraint} DO ? returning *`, [
    insert,
    update,
  ]);
};

export const upsertRankingKnex = ({
  winner_id,
  protocol_id,
  soul_score,
  role_id,
  rank,
}: {
  winner_id: string;
  protocol_id: string;
  soul_score: number;
  role_id?: string;
  rank: number;
}) => {
  return upsert(
    "rankings",
    { winner_id, protocol_id, soul_score, role_id, rank },
    "rankings_unique"
  );
};

export const upsertEarnedBadge = gql`
  mutation UpsertEarnedBadge(
    $id: String!
    $blockAwarded: Int!
    $transactionHash: String!
    $timestampAwarded: Int!
    $globalBadgeNumber: Int!
    $awardNumber: Int!
    $metadata: JSON!
    $definitionId: String!
    $protocolId: String!
    $winnerId: String!
  ) {
    upsertEarnedBadge(
      input: {
        earnedBadge: {
          id: $id
          blockAwarded: $blockAwarded
          transactionHash: $transactionHash
          timestampAwarded: $timestampAwarded
          globalBadgeNumber: $globalBadgeNumber
          awardNumber: $awardNumber
          metadata: $metadata
          definitionId: $definitionId
          protocolId: $protocolId
          winnerId: $winnerId
        }
      }
    ) {
      earnedBadge {
        blockAwarded
        transactionHash
        timestampAwarded
        globalBadgeNumber
        awardNumber
        metadata
        definitionId
        protocolId
      }
    }
  }
`;

export const upsertBadgeDefinition = gql`
  mutation UpsertBadgeDefinition(
    $id: String!
    $protocolId: String!
    $soulScore: Int
    $threshold: Float!
    $metric: String!
    $ipfsURI: String
    $trackId: String!
    $description: String
    $level: Int
  ) {
    upsertDefinition(
      input: {
        definition: {
          id: $id
          metric: $metric
          threshold: $threshold
          ipfsUri: $ipfsURI
          trackId: $trackId
          soulScore: $soulScore
          protocolId: $protocolId
          description: $description
          level: $level
        }
      }
    ) {
      definition {
        id
        protocolId
      }
    }
  }
`;
