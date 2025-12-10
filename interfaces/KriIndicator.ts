/**
 * KRI Indicator Interfaces
 * Based on API specification from RISK_FRONTEND_API_DOCUMENTATION.md
 */

// Enums as per API specification
export enum Directionality {
  HIGHER_IS_RISKIER = "higher_is_riskier",
  LOWER_IS_RISKIER = "lower_is_riskier",
}

export enum CollectionMethod {
  SCHEDULED_QUERY = "scheduled_query",
  STREAM_AGGREGATION = "stream_aggregation",
  BATCH_IMPORT = "batch_import",
  MANUAL_ENTRY = "manual_entry",
}

export enum Frequency {
  QUARTER_HOURLY = "quarter_hourly",
  HOURLY = "hourly",
  DAILY = "daily",
  WEEKLY = "weekly",
}

export enum AlertRouting {
  RISK_TEAM = "risk_team",
  PRODUCT_OPS = "product_ops",
  SECURITY_IR = "security_ir",
  PRIVACY_OFFICE = "privacy_office",
  MODEL_OWNER = "model_owner",
  ON_CALL = "on_call",
}

export enum ActionOnBreach {
  NOTIFY_ONLY = "notify_only",
  OPEN_INCIDENT = "open_incident",
  ESCALATE_COMMITTEE = "escalate_committee",
  TRIGGER_ASSESSMENT = "trigger_assessment",
  AUTO_KILL_SWITCH = "auto_kill_switch",
}

export enum KriStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PAUSED = "paused",
  RETIRED = "retired",
}

export interface KriIndicator {
  id: number;
  ai_risk_register_id: number;
  name: string;
  definition: string;
  directionality: Directionality;
  unit: string | null;
  sample_window: string;
  threshold_warning: number;
  threshold_critical: number;
  data_source: string;
  collection_method: CollectionMethod;
  frequency: Frequency;
  alert_routing: AlertRouting;
  action_on_breach: ActionOnBreach;
  status: KriStatus;
  owner_team: string;
  notes: string | null;
  organization_id: number;
  created_at: string;
  updated_at: string;
  // Relationships (from show endpoint)
  organization?: {
    id: number;
    name: string;
  };
  aiRiskRegister?: {
    id: number;
    title: string;
  };
  createdBy?: {
    id: number;
    email: string;
  };
}

export interface CreateKriIndicatorData {
  ai_risk_register_id: number;
  name: string;
  definition: string;
  directionality: Directionality;
  unit?: string;
  sample_window: string;
  threshold_warning: number;
  threshold_critical: number;
  data_source: string;
  collection_method: CollectionMethod;
  frequency: Frequency;
  alert_routing: AlertRouting;
  action_on_breach: ActionOnBreach;
  status: KriStatus;
  owner_team: string;
  notes?: string;
}

export interface UpdateKriIndicatorData {
  ai_risk_register_id?: number;
  name?: string;
  definition?: string;
  directionality?: Directionality;
  unit?: string;
  sample_window?: string;
  threshold_warning?: number;
  threshold_critical?: number;
  data_source?: string;
  collection_method?: CollectionMethod;
  frequency?: Frequency;
  alert_routing?: AlertRouting;
  action_on_breach?: ActionOnBreach;
  status?: KriStatus;
  owner_team?: string;
  notes?: string;
}

export interface KriIndicatorFilters {
  name?: string;
  status?: KriStatus;
  frequency?: Frequency;
  directionality?: Directionality;
  collection_method?: CollectionMethod;
  action_on_breach?: ActionOnBreach;
  per_page?: number;
}

