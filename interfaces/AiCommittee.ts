export enum AiCommitteeType {
  GOVERNANCE = "governance",
  ETHICS = "ethics",
  RISK = "risk",
  SECURITY = "security",
  PRIVACY = "privacy",
  PRODUCT_OPS = "product_ops",
  OTHER = "other",
}

export enum AiCommitteeCadence {
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  AD_HOC = "ad_hoc",
}

export interface AiCommittee {
  id: number;
  name: string;
  type: AiCommitteeType;
  charter: string;
  cadence: AiCommitteeCadence;
  owner_team: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiCommitteeFilters {
  type?: AiCommitteeType | null;
  cadence?: AiCommitteeCadence | null;
  active?: boolean | null;
  name?: string | null;
  per_page?: number;
  page?: number;
}

export interface CreateAiCommitteeData {
  name: string;
  type: AiCommitteeType;
  charter: string;
  cadence: AiCommitteeCadence;
  owner_team: string;
  active: boolean;
}

export interface UpdateAiCommitteeData extends Partial<CreateAiCommitteeData> {}

