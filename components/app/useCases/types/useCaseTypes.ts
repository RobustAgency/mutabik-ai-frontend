// Import types from service layer
import type {
  UseCaseStatus,
  BusinessDomain,
  ROIClassification,
  Priority,
  DataSensitivity,
  RiskLevel,
  HumanOversightMode,
  DataAvailabilityStatus,
  DataReadiness,
} from "@/service/app/useCases";

export interface FormDataType {
  // Step 1: Basic Information
  name: string;
  description: string | null;
  problem_statement: string;
  expected_business_value: string;
  stakeholder_ids: number[];
  business_domain: BusinessDomain | "";
  business_owner_id: number | null;
  technical_owner_id: number | null;
  status: UseCaseStatus;
  target_deployment_date: string | null;
  
  // Step 2: ROI & Business Impact
  expected_roi: number | null;
  budget_allocated: number | null;
  estimated_implementation_cost: number | null;
  estimated_time_savings: number | null;
  estimated_cost_savings: number | null;
  estimated_revenue_impact: number | null;
  estimated_fte_saving: number | null;
  success_metrics: string;
  
  // Step 3: Use Case Classification
  roi_classification: ROIClassification | "";
  priority: Priority | "";
  
  // Step 4: Governance & Risk
  preliminary_risk_level: RiskLevel;
  regulatory_impact: boolean;
  potential_harm: string;
  human_oversight_mode: HumanOversightMode | "";
  
  // Step 5: Data Assessment
  data_sensitivity: DataSensitivity;
  data_availability_status: DataAvailabilityStatus | "";
  data_readiness: DataReadiness | "";
  dependencies: string;
}
