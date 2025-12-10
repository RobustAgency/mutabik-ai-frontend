import { PaginatedResponse } from "./Pagination";
import { Framework } from "./Framework";

export type RequirementCategory =
  | "safety"
  | "transparency"
  | "data_oversight"
  | "security"
  | "governance"
  | "risk"
  | "testing"
  | "documentation"
  | "privacy"
  | "human_rights"
  | "other";

export type RequirementPriority = "low" | "medium" | "high";

export interface Requirement {
  id: number;
  reference: string;
  requirement_text?: string | null;
  category: RequirementCategory;
  applicability: string;
  effective_from?: string | null;
  effective_to?: string | null;
  supersedes_req_id?: number | null;
  superseded_by_req_id?: number | null;
  priority: RequirementPriority;
  tags?: string[];
  framework_id: number;
  framework?: Framework;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface RequirementFilters extends Record<string, unknown> {
  search?: string;
  framework_id?: string | number;
  category?: RequirementCategory;
  priority?: RequirementPriority;
  page?: number;
  per_page?: number;
}

export interface CreateRequirementRequest {
  reference: string;
  requirement_text?: string | null;
  category: RequirementCategory;
  applicability: string;
  effective_from?: string | null;
  effective_to?: string | null;
  supersedes_req_id?: number | null;
  superseded_by_req_id?: number | null;
  priority: RequirementPriority;
  tags?: string[];
  framework_id: number;
}

export interface UpdateRequirementRequest extends Partial<CreateRequirementRequest> {}

export interface RequirementsApiResponse {
  data: PaginatedResponse<Requirement>;
  status: number;
  message: string;
  error: boolean;
}

export interface RequirementApiResponse {
  data: Requirement;
  status: number;
  message: string;
  error: boolean;
}
