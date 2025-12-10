import {
  KriIndicator,
  ActionOnBreach,
  AlertRouting,
  CollectionMethod,
  Directionality,
  Frequency,
  KriStatus,
} from "@/interfaces/KriIndicator";

export type FormState = {
  ai_risk_register_id: string;
  name: string;
  definition: string;
  directionality: Directionality;
  unit: string;
  sample_window: string;
  threshold_warning: string;
  threshold_critical: string;
  data_source_id: string; // Store ID for dropdown selection
  data_source: string; // Store name for API submission
  collection_method: CollectionMethod;
  frequency: Frequency;
  alert_routing: AlertRouting;
  action_on_breach: ActionOnBreach;
  status: KriStatus;
  owner_team: string;
  notes: string;
};

export const getInitialState = (initial?: KriIndicator): FormState => ({
  ai_risk_register_id:
    initial?.ai_risk_register_id?.toString() ??
    // Fallback if backend returns nested ai_risk_register instead of ai_risk_register_id
    (initial as any)?.ai_risk_register?.id?.toString() ??
    "",
  name: initial?.name ?? "",
  definition: initial?.definition ?? "",
  directionality: initial?.directionality ?? Directionality.LOWER_IS_RISKIER,
  unit: initial?.unit ?? "",
  sample_window: initial?.sample_window ?? "",
  threshold_warning: initial?.threshold_warning?.toString() ?? "",
  threshold_critical: initial?.threshold_critical?.toString() ?? "",
  data_source_id: "", // Will be set when data sources are loaded
  data_source: initial?.data_source ?? "",
  collection_method: initial?.collection_method ?? CollectionMethod.SCHEDULED_QUERY,
  frequency: initial?.frequency ?? Frequency.DAILY,
  alert_routing: initial?.alert_routing ?? AlertRouting.RISK_TEAM,
  action_on_breach: initial?.action_on_breach ?? ActionOnBreach.NOTIFY_ONLY,
  status: initial?.status ?? KriStatus.DRAFT,
  owner_team: initial?.owner_team ?? "",
  notes: initial?.notes ?? "",
});

