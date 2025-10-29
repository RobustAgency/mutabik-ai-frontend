export interface FormDataType {
  // Basic Info
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
  model_type:
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

  // Technical Details
  business_status: "planned" | "active" | "deprecated" | "retired";
  operational_status: "not_deployed" | "development" | "testing" | "production";
  regulatory_classification:
    | "minimal_risk"
    | "limited_risk"
    | "high_risk"
    | "unacceptable_risk"
    | "sector_specific";

  // Ownership & Governance
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
  source_organization: string | null;
  model_owner: string | null;
  vendor_id: string | null;
}
