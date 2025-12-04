export interface FormDataType {
  // Basic Information
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
  model_purpose: string | null; // Model Purpose / Intended Use

  // Governance & Regulatory Classification
  criticality_level: "critical" | "high" | "medium" | "low" | null;
  regulatory_risk_tier: "minimal_risk" | "limited_risk" | "high_risk" | null;
  eu_ai_category: "minimal_risk" | "limited_risk" | "high_risk" | "unacceptable_risk" | "not_applicable" | null;

  // Ownership & Responsibility
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
  business_owner_id: string | null; // UUID
  steward_custodian_id: string | null; // UUID

  // Business Adoption Status
  business_adoption_status: "planned" | "active" | "deprecated" | "retired" | null;
}
