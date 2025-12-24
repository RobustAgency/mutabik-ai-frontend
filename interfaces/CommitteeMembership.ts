export enum CommitteeMembershipMemberRole {
  CHAIR = "chair",
  VOTING_MEMBER = "voting_member",
  ADVISOR = "advisor",
  SECRETARY = "secretary",
  OBSERVER = "observer",
}

export enum CommitteeMembershipEligibility {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  TERM_ENDED = "term_ended",
}

export interface CommitteeMembership {
  id: number;
  ai_committee_id: number;
  stakeholder_id: number;
  member_role: CommitteeMembershipMemberRole;
  eligibility: CommitteeMembershipEligibility;
  start_date: string;
  end_date: string | null;
  expertise_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CommitteeMembershipFilters {
  ai_committee_id?: number | null;
  stakeholder_id?: number | null;
  member_role?: CommitteeMembershipMemberRole | null;
  eligibility?: CommitteeMembershipEligibility | null;
  per_page?: number;
  page?: number;
}

export interface CreateCommitteeMembershipData {
  ai_committee_id: number;
  stakeholder_id: number;
  member_role: CommitteeMembershipMemberRole;
  eligibility: CommitteeMembershipEligibility;
  start_date: string;
  end_date?: string | null;
  expertise_tags?: string[];
}

export interface UpdateCommitteeMembershipData extends Partial<CreateCommitteeMembershipData> {}

