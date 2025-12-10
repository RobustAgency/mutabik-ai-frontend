/**
 * Risk Management Utility Functions
 * Helper functions for formatting and displaying risk-related data
 */

import { RiskCategory, RiskLevel, RiskDecision, ReviewCadence, RiskStatus } from "@/interfaces/AiRiskRegister";
import { TreatmentType, TreatmentStatus, ResultVerification } from "@/interfaces/AiRiskTreatment";
import { Directionality, CollectionMethod, Frequency, AlertRouting, ActionOnBreach, KriStatus } from "@/interfaces/KriIndicator";

/**
 * Format Risk Category enum to readable string
 */
export const formatRiskCategory = (category: RiskCategory): string => {
  const labels: Record<RiskCategory, string> = {
    [RiskCategory.SAFETY]: "Safety",
    [RiskCategory.PRIVACY]: "Privacy",
    [RiskCategory.BIAS_FAIRNESS]: "Bias & Fairness",
    [RiskCategory.SECURITY]: "Security",
    [RiskCategory.ROBUSTNESS]: "Robustness",
    [RiskCategory.EXPLAINABILITY]: "Explainability",
    [RiskCategory.LEGAL_COMPLIANCE]: "Legal Compliance",
    [RiskCategory.ETHICS]: "Ethics",
    [RiskCategory.AVAILABILITY]: "Availability",
    [RiskCategory.RESILIENCE]: "Resilience",
    [RiskCategory.VENDOR]: "Vendor",
    [RiskCategory.COST]: "Cost",
    [RiskCategory.REPUTATION]: "Reputation",
    [RiskCategory.OTHER]: "Other",
  };
  return labels[category] || category;
};

/**
 * Format Risk Level enum to readable string
 */
export const formatRiskLevel = (level: RiskLevel): string => {
  const labels: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: "Low",
    [RiskLevel.MEDIUM]: "Medium",
    [RiskLevel.HIGH]: "High",
    [RiskLevel.CRITICAL]: "Critical",
  };
  return labels[level] || level;
};

/**
 * Format Risk Decision enum to readable string
 */
export const formatRiskDecision = (decision: RiskDecision): string => {
  const labels: Record<RiskDecision, string> = {
    [RiskDecision.TREAT]: "Treat",
    [RiskDecision.ACCEPT]: "Accept",
    [RiskDecision.TRANSFER]: "Transfer",
    [RiskDecision.AVOID]: "Avoid",
  };
  return labels[decision] || decision;
};

/**
 * Format Review Cadence enum to readable string
 */
export const formatReviewCadence = (cadence: ReviewCadence): string => {
  const labels: Record<ReviewCadence, string> = {
    [ReviewCadence.MONTHLY]: "Monthly",
    [ReviewCadence.QUARTERLY]: "Quarterly",
    [ReviewCadence.SEMI_ANNUAL]: "Semi-Annual",
    [ReviewCadence.ANNUAL]: "Annual",
  };
  return labels[cadence] || cadence;
};

/**
 * Format Risk Status enum to readable string
 */
export const formatRiskStatus = (status: RiskStatus): string => {
  const labels: Record<RiskStatus, string> = {
    [RiskStatus.IDENTIFIED]: "Identified",
    [RiskStatus.ASSESSED]: "Assessed",
    [RiskStatus.IN_TREATMENT]: "In Treatment",
    [RiskStatus.ACCEPTED]: "Accepted",
    [RiskStatus.TRANSFERRED]: "Transferred",
    [RiskStatus.CLOSED]: "Closed",
  };
  return labels[status] || status;
};

/**
 * Format Treatment Type enum to readable string
 */
export const formatTreatmentType = (type: TreatmentType): string => {
  const labels: Record<TreatmentType, string> = {
    [TreatmentType.CORRECTIVE]: "Corrective",
    [TreatmentType.PREVENTIVE]: "Preventive",
    [TreatmentType.DETECTIVE]: "Detective",
    [TreatmentType.TRANSFER_INSURANCE]: "Transfer (Insurance)",
    [TreatmentType.TRANSFER_VENDOR]: "Transfer (Vendor)",
    [TreatmentType.AVOID_CHANGE]: "Avoid/Change",
    [TreatmentType.OTHER]: "Other",
  };
  return labels[type] || type;
};

/**
 * Format Treatment Status enum to readable string
 */
export const formatTreatmentStatus = (status: TreatmentStatus): string => {
  const labels: Record<TreatmentStatus, string> = {
    [TreatmentStatus.NEW]: "New",
    [TreatmentStatus.IN_PROGRESS]: "In Progress",
    [TreatmentStatus.BLOCKED]: "Blocked",
    [TreatmentStatus.PENDING_VERIFICATION]: "Pending Verification",
    [TreatmentStatus.CLOSED]: "Closed",
    [TreatmentStatus.CANCELLED]: "Cancelled",
  };
  return labels[status] || status;
};

/**
 * Format Result Verification enum to readable string
 */
export const formatResultVerification = (verification: ResultVerification): string => {
  const labels: Record<ResultVerification, string> = {
    [ResultVerification.PENDING]: "Pending",
    [ResultVerification.PASSED]: "Passed",
    [ResultVerification.FAILED]: "Failed",
    [ResultVerification.NOT_APPLICABLE]: "Not Applicable",
  };
  return labels[verification] || verification;
};

/**
 * Format Directionality enum to readable string
 */
export const formatDirectionality = (directionality: Directionality): string => {
  const labels: Record<Directionality, string> = {
    [Directionality.HIGHER_IS_RISKIER]: "Higher is Riskier",
    [Directionality.LOWER_IS_RISKIER]: "Lower is Riskier",
  };
  return labels[directionality] || directionality;
};

/**
 * Format Collection Method enum to readable string
 */
export const formatCollectionMethod = (method: CollectionMethod): string => {
  const labels: Record<CollectionMethod, string> = {
    [CollectionMethod.SCHEDULED_QUERY]: "Scheduled Query",
    [CollectionMethod.STREAM_AGGREGATION]: "Stream Aggregation",
    [CollectionMethod.BATCH_IMPORT]: "Batch Import",
    [CollectionMethod.MANUAL_ENTRY]: "Manual Entry",
  };
  return labels[method] || method;
};

/**
 * Format Frequency enum to readable string
 */
export const formatFrequency = (frequency: Frequency): string => {
  const labels: Record<Frequency, string> = {
    [Frequency.QUARTER_HOURLY]: "Quarter Hourly",
    [Frequency.HOURLY]: "Hourly",
    [Frequency.DAILY]: "Daily",
    [Frequency.WEEKLY]: "Weekly",
  };
  return labels[frequency] || frequency;
};

/**
 * Format Alert Routing enum to readable string
 */
export const formatAlertRouting = (routing: AlertRouting): string => {
  const labels: Record<AlertRouting, string> = {
    [AlertRouting.RISK_TEAM]: "Risk Team",
    [AlertRouting.PRODUCT_OPS]: "Product Ops",
    [AlertRouting.SECURITY_IR]: "Security IR",
    [AlertRouting.PRIVACY_OFFICE]: "Privacy Office",
    [AlertRouting.MODEL_OWNER]: "Model Owner",
    [AlertRouting.ON_CALL]: "On Call",
  };
  return labels[routing] || routing;
};

/**
 * Format Action on Breach enum to readable string
 */
export const formatActionOnBreach = (action: ActionOnBreach): string => {
  const labels: Record<ActionOnBreach, string> = {
    [ActionOnBreach.NOTIFY_ONLY]: "Notify Only",
    [ActionOnBreach.OPEN_INCIDENT]: "Open Incident",
    [ActionOnBreach.ESCALATE_COMMITTEE]: "Escalate Committee",
    [ActionOnBreach.TRIGGER_ASSESSMENT]: "Trigger Assessment",
    [ActionOnBreach.AUTO_KILL_SWITCH]: "Auto Kill Switch",
  };
  return labels[action] || action;
};

/**
 * Format KRI Status enum to readable string
 */
export const formatKriStatus = (status: KriStatus): string => {
  const labels: Record<KriStatus, string> = {
    [KriStatus.DRAFT]: "Draft",
    [KriStatus.ACTIVE]: "Active",
    [KriStatus.PAUSED]: "Paused",
    [KriStatus.RETIRED]: "Retired",
  };
  return labels[status] || status;
};

