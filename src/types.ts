export interface EarnedBadge {
  id: string;
  winner: Winner;
  blockAwarded: number;
  timestampAwarded: number;
  timestampAwardedFormatted: string;
  definition: BadgeDefinition;
  transactionHash: string;
  globalAwardNumber: number;
  awardNumber: number;
  metadata: string;
}

export interface MiniWinner {
  id: string;
  ens: string;
  lastAwarded: Record<string, number>;
  roles: Record<string, Record<string, boolean>>;
  awards: Record<string, Record<string, Partial<EarnedBadge>>>;
}
export interface TokenLockWallet {
  id: string;
  beneficiary: {
    id: string;
  };
}

export interface GraphAccount {
  id: string;
  defaultDisplayName: string;
  tokenLockWallets: TokenLockWallet[];
}

export interface Winner {
  id: string;
  awardCount: number;
  rank: number | null;
  badges: EarnedBadge[];
  ens?: string;
  protocolRoles: string[];
  lastEarnedBadgeed: EarnedBadge;
  graphAccount?: GraphAccount;
  tokenLockWalletID?: string;
}

export interface BadgeDefinition {
  id: string;
  metric: string;
  threshold: number;
  ipfsURI?: string;
  trackId?: string;
  // awardCount: number;
  // winnerCount?: number;
}

export interface BadgeTrack {
  id: string;
  badgeDefinitions: BadgeDefinition[];
  protocolRole: string;
}

export interface Protocol {
  id: string;
  urlHandle: string;
  description: string;
  website: string;
}

export interface SummaryStats {
  id: string;
  name: string;
  totalBadgeDefinitions: string;
  totalWinners: number;
  totalWinnersByBadge: Record<string, number>;
  protocolRoles: string[];
  protocolRolesByBadge: Record<string, number>;
}
