import { api, ApiResponse } from "@/lib/api";

export interface AiModelVersion {
  id: number;
  version_number: string;
  version?: string; // Present in single API response, normalized from version_number in list API
  ai_model_id: number;
  description?: string | null;
  version_type: "major" | "minor" | "patch" | "experimental";
  // Backend field: release_role (mapped from version_role in frontend)
  version_role:
    | "original_release"
    | "patch"
    | "hotfix"
    | "experimental_ab_test";
  // Backend field: source_type (mapped from version_source in frontend)
  version_source:
    | "internal_development"
    | "vendor_model"
    | "open_source"
    | "foundation_model";
  // Backend field: org_involvement (mapped from our_involvement in frontend)
  our_involvement:
    | "full_development"
    | "fine_tuning"
    | "configuration_only"
    | "integration_only";
  architecture_type:
    | "transformer"
    | "cnn"
    | "rnn_lstm_gru"
    | "gradient_boosting"
    | "random_forest"
    | "logistic_regression"
    | "linear_regression"
    | "other";
  complexity_level: "low" | "moderate" | "high" | "very_high";
  parameter_count?: number | null;
  model_file_size_gb?: number | null;
  training_duration_hours?: number | null;
  input_modalities: string[];
  output_modalities: string[];
  deployment_status:
    | "not_deployed"
    | "testing"
    | "staging"
    | "production"
    | "retired";
  lifecycle_stage:
    | "development"
    | "design"
    | "validation"
    | "deployment"
    | "monitoring"
    | "retired";
  deployment_environments: string[];
  release_date?: string | null;
  has_performance_data: boolean;
  performance_baseline_established: boolean;
  // Approval status for promotion/production decisions
  approval_status?: 
    | "pending_review"
    | "approved_for_pilot"
    | "approved_for_production"
    | "rejected"
    | "rolled_back"
    | null;
  compliance_check_status?:
    | "compliant"
    | "non_compliant"
    | "under_review"
    | "not_checked";
  release_notes?: string | null;
  created_at: string;
  updated_at: string;

  // Related model information
  ai_model?: {
    id: number;
    name: string;
    primary_category: string;
    type: string;
  };
}

// Data to create a new AI Model Version
// Note: Frontend uses different field names that get mapped to backend field names
export interface CreateAiModelVersionData {
  // Core identifiers
  version_number: string;
  version: string;
  version_type: "major" | "minor" | "patch" | "experimental";
  ai_model_id: number;
  description?: string | null;
  release_date?: string | null;
  release_notes?: string | null;

  // Version metadata
  // Frontend field: version_role -> Backend field: release_role
  version_role:
    | "original_release"
    | "patch"
    | "hotfix"
    | "experimental_ab_test";
  // Frontend field: version_source -> Backend field: source_type
  version_source:
    | "internal_development"
    | "vendor_model"
    | "open_source"
    | "foundation_model";
  // Frontend field: our_involvement -> Backend field: org_involvement
  our_involvement:
    | "full_development"
    | "fine_tuning"
    | "configuration_only"
    | "integration_only";

  // Technical characteristics
  architecture_type:
    | "transformer"
    | "cnn"
    | "rnn_lstm_gru"
    | "gradient_boosting"
    | "random_forest"
    | "logistic_regression"
    | "linear_regression"
    | "other";
  model_file_size_gb?: number | null;
  training_duration_hours?: number | null;
  complexity_level: "low" | "moderate" | "high" | "very_high";
  parameter_count?: number | null;

  // Modalities (stored as JSON)
  input_modalities?: string[];
  output_modalities?: string[];

  // Deployment / lifecycle / compliance
  deployment_status:
    | "not_deployed"
    | "testing"
    | "staging"
    | "production"
    | "retired";
  lifecycle_stage:
    | "development"
    | "design"
    | "validation"
    | "deployment"
    | "monitoring"
    | "retired";
  deployment_environments?: string[];
  customizations_applied?: any[];

  // Flags
  has_performance_data?: boolean;

  // Approval status (required unless deployment_status is "production")
  approval_status?: 
    | "pending_review"
    | "approved_for_pilot"
    | "approved_for_production"
    | "rejected"
    | "rolled_back"
    | null;

  // Audit fields
  created_by?: string;
  updated_by?: string | null;
}

export interface AiModelVersionFilters {
  search?: string;
  ai_model_id?: number;
  version_type?: string;
  deployment_status?: string;
  lifecycle_stage?: string;
  architecture_type?: string;
  complexity_level?: string;
  page?: number;
  per_page?: number;
}

// Helper function to map frontend field names to backend field names
export function mapToBackendFields(data: Partial<CreateAiModelVersionData>): any {
  const result: any = { ...data };
  
  // Map frontend field names to backend field names (only if present)
  if ('version_role' in data) {
    result.release_role = data.version_role;
    delete result.version_role;
  }
  if ('version_source' in data) {
    result.source_type = data.version_source;
    delete result.version_source;
  }
  if ('our_involvement' in data) {
    result.org_involvement = data.our_involvement;
    delete result.our_involvement;
  }
  
  return result;
}

// Helper function to map backend field names to frontend field names
export function mapFromBackendFields(data: any): any {
  if (!data) return data;
  
  const result: any = { ...data };
  
  // Map backend field names to frontend field names (only if present)
  if ('release_role' in data) {
    result.version_role = data.release_role;
    delete result.release_role;
  }
  if ('source_type' in data) {
    result.version_source = data.source_type;
    delete result.source_type;
  }
  if ('org_involvement' in data) {
    result.our_involvement = data.org_involvement;
    delete result.org_involvement;
  }
  
  return result;
}

// AI Model Version Service
export class AiModelVersionService {
  async getAiModelVersions(
    filters?: AiModelVersionFilters
  ): Promise<ApiResponse<{ data: AiModelVersion[] }>> {
    return api.get("/ai-model-versions", { params: filters });
  }

  async getAiModelVersion(id: number): Promise<ApiResponse<AiModelVersion>> {
    return api.get(`/ai-model-versions/${id}`);
  }

  async createAiModelVersion(
    data: CreateAiModelVersionData
  ): Promise<ApiResponse<AiModelVersion>> {
    // Map frontend field names to backend field names
    const backendData = mapToBackendFields(data);
    return api.post("/ai-model-versions", backendData);
  }

  async updateAiModelVersion(
    id: number,
    data: Partial<CreateAiModelVersionData>
  ): Promise<ApiResponse<AiModelVersion>> {
    // Map frontend field names to backend field names
    const backendData = mapToBackendFields(data);
    return api.put(`/ai-model-versions/${id}`, backendData);
  }

  async deleteAiModelVersion(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/ai-model-versions/${id}`);
  }
}

export const aiModelVersionService = new AiModelVersionService();
