/**
 * Risk Methodology Interfaces
 * Based on API specification from RISK_FRONTEND_API_DOCUMENTATION.md
 */

export interface RiskMethodology {
  id: number;
  name: string;
  likelihood_scale: Record<string, string>;
  impact_scale: Record<string, string>;
  matrix_rule: Record<string, string>;
  acceptance_thresholds: string;
  aggregation_logic: string | null;
  review_policy: string;
  effective_from: string | null;
  effective_to: string | null;
  owner_team: string;
  source_created_at: string;
  organization_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRiskMethodologyData {
  name: string;
  likelihood_scale: Record<string, string> | string;
  impact_scale: Record<string, string> | string;
  matrix_rule: Record<string, string>;
  acceptance_thresholds: string;
  aggregation_logic?: string;
  review_policy: string;
  effective_from?: string;
  effective_to?: string;
  owner_team: string;
  source_created_at: string;
}

export interface UpdateRiskMethodologyData {
  name?: string;
  likelihood_scale?: Record<string, string> | string;
  impact_scale?: Record<string, string> | string;
  matrix_rule?: Record<string, string>;
  acceptance_thresholds?: string;
  aggregation_logic?: string;
  review_policy?: string;
  effective_from?: string;
  effective_to?: string;
  owner_team?: string;
  source_created_at?: string;
}

export interface RiskMethodologyFilters {
  name?: string;
  effective_from?: string;
  effective_to?: string;
  per_page?: number;
}

