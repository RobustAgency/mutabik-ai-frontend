import { PaginatedResponse } from "./Pagination";
import { Requirement } from "./Requirement";
import { Control } from "./Control";
import { User } from "./User";

export enum ComplianceEvidenceArtifactTypeEnum {
  DOCUMENT = "document",
  SCREENSHOT = "screenshot",
  LOG = "log",
  TEST_RESULT = "test_result",
  SAMPLE_SET = "sample_set",
  TICKET = "ticket",
  TRANSCRIPT = "transcript",
  SUBMISSION_ACK = "submission_ack",
}

export enum ComplianceEvidenceReviewOutcomeEnum {
  PASS = "pass",
  FAIL = "fail",
  NEEDS_FIX = "needs_fix",
}

export interface ComplianceEvidence {
  id: number;
  project_id?: number | null;
  control_id: number;
  requirement_id?: number | null;
  ai_model_id?: number | null;
  artifact_type: ComplianceEvidenceArtifactTypeEnum;
  artifact_uri: string;
  sample_ids: string[];
  sampling_method: string;
  collection_period_start?: string | null;
  collection_period_end?: string | null;
  collected_by?: number | null;
  review_outcome?: ComplianceEvidenceReviewOutcomeEnum | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  hash_checksum: string;
  created_at: string;
  updated_at: string;
  control?: Control;
  requirement?: Requirement;
  ai_model?: {
    id: number;
    name: string;
    display_id?: string;
  };
  aiModel?: {
    id: number;
    name: string;
    display_id?: string;
  };
  collectedBy?: User;
  reviewedBy?: User;
  collected_by_user?: User;
  reviewed_by_user?: User;
}

export interface ComplianceEvidenceFilters extends Record<string, unknown> {
  search?: string;
  control_id?: string | number;
  requirement_id?: string | number;
  ai_model_id?: string | number;
  project_id?: string | number;
  artifact_type?: ComplianceEvidenceArtifactTypeEnum;
  review_outcome?: ComplianceEvidenceReviewOutcomeEnum;
  page?: number;
  per_page?: number;
}

export interface CreateComplianceEvidenceRequest {
  control_id: number;
  requirement_id?: number | null;
  ai_model_id?: number | null;
  project_id?: number | null;
  artifact_type: ComplianceEvidenceArtifactTypeEnum;
  artifact_uri: string;
  sample_ids: string[];
  sampling_method: string;
  collection_period_start?: string | null;
  collection_period_end?: string | null;
  collected_by?: number | null;
  review_outcome?: ComplianceEvidenceReviewOutcomeEnum | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  hash_checksum: string;
}

export interface UpdateComplianceEvidenceRequest extends Partial<CreateComplianceEvidenceRequest> {}

export type ComplianceEvidenceListMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
};

export type ComplianceEvidenceListResponse = {
  error?: boolean;
  message?: string;
  data?: {
    data?: ComplianceEvidence[];
    meta?: ComplianceEvidenceListMeta;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
};

export type ComplianceEvidenceSingleResponse = {
  error?: boolean;
  message?: string;
  data?: ComplianceEvidence;
};

