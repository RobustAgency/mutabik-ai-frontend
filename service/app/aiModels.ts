import { api, ApiResponse } from "@/lib/api";

export interface AiModel {
  id: number;
  display_id: string;
  name: string;
  description: string | null;
  primary_category:
    | "traditional_ml"
    | "deep_learning"
    | "generative_ai"
    | "ai_agents"
    | "specialized_ai"
    | "foundation_models"
    | "multimodal_ai";
  type:
    | "classification"
    | "regression"
    | "clustering"
    | "generation"
    | "translation"
    | "summarization"
    | "question_answering"
    | "recommendation"
    | "optimization"
    | "forecasting";
  domain_specialization:
    | "general"
    | "healthcare"
    | "finance"
    | "legal"
    | "marketing"
    | "hr"
    | "manufacturing"
    | "retail"
    | "automotive"
    | "energy"
    | "telecom"
    | "education";
  organizational_role:
    | "developer"
    | "importer"
    | "deployer"
    | "integrator"
    | "consumer"
    | "collaborator";
  ownership_type:
    | "internal"
    | "external"
    | "joint"
    | "licensed"
    | "open_source"
    | "saas";
  development_source:
    | "internal_development"
    | "external_vendor"
    | "open_source_community"
    | "cloud_provider"
    | "partnership";
  business_status: "planned" | "active" | "deprecated" | "retired";
  operational_status: "not_deployed" | "development" | "testing" | "production";
  strategic_importance?: "low" | "medium" | "high" | "critical";
  regulatory_risk_classification:
    | "minimal_risk"
    | "limited_risk"
    | "high_risk"
    | "unacceptable_risk"
    | "sector_specific";
  source_organization: string | null;
  current_owner: string | null;
  vendor: string | null;
  created_at: string;
  updated_at: string;
  total_versions: number | null;
  model_owner?: string | null;
  regulatory_classification?: string | null;
}

// Data to create a new AI Model
export interface CreateAiModelData {
  name: string;
  description: string | null;
  primary_category:
    | "traditional_ml"
    | "deep_learning"
    | "generative_ai"
    | "ai_agents"
    | "specialized_ai"
    | "foundation_models"
    | "multimodal_ai";
  type:
    | "classification"
    | "regression"
    | "clustering"
    | "generation"
    | "translation"
    | "summarization"
    | "question_answering"
    | "recommendation"
    | "optimization"
    | "forecasting";
  domain_specialization:
    | "general"
    | "healthcare"
    | "finance"
    | "legal"
    | "marketing"
    | "hr"
    | "manufacturing"
    | "retail"
    | "automotive"
    | "energy"
    | "telecom"
    | "education";
  organizational_role:
    | "developer"
    | "importer"
    | "deployer"
    | "integrator"
    | "consumer"
    | "collaborator";
  ownership_type:
    | "internal"
    | "external"
    | "joint"
    | "licensed"
    | "open_source"
    | "saas";
  development_source:
    | "internal_development"
    | "external_vendor"
    | "open_source_community"
    | "cloud_provider"
    | "partnership";
  business_status: "planned" | "active" | "deprecated" | "retired";
  operational_status: "not_deployed" | "development" | "testing" | "production";
  strategic_importance?: "low" | "medium" | "high" | "critical";
  regulatory_risk_classification:
    | "minimal_risk"
    | "limited_risk"
    | "high_risk"
    | "unacceptable_risk"
    | "sector_specific";
  source_organization: string | null;
  current_owner: string | null;
  vendor: string | null;
}

export interface AiModelFilters {
  search?: string;
  primary_category?: string;
  model_type?: string;
  ownership_type?: string;
  business_status?: string;
  operational_status?: string;
  regulatory_classification?: string;
  page?: number;
  per_page?: number;
}

// AI Model Service
export class AiModelService {
  async getAiModels(): Promise<ApiResponse<{ data: AiModel[] }>> {
    return api.get("/ai-models");
  }

  async getAiModel(id: number): Promise<ApiResponse<AiModel>> {
    return api.get(`/ai-models/${id}`);
  }

  async createAiModel(data: CreateAiModelData): Promise<ApiResponse<AiModel>> {
    return api.post("/ai-models", data);
  }

  async updateAiModel(
    id: number,
    data: Partial<CreateAiModelData>
  ): Promise<ApiResponse<AiModel>> {
    return api.put(`/ai-models/${id}`, data);
  }

  async deleteAiModel(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/ai-models/${id}`);
  }
}

export const aiModelService = new AiModelService();
