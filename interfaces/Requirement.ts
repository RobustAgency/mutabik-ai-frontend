import { PaginatedResponse } from "./Pagination";
import { Framework } from "./Framework";

export interface Requirement {
    id: number;
    name: string;
    code: string;
    description?: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    frameworks?: Framework[];
    frameworks_count?: number | null;
}

export interface RequirementFilters extends Record<string, unknown> {
    search?: string;
    framework_id?: string | number;
    page?: number;
    per_page?: number;
}

export interface CreateRequirementRequest {
    name: string;
    code: string;
    description?: string;
    framework_ids?: number[];
}

export interface UpdateRequirementRequest extends Partial<CreateRequirementRequest> { }

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
