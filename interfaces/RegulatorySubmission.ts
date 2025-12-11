import { PaginatedResponse } from "./Pagination";
import { Framework } from "./Framework";
import { User } from "./User";

export enum RegulatorySubmissionTypeEnum {
  REGISTRATION = "registration",
  NOTIFICATION = "notification",
  CONFORMITY_ASSESSMENT = "conformity_assessment",
  INCIDENT_REPORT = "incident_report",
  DPIA_FILING = "dpia_filing",
  RENEWAL = "renewal",
  AUDIT_RESPONSE = "audit_response",
}

export enum RegulatorySubmissionStatusEnum {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  ACKNOWLEDGED = "acknowledged",
  APPROVED = "approved",
  REJECTED = "rejected",
  CLOSED = "closed",
}

export interface RegulatorySubmission {
  id: number;
  framework_id?: number | null;
  ai_model_id?: number | null;
  authority: string;
  jurisdiction: string[];
  submission_type: RegulatorySubmissionTypeEnum;
  content_summary: string;
  tracking_id: string;
  commitments: string[];
  status: RegulatorySubmissionStatusEnum;
  renewal_due_at: string;
  evidence_bundle_ids: number[];
  submitted_at: string;
  submitted_by: number;
  documents_uri: string;
  created_at: string;
  updated_at: string;
  framework?: Framework;
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
  submittedBy?: User;
  submitted_by_user?: User;
}

export interface RegulatorySubmissionFilters extends Record<string, unknown> {
  authority?: string;
  submission_type?: RegulatorySubmissionTypeEnum;
  status?: RegulatorySubmissionStatusEnum;
  page?: number;
  per_page?: number;
}

export interface CreateRegulatorySubmissionRequest {
  framework_id?: number | null;
  ai_model_id?: number | null;
  authority: string;
  jurisdiction: string[];
  submission_type: RegulatorySubmissionTypeEnum;
  content_summary: string;
  tracking_id: string;
  commitments: string[];
  status: RegulatorySubmissionStatusEnum;
  renewal_due_at: string;
  evidence_bundle_ids: number[];
  submitted_at: string;
  submitted_by: number;
  documents_uri: string;
}

export interface UpdateRegulatorySubmissionRequest extends Partial<CreateRegulatorySubmissionRequest> {}

export type RegulatorySubmissionListMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
};

export type RegulatorySubmissionListResponse = {
  error?: boolean;
  message?: string;
  data?: {
    data?: RegulatorySubmission[];
    meta?: RegulatorySubmissionListMeta;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
};

export type RegulatorySubmissionSingleResponse = {
  error?: boolean;
  message?: string;
  data?: RegulatorySubmission;
};

