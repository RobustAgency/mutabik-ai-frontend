export enum DecisionType {
  APPROVE = "approve",
  DENY = "deny",
  WAIVE = "waive",
  POLICY = "policy",
  ESCALATE = "escalate",
}

export enum DecisionScope {
  MODEL = "model",
  USE_CASE = "use_case",
  CONTROL = "control",
  POLICY = "policy",
  VENDOR = "vendor",
  RELEASE = "release",
  ASSESSMENT = "assessment",
  OTHER = "other",
}

export enum VoteMethod {
  SIMPLE_MAJORITY = "simple_majority",
  SUPER_MAJORITY = "super_majority",
  CONSENSUS = "consensus",
  CHAIR_DECISION = "chair_decision",
}

export enum VoteResult {
  PASSED = "passed",
  FAILED = "failed",
  NOT_APPLICABLE = "not_applicable",
}

export interface CommitteeDecision {
  id: number;
  committee_meeting_id: number;
  decision_type: DecisionType;
  decision_scope: DecisionScope;
  ai_model_id: number | null;
  use_case_id: number | null;
  control_id: number | null;
  related_ref: string | null;
  rationale: string;
  conditions: string | null;
  expiry_date: string | null;
  vote_method: VoteMethod;
  vote_result: VoteResult;
  owner_team: string;
  created_at: string;
  updated_at: string;
  committeeMeeting?: {
    id: number;
    scheduled_at: string;
  };
}

export interface CommitteeDecisionFilters {
  committee_meeting_id?: number | null;
  decision_type?: DecisionType | null;
  decision_scope?: DecisionScope | null;
  vote_result?: VoteResult | null;
  owner_team?: string | null;
  per_page?: number;
  page?: number;
}

export interface CreateCommitteeDecisionData {
  committee_meeting_id: number;
  decision_type: DecisionType;
  decision_scope: DecisionScope;
  ai_model_id?: number | null;
  use_case_id?: number | null;
  control_id?: number | null;
  related_ref?: string | null;
  rationale: string;
  conditions?: string | null;
  expiry_date?: string | null;
  vote_method: VoteMethod;
  vote_result: VoteResult;
  owner_team: string;
}

export interface UpdateCommitteeDecisionData extends Partial<CreateCommitteeDecisionData> {}

