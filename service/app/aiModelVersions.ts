import { api, ApiResponse } from "@/lib/api";

export interface AiModelVersion {
  id: number;
  version: string;
  ai_model_id: number;
  description?: string | null;
  version_type: "major" | "minor" | "patch" | "experimental";
  version_role:
    | "original_development"
    | "imported_version"
    | "customized_version"
    | "fine_tuned_version"
    | "deployed_version";
  version_source:
    | "internal_development"
    | "vendor_update"
    | "community_release"
    | "custom_modification"
    | "fine_tuning";
  our_involvement:
    | "full_development"
    | "co_development"
    | "customization"
    | "integration_only"
    | "consumption_only";
  architecture_type:
    | "transformer"
    | "cnn"
    | "rnn"
    | "lstm"
    | "gru"
    | "bert"
    | "gpt"
    | "resnet"
    | "vgg"
    | "efficientnet"
    | "yolo"
    | "unet"
    | "custom";
  complexity_level: "simple" | "moderate" | "complex" | "massive";
  parameter_count?: number | null;
  model_file_size_gb?: number | null;
  training_duration_hours?: number | null;
  input_modalities: string[];
  output_modalities: string[];
  deployment_status:
    | "not_deployed"
    | "deploying"
    | "deployed"
    | "failed"
    | "rollback";
  lifecycle_stage:
    | "development"
    | "testing"
    | "staging"
    | "production"
    | "deprecated"
    | "retired";
  deployment_environments: string[];
  release_date?: string | null;
  has_performance_data: boolean;
  performance_baseline_established: boolean;
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
export interface CreateAiModelVersionData {
  // Core identifiers
  version_number: string;
  version_type: "major" | "minor" | "patch" | "experimental";
  ai_model_id: number;
  description?: string | null;
  release_date?: string | null;
  release_notes?: string | null;

  // Version metadata
  version_role:
    | "original_development"
    | "imported_version"
    | "customized_version"
    | "fine_tuned_version"
    | "deployed_version";
  version_source:
    | "internal_development"
    | "vendor_update"
    | "community_release"
    | "custom_modification"
    | "fine_tuning";
  our_involvement:
    | "full_development"
    | "co_development"
    | "customization"
    | "integration_only"
    | "consumption_only";

  // Technical characteristics
  architecture_type:
    | "transformer"
    | "cnn"
    | "rnn"
    | "lstm"
    | "gru"
    | "bert"
    | "gpt"
    | "resnet"
    | "vgg"
    | "efficientnet"
    | "yolo"
    | "unet"
    | "custom";
  model_file_size_gb?: number | null;
  training_duration_hours?: number | null;
  complexity_level: "simple" | "moderate" | "complex" | "massive";
  parameter_count?: number | null;

  // Modalities (stored as JSON)
  input_modalities?: string[];
  output_modalities?: string[];

  // Deployment / lifecycle / compliance
  deployment_status:
    | "not_deployed"
    | "deploying"
    | "deployed"
    | "failed"
    | "rollback";
  lifecycle_stage:
    | "development"
    | "testing"
    | "staging"
    | "production"
    | "deprecated"
    | "retired";
  deployment_environments?: string[];
  customizations_applied?: any[];

  // Flags
  has_performance_data?: boolean;

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
    return api.post("/ai-model-versions", data);
  }

  async updateAiModelVersion(
    id: number,
    data: Partial<CreateAiModelVersionData>
  ): Promise<ApiResponse<AiModelVersion>> {
    return api.put(`/ai-model-versions/${id}`, data);
  }

  async deleteAiModelVersion(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/ai-model-versions/${id}`);
  }
}

export const aiModelVersionService = new AiModelVersionService();
