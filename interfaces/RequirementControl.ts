import { PaginatedResponse } from "./Pagination";
import { Requirement } from "./Requirement";
import { Control } from "./Control";
import { User } from "./User";

export enum RequirementControlCoverageEnum {
  FULL = "full",
  PARTIAL = "partial",
  NOT_APPLICABLE = "not_applicable",
}

export enum RequirementControlReviewStatusEnum {
  DRAFT = "draft",
  PEER_REVIEWED = "peer_reviewed",
  APPROVED = "approved",
}

export interface RequirementControl {
  id: number;
  requirement_id: number;
  control_id: number;
  ai_model_id?: number | null;
  coverage: RequirementControlCoverageEnum;
  interpretation_notes: string;
  residual_gaps: string;
  review_status?: RequirementControlReviewStatusEnum | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  user_id?: number;
  created_at: string;
  updated_at: string;
  requirement?: Requirement;
  control?: Control;
  user?: User;
}

export interface RequirementControlFilters extends Record<string, unknown> {
  search?: string;
  requirement_id?: string | number;
  control_id?: string | number;
  ai_model_id?: string | number;
  coverage?: RequirementControlCoverageEnum;
  review_status?: RequirementControlReviewStatusEnum;
  page?: number;
  per_page?: number;
}

export interface CreateRequirementControlRequest {
  requirement_id: number;
  control_id: number;
  ai_model_id?: number | null;
  coverage: RequirementControlCoverageEnum;
  interpretation_notes: string;
  residual_gaps: string;
  review_status?: RequirementControlReviewStatusEnum | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
}

export interface UpdateRequirementControlRequest extends Partial<CreateRequirementControlRequest> {}

export type RequirementControlListMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
};

export type RequirementControlListResponse = {
  error?: boolean;
  message?: string;
  data?: {
    data?: RequirementControl[];
    meta?: RequirementControlListMeta;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
};

export type RequirementControlSingleResponse = {
  error?: boolean;
  message?: string;
  data?: RequirementControl;
};

