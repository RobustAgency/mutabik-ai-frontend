import { api, ApiResponse } from "@/lib/api";

// Enum types matching backend
export type UseCaseStatus = 
  | "draft"
  | "staging"
  | "under_review"
  | "approved"
  | "rejected"
  | "on_hold"
  | "in_production"
  | "retired";

export type BusinessDomain = 
  | "operations"
  | "finance"
  | "risk"
  | "compliance"
  | "customer_service"
  | "hr"
  | "marketing"
  | "sales"
  | "it"
  | "procurement"
  | "supply_chain"
  | "legal"
  | "strategy"
  | "other";

export type ROIClassification = "high" | "medium" | "low";
export type Priority = "high" | "medium" | "low";

export type DataSensitivity = 
  | "public"
  | "internal"
  | "confidential"
  | "personal_data"
  | "sensitive_data"
  | "highly_sensitive_data";

export type RiskLevel = "low" | "medium" | "high";

export type HumanOversightMode = 
  | "human_in_the_loop"
  | "human_on_the_loop"
  | "human_in_command";

export type DataAvailabilityStatus = 
  | "available"
  | "partially_available"
  | "not_available"
  | "unknown";

export type DataReadiness = 
  | "ready_for_use"
  | "requires_cleaning"
  | "requires_integration"
  | "requires_collection"
  | "not_ready";

export interface UseCase {
  id: number;
  name: string;
  description: string | null;
  problem_statement: string;
  expected_business_value: string;
  
  // Stakeholders
  stakeholder_ids?: number[];
  stakeholders?: Array<{
    id: number;
    name?: string;
    email?: string;
    display_name?: string;
    [key: string]: any;
  }>;
  business_owner_id: number | null;
  business_owner?: {
    id: number;
    email: string;
    display_name?: string;
    [key: string]: any;
  };
  technical_owner_id: number | null;
  technical_owner?: {
    id: number;
    email: string;
    display_name?: string;
    [key: string]: any;
  };
  
  // Classification
  status: UseCaseStatus;
  business_domain: BusinessDomain;
  roi_classification: ROIClassification | null;
  priority: Priority | null;
  
  // ROI & Business Impact
  expected_roi: number; // percentage
  budget_allocated: number | null;
  estimated_implementation_cost?: number | null;
  estimated_time_savings: number;
  estimated_cost_savings: number;
  estimated_revenue_impact: number;
  estimated_fte_saving: number;
  success_metrics: string;
  
  // Governance & Risk
  preliminary_risk_level: RiskLevel;
  regulatory_impact: boolean; // yes/no as boolean
  potential_harm: string;
  human_oversight_mode: HumanOversightMode;
  
  // Data Assessment
  data_sensitivity: DataSensitivity;
  data_availability_status: DataAvailabilityStatus;
  data_readiness: DataReadiness | null;
  dependencies: string; // non-technical dependencies
  
  // Dates
  target_deployment_date: string | null;
  created_at: string;
  updated_at: string;
}

// 🔹 Data to create a new Use Case (matches backend StoreUseCaseRequest)
export interface CreateUseCaseData {
  // Step 1: Basic Information
  name: string; // required, 5-255 chars
  description?: string | null; // nullable, 100-5000 chars
  problem_statement: string; // required, 50-2000 chars
  expected_business_value: string; // required, 50-2000 chars
  stakeholder_ids: number[]; // required array
  business_domain?: BusinessDomain | null; // nullable
  business_owner_id?: number | null; // nullable
  technical_owner_id?: number | null; // nullable
  status?: UseCaseStatus; // nullable, defaults to draft
  target_deployment_date?: string | null; // nullable date
  
  // Step 2: ROI & Business Impact
  expected_roi: number; // required, 0-999.99
  budget_allocated?: number | null; // nullable, min:0
  estimated_implementation_cost?: number | null; // Not in backend but might be added
  estimated_time_savings: number; // required, min:0
  estimated_cost_savings: number; // required, min:0
  estimated_revenue_impact: number; // required, min:0
  estimated_fte_saving: number; // required, integer, min:0
  success_metrics: string; // required, 50-2000 chars
  
  // Step 3: Use Case Classification
  roi_classification?: ROIClassification | null; // nullable
  priority?: Priority | null; // nullable
  
  // Step 4: Governance & Risk
  preliminary_risk_level: RiskLevel; // required
  regulatory_impact: string; // required, 'yes' or 'no'
  potential_harm: string; // required, 50-2000 chars
  human_oversight_mode: HumanOversightMode; // required
  
  // Step 5: Data Assessment
  data_sensitivity: DataSensitivity; // required
  data_availability_status: DataAvailabilityStatus; // required
  data_readiness?: DataReadiness | null; // nullable
  dependencies: string; // required, 0-2000 chars
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
