import { api, ApiResponse } from "@/lib/api";

export interface UseCase {
  id: number;
  name?: string; // API returns 'name' instead of 'title' in some cases
  title?: string;
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
  business_owner?: {
    id: number;
    email: string;
    display_name?: string;
    [key: string]: any;
  };
  business_owner_email?: string;
  technical_owner?: {
    id: number;
    email: string;
    display_name?: string;
    [key: string]: any;
  };
  technical_owner_email?: string;
  regulatory_scope?: string[]; // backend expects array
  data_sensitivity: "public" | "internal" | "confidential" | "restricted";
  go_live_date?: string | null;
  target_go_live_date?: string | null;

  use_case_type?: string;
  value_driver?: string;
  expected_roi?: number | null;
  expected_roi_percentage?: string | number | null; // API returns as string "0.00"
  implementation_cost?: number | null;
  estimated_implementation_cost?: number | null;
  reduction_time?: number | null;
  estimated_reduction_in_time?: number | null;
  reduction_cost?: number | null;
  estimated_reduction_in_cost?: number | null;
  increase_revenue?: number | null;
  estimated_revenue_increase?: number | null;
  risk_avoidance?: number | null;
  fte_capacity?: number | null;
  estimated_fte_capacity_saving?: number | null;
  overall_risk_score?: number | null;
  risk_level: "low" | "medium" | "high" | "critical";
  human_oversigh_mode?: string;
  dpia?: boolean | null;
  aia?: boolean | null;
  data_availability_status?: string | null;
  data_readiness?: string | null; // API returns 'data_readiness' instead of 'data_readiness_level'
  data_readiness_level?: string;
  data_freshness?: string;
  created_at: string;
  updated_at: string;
}

// 🔹 Data to create a new Use Case
export interface CreateUseCaseData {
  // Core fields
  name: string;
  description: string | null;
  business_objective: string;
  business_owner_id: string | null;
  technical_owner_id: string | null;
  business_domain:
    | "customer_service"
    | "fraud_detection"
    | "marketing"
    | "operations"
    | "risk_management"
    | "hr"
    | "finance"
    | "legal"
    | "product_development"
    | "supply_chain"
    | "";

  // Classification and Priority
  roi_classification: "High" | "Medium" | "Low" | "";
  priority: "High" | "Medium" | "Low" | "";
  risk_level: "low" | "medium" | "high" | "critical";
  data_sensitivity: "public" | "internal" | "confidential" | "restricted";

  // Financial and Timeline
  expected_roi_percentage: number | null;
  budget_allocated: number | null;
  target_go_live_date: string | null;

  // Status and Tracking
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
  created_by: string;
  updated_by: string | null;

  // Assessment Flags
  roi_assessment: boolean;
  risk_assessment: boolean;
  data_assessment: boolean;

  // Estimated Values
  estimated_implementation_cost: number | null;
  estimated_reduction_in_time: number | null;
  estimated_reduction_in_cost: number | null;
  estimated_revenue_increase: number | null;
  estimated_fte_capacity_saving: number | null;

  // Data Status
  data_availability_status:
    | "available"
    | "partially_available"
    | "not_available"
    | "";
  data_readiness: "D1" | "D2" | "D3" | "D4" | "";
}

export interface UseCaseFilters {
  search?: string;
  use_case_type?: string;
  page?: number;
  per_page?: number;
}

// 🔹 Use Case Service
export class UseCaseService {
  async getUseCases(): Promise<ApiResponse<{ data: UseCase[] }>> {
    return api.get("/use-cases");
  }

  async createUseCase(data: CreateUseCaseData): Promise<ApiResponse<UseCase>> {
    return api.post("/use-cases", data);
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
