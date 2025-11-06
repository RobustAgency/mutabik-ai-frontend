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

  // Technical Details
  business_status: "planned" | "active" | "deprecated" | "retired";
  operational_status: "not_deployed" | "development" | "testing" | "production";
  regulatory_risk_classification:
    | "minimal_risk"
    | "limited_risk"
    | "high_risk"
    | "unacceptable_risk"
    | "sector_specific";
  current_version_id: string | null;

  // Ownership & Governance
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
  source_org_stakeholder_id: string | null;
  owner_stakeholder_id: string | null;
  vendor_id: string | null;
  current_owner: string | null;
  creator_email: string;
  organizational_role:
    | "developer"
    | "importer"
    | "deployer"
    | "integrator"
    | "consumer"
    | "collaborator";
}
