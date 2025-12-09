import { api, ApiResponse } from "@/lib/api";

export interface AiModel {
  id: number;
  display_id: string;
  name: string; // Model Name
  model_category:
    | "traditional_ml"
    | "statistical_classical_model"
    | "rule_based_expert_system"
    | "hybrid_rules_ml"
    | "generative_ai_foundation_llm"
    | "generative_ai_fine_tuned_domain_model"
    | "generative_ai_multimodal"
    | "agentic_ai_agent"
    | "autonomous_decision_system"
    | "other";
  type:
    | "classification"
    | "regression"
    | "clustering"
    | "nlp_model"
    | "computer_vision_model"
    | "time_series_forecasting"
    | "recommendation_model"
    | "llm"
    | "other";
  technical_domain:
    | "nlp"
    | "computer_vision"
    | "time_series"
    | "tabular_structured_data"
    | "multimodal"
    | "anomaly_detection"
    | "other";
  model_purpose: string | null;
  criticality_level: "critical" | "high" | "medium" | "low" | null;
  regulatory_risk_tier: "minimal_risk" | "limited_risk" | "high_risk" | null;
  eu_ai_category: "minimal_risk" | "limited_risk" | "high_risk" | "unacceptable_risk" | "not_applicable" | null;
  ownership_category:
    | "internal"
    | "external"
    | "joint"
    | "open_source";
  responsible_org_role:
    | "developer"
    | "deployer"
    | "importer"
    | "provider"
    | "integrator";
  business_owner_id: string | null;
  steward_custodian_id: string | null;
  current_version_id: string | null;
  business_adoption_status: "planned" | "active" | "deprecated" | "retired";
  created_by: string | null;
  created_date: string;
  updated_date: string;
  total_versions: number | null;
}

// Data to create a new AI Model
export interface CreateAiModelData {
  name: string; // Model Name
  category: // Model Category - maps to model_category in DB
    | "traditional_ml"
    | "statistical_classical_model"
    | "rule_based_expert_system"
    | "hybrid_rules_ml"
    | "generative_ai_foundation_llm"
    | "generative_ai_fine_tuned_domain_model"
    | "generative_ai_multimodal"
    | "agentic_ai_agent"
    | "autonomous_decision_system"
    | "other";
  type:
    | "classification"
    | "regression"
    | "clustering"
    | "nlp_model"
    | "computer_vision_model"
    | "time_series_forecasting"
    | "recommendation_model"
    | "llm"
    | "other";
  technical_domain:
    | "nlp"
    | "computer_vision"
    | "time_series"
    | "tabular_structured_data"
    | "multimodal"
    | "anomaly_detection"
    | "other";
  purpose?: string | null; // Model Purpose / Intended Use - maps to model_purpose
  criticality_level?: "critical" | "high" | "medium" | "low" | null;
  regulatory_risk_tier?: "minimal_risk" | "limited_risk" | "high_risk" | null;
  eu_ai_category?: "minimal_risk" | "limited_risk" | "high_risk" | "unacceptable_risk" | "not_applicable" | null;
  ownership_category:
    | "internal"
    | "external"
    | "joint"
    | "open_source";
  responsible_org_role:
    | "developer"
    | "deployer"
    | "importer"
    | "provider"
    | "integrator";
  business_owner_id?: string | null;
  custodian_id?: string | null; // Maps to steward_custodian_id
  business_adoption_status?: "planned" | "active" | "deprecated" | "retired";
}

export interface AiModelFilters {
  search?: string;
  model_category?: string;
  model_type?: string;
  ownership_category?: string;
  business_adoption_status?: string;
  regulatory_risk_tier?: string;
  eu_ai_category?: string;
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
