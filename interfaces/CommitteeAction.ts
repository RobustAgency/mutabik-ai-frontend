export enum ActionType {
  IMPLEMENT_CHANGE = "implement_change",
  COLLECT_EVIDENCE = "collect_evidence",
  UPDATE_POLICY = "update_policy",
  CONDUCT_ASSESSMENT = "conduct_assessment",
  NOTIFY_REGULATOR = "notify_regulator",
  OTHER = "other",
}

export enum Status {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  BLOCKED = "blocked",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum VerificationResult {
  PENDING = "pending",
  PASSED = "passed",
  FAILED = "failed",
  NOT_APPLICABLE = "not_applicable",
}

export interface CommitteeAction {
  id: number;
  committee_decision_id: number;
  title: string;
  action_type: ActionType;
  assignee_id: number;
  due_date: string;
  status: Status;
  verification_result: VerificationResult;
  evidence_link: string | null;
  notes: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  committeeDecision?: {
    id: number;
    title: string;
  };
  assignee?: {
    id: number;
    name: string;
  };
}

export interface CommitteeActionFilters {
  committee_decision_id?: number | null;
  action_type?: ActionType | null;
  status?: Status | null;
  verification_result?: VerificationResult | null;
  assignee_id?: number | null;
  due_date_from?: string | null;
  due_date_to?: string | null;
  per_page?: number;
  page?: number;
}

export interface CreateCommitteeActionData {
  committee_decision_id: number;
  title: string;
  action_type: ActionType;
  assignee_id: number;
  due_date: string;
  status: Status;
  verification_result: VerificationResult;
  evidence_link?: string | null;
  notes?: string | null;
  closed_at?: string | null;
}

export interface UpdateCommitteeActionData extends Partial<CreateCommitteeActionData> {}

