import { api, ApiResponse } from '@/lib/api';

// 🔹 Backend keys-based Use Case data interface
export interface UseCase {
  id: number;
  title: string; // previously "name"
  description: string | null;
  status:
    | "draft"
    | "under_review"
    | "approved"
    | "in_development"
    | "testing"
    | "staging"
    | "active"
    | "suspended"
    | "deprecated";
  business_domain: string;
  business_objective: string;
  business_owner_email: string;
  technical_owner_email: string;
  regulatory_scope: string[]; // backend expects array
  data_sensitivity: "public" | "internal" | "confidential" | "restricted";
  go_live_date: string | null;

  use_case_type: string;
  value_driver: string;
  expected_roi: number | null;
  implementation_cost: number | null;
  reduction_time: number | null;
  reduction_cost: number | null;
  increase_revenue: number | null;
  risk_avoidance: number | null;
  fte_capacity: number | null;
  overall_risk_score: number | null;
  risk_level: "low" | "medium" | "high" | "critical";
  human_oversigh_mode: string;
  dpia: boolean | null;
  aia: boolean | null;
  data_availability_status: string;
  data_readiness_level: string;
  data_freshness: string;
  created_at: string;
  updated_at: string;
}

// 🔹 Data to create a new Use Case
export interface CreateUseCaseData {
 title: string;
  description: string | null;
  status:
    | "draft"
    | "under_review"
    | "approved"
    | "in_development"
    | "testing"
    | "staging"
    | "active"
    | "suspended"
    | "deprecated";
  business_domain: string;
  business_objective: string;
  business_owner_email: string;
  technical_owner_email: string;
  regulatory_scope: string[]; // ✅ always array
  data_sensitivity: "public" | "internal" | "confidential" | "restricted";
  go_live_date: string | null;

  expected_roi: number | null;
  implementation_cost: number | null;
  reduction_in_time: number | null;
  reduction_in_cost: number | null;
  increase_in_revenue: number | null;
  risk_avoidance: number | null;
  fte_capacity_saved: number | null;

  use_case_type: string;
  value_driver: string;

  overall_risk_score: number | null;
  risk_level: "low" | "medium" | "high" | "critical";
  human_oversight_mode: string;
  dpia: boolean | null;
  aia: boolean | null;

  data_availability_status: string;
  data_readiness_level: string;
  data_freshness: string;
}

// 🔹 Optional filters for listing use cases
export interface UseCaseFilters {
  search?: string;
  use_case_type?: string;
  page?: number;
  per_page?: number;
}

// 🔹 Use Case Service
export class UseCaseService {
 

  async getUseCases(): Promise<ApiResponse<UseCase[]>> {
    return api.get("/ai-model-use-cases");
  }

  async createUseCase(data: CreateUseCaseData): Promise<ApiResponse<UseCase>> {
    return api.post("/ai-model-use-casess", data);
  }

  async updateUseCase(
    id: number,
    data: Partial<CreateUseCaseData>
  ): Promise<ApiResponse<UseCase>> {
    return api.put(`/use-cases/${id}`, data);
  }

  async deleteUseCase(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/use-cases/${id}`);
  }
}

export const useCaseService = new UseCaseService();
