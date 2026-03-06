// ─── Permission Action & Module Types ───
export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve";

export type PermissionModule =
  | "core-assets"
  | "risk-management-and-compliance"
  | "privacy-and-data-protection"
  | "governance-and-oversight"
  | "administration";

// ─── All Permission Name Constants ───
// Generated from backend permission seeder. Format: {module}.{resource}.{action}
export const PERMISSIONS = {
  // ═══════════════════════════════════════════════════════════════════
  // CORE ASSETS
  // ═══════════════════════════════════════════════════════════════════

  // AI Models
  AI_MODELS_VIEW: "core-assets.ai-models.view",
  AI_MODELS_CREATE: "core-assets.ai-models.create",
  AI_MODELS_EDIT: "core-assets.ai-models.edit",
  AI_MODELS_DELETE: "core-assets.ai-models.delete",
  AI_MODELS_APPROVE: "core-assets.ai-models.approve",

  // AI Model Versions
  AI_MODEL_VERSIONS_VIEW: "core-assets.ai-model-versions.view",
  AI_MODEL_VERSIONS_CREATE: "core-assets.ai-model-versions.create",
  AI_MODEL_VERSIONS_EDIT: "core-assets.ai-model-versions.edit",
  AI_MODEL_VERSIONS_DELETE: "core-assets.ai-model-versions.delete",
  AI_MODEL_VERSIONS_APPROVE: "core-assets.ai-model-versions.approve",

  // AI Model Cards
  AI_MODEL_CARDS_VIEW: "core-assets.ai-model-cards.view",
  AI_MODEL_CARDS_CREATE: "core-assets.ai-model-cards.create",
  AI_MODEL_CARDS_EDIT: "core-assets.ai-model-cards.edit",
  AI_MODEL_CARDS_DELETE: "core-assets.ai-model-cards.delete",
  AI_MODEL_CARDS_APPROVE: "core-assets.ai-model-cards.approve",

  // Use Cases
  USE_CASES_VIEW: "core-assets.use-cases.view",
  USE_CASES_CREATE: "core-assets.use-cases.create",
  USE_CASES_EDIT: "core-assets.use-cases.edit",
  USE_CASES_DELETE: "core-assets.use-cases.delete",
  USE_CASES_APPROVE: "core-assets.use-cases.approve",

  // AI Model Use Cases
  AI_MODEL_USE_CASES_VIEW: "core-assets.ai-model-use-cases.view",
  AI_MODEL_USE_CASES_CREATE: "core-assets.ai-model-use-cases.create",
  AI_MODEL_USE_CASES_EDIT: "core-assets.ai-model-use-cases.edit",
  AI_MODEL_USE_CASES_DELETE: "core-assets.ai-model-use-cases.delete",
  AI_MODEL_USE_CASES_APPROVE: "core-assets.ai-model-use-cases.approve",

  // AI Assets
  AI_ASSETS_VIEW: "core-assets.ai-assets.view",
  AI_ASSETS_CREATE: "core-assets.ai-assets.create",
  AI_ASSETS_EDIT: "core-assets.ai-assets.edit",
  AI_ASSETS_DELETE: "core-assets.ai-assets.delete",
  AI_ASSETS_APPROVE: "core-assets.ai-assets.approve",

  // AI Model Artifacts
  AI_MODEL_ARTIFACTS_VIEW: "core-assets.ai-model-artifacts.view",
  AI_MODEL_ARTIFACTS_CREATE: "core-assets.ai-model-artifacts.create",
  AI_MODEL_ARTIFACTS_EDIT: "core-assets.ai-model-artifacts.edit",
  AI_MODEL_ARTIFACTS_DELETE: "core-assets.ai-model-artifacts.delete",
  AI_MODEL_ARTIFACTS_APPROVE: "core-assets.ai-model-artifacts.approve",

  // Artifact Access Logs (no edit)
  ARTIFACT_ACCESS_LOGS_VIEW: "core-assets.artifact-access-logs.view",
  ARTIFACT_ACCESS_LOGS_CREATE: "core-assets.artifact-access-logs.create",
  ARTIFACT_ACCESS_LOGS_DELETE: "core-assets.artifact-access-logs.delete",
  ARTIFACT_ACCESS_LOGS_APPROVE: "core-assets.artifact-access-logs.approve",

  // Stakeholders
  STAKEHOLDERS_VIEW: "core-assets.stakeholders.view",
  STAKEHOLDERS_CREATE: "core-assets.stakeholders.create",
  STAKEHOLDERS_EDIT: "core-assets.stakeholders.edit",
  STAKEHOLDERS_DELETE: "core-assets.stakeholders.delete",
  STAKEHOLDERS_APPROVE: "core-assets.stakeholders.approve",

  // Vendors
  VENDORS_VIEW: "core-assets.vendors.view",
  VENDORS_CREATE: "core-assets.vendors.create",
  VENDORS_EDIT: "core-assets.vendors.edit",
  VENDORS_DELETE: "core-assets.vendors.delete",
  VENDORS_APPROVE: "core-assets.vendors.approve",

  // Agreements
  AGREEMENTS_VIEW: "core-assets.agreements.view",
  AGREEMENTS_CREATE: "core-assets.agreements.create",
  AGREEMENTS_EDIT: "core-assets.agreements.edit",
  AGREEMENTS_DELETE: "core-assets.agreements.delete",
  AGREEMENTS_APPROVE: "core-assets.agreements.approve",

  // Datasets
  DATASETS_VIEW: "core-assets.datasets.view",
  DATASETS_CREATE: "core-assets.datasets.create",
  DATASETS_EDIT: "core-assets.datasets.edit",
  DATASETS_DELETE: "core-assets.datasets.delete",
  DATASETS_APPROVE: "core-assets.datasets.approve",

  // Data Sources
  DATA_SOURCES_VIEW: "core-assets.data-sources.view",
  DATA_SOURCES_CREATE: "core-assets.data-sources.create",
  DATA_SOURCES_EDIT: "core-assets.data-sources.edit",
  DATA_SOURCES_DELETE: "core-assets.data-sources.delete",
  DATA_SOURCES_APPROVE: "core-assets.data-sources.approve",

  // Data Elements
  DATA_ELEMENTS_VIEW: "core-assets.data-elements.view",
  DATA_ELEMENTS_CREATE: "core-assets.data-elements.create",
  DATA_ELEMENTS_EDIT: "core-assets.data-elements.edit",
  DATA_ELEMENTS_DELETE: "core-assets.data-elements.delete",
  DATA_ELEMENTS_APPROVE: "core-assets.data-elements.approve",

  // Dataset Snapshots
  DATASET_SNAPSHOTS_VIEW: "core-assets.dataset-snapshots.view",
  DATASET_SNAPSHOTS_CREATE: "core-assets.dataset-snapshots.create",
  DATASET_SNAPSHOTS_EDIT: "core-assets.dataset-snapshots.edit",
  DATASET_SNAPSHOTS_DELETE: "core-assets.dataset-snapshots.delete",
  DATASET_SNAPSHOTS_APPROVE: "core-assets.dataset-snapshots.approve",

  // AI Model Datasets (no delete)
  AI_MODEL_DATASETS_VIEW: "core-assets.ai-model-datasets.view",
  AI_MODEL_DATASETS_CREATE: "core-assets.ai-model-datasets.create",
  AI_MODEL_DATASETS_EDIT: "core-assets.ai-model-datasets.edit",
  AI_MODEL_DATASETS_APPROVE: "core-assets.ai-model-datasets.approve",

  // Dataset Subject Populations
  DATASET_SUBJECT_POPULATIONS_VIEW: "core-assets.dataset-subject-populations.view",
  DATASET_SUBJECT_POPULATIONS_CREATE: "core-assets.dataset-subject-populations.create",
  DATASET_SUBJECT_POPULATIONS_EDIT: "core-assets.dataset-subject-populations.edit",
  DATASET_SUBJECT_POPULATIONS_DELETE: "core-assets.dataset-subject-populations.delete",
  DATASET_SUBJECT_POPULATIONS_APPROVE: "core-assets.dataset-subject-populations.approve",

  // ═══════════════════════════════════════════════════════════════════
  // RISK MANAGEMENT & COMPLIANCE
  // ═══════════════════════════════════════════════════════════════════

  // AI Risk Register
  AI_RISK_REGISTER_VIEW: "risk-management-and-compliance.ai-risk-register.view",
  AI_RISK_REGISTER_CREATE: "risk-management-and-compliance.ai-risk-register.create",
  AI_RISK_REGISTER_EDIT: "risk-management-and-compliance.ai-risk-register.edit",
  AI_RISK_REGISTER_DELETE: "risk-management-and-compliance.ai-risk-register.delete",
  AI_RISK_REGISTER_APPROVE: "risk-management-and-compliance.ai-risk-register.approve",

  // Risk Methodologies
  RISK_METHODOLOGIES_VIEW: "risk-management-and-compliance.risk-methodologies.view",
  RISK_METHODOLOGIES_CREATE: "risk-management-and-compliance.risk-methodologies.create",
  RISK_METHODOLOGIES_EDIT: "risk-management-and-compliance.risk-methodologies.edit",
  RISK_METHODOLOGIES_DELETE: "risk-management-and-compliance.risk-methodologies.delete",
  RISK_METHODOLOGIES_APPROVE: "risk-management-and-compliance.risk-methodologies.approve",

  // AI Risk Treatments
  AI_RISK_TREATMENTS_VIEW: "risk-management-and-compliance.ai-risk-treatments.view",
  AI_RISK_TREATMENTS_CREATE: "risk-management-and-compliance.ai-risk-treatments.create",
  AI_RISK_TREATMENTS_EDIT: "risk-management-and-compliance.ai-risk-treatments.edit",
  AI_RISK_TREATMENTS_DELETE: "risk-management-and-compliance.ai-risk-treatments.delete",
  AI_RISK_TREATMENTS_APPROVE: "risk-management-and-compliance.ai-risk-treatments.approve",

  // KRI Indicators
  KRI_INDICATORS_VIEW: "risk-management-and-compliance.kri-indicators.view",
  KRI_INDICATORS_CREATE: "risk-management-and-compliance.kri-indicators.create",
  KRI_INDICATORS_EDIT: "risk-management-and-compliance.kri-indicators.edit",
  KRI_INDICATORS_DELETE: "risk-management-and-compliance.kri-indicators.delete",
  KRI_INDICATORS_APPROVE: "risk-management-and-compliance.kri-indicators.approve",

  // Projects (no delete)
  PROJECTS_VIEW: "risk-management-and-compliance.projects.view",
  PROJECTS_CREATE: "risk-management-and-compliance.projects.create",
  PROJECTS_EDIT: "risk-management-and-compliance.projects.edit",
  PROJECTS_APPROVE: "risk-management-and-compliance.projects.approve",

  // Frameworks (view + approve only)
  FRAMEWORKS_VIEW: "risk-management-and-compliance.frameworks.view",
  FRAMEWORKS_APPROVE: "risk-management-and-compliance.frameworks.approve",

  // Compliance Evidences
  COMPLIANCE_EVIDENCES_VIEW: "risk-management-and-compliance.compliance-evidences.view",
  COMPLIANCE_EVIDENCES_CREATE: "risk-management-and-compliance.compliance-evidences.create",
  COMPLIANCE_EVIDENCES_EDIT: "risk-management-and-compliance.compliance-evidences.edit",
  COMPLIANCE_EVIDENCES_DELETE: "risk-management-and-compliance.compliance-evidences.delete",
  COMPLIANCE_EVIDENCES_APPROVE: "risk-management-and-compliance.compliance-evidences.approve",

  // Regulatory Submissions
  REGULATORY_SUBMISSIONS_VIEW: "risk-management-and-compliance.regulatory-submissions.view",
  REGULATORY_SUBMISSIONS_CREATE: "risk-management-and-compliance.regulatory-submissions.create",
  REGULATORY_SUBMISSIONS_EDIT: "risk-management-and-compliance.regulatory-submissions.edit",
  REGULATORY_SUBMISSIONS_DELETE: "risk-management-and-compliance.regulatory-submissions.delete",
  REGULATORY_SUBMISSIONS_APPROVE: "risk-management-and-compliance.regulatory-submissions.approve",

  // ═══════════════════════════════════════════════════════════════════
  // PRIVACY & DATA PROTECTION
  // ═══════════════════════════════════════════════════════════════════

  // Record of Processing Activities (ROPA)
  ROPA_VIEW: "privacy-and-data-protection.record-of-processing-activities.view",
  ROPA_CREATE: "privacy-and-data-protection.record-of-processing-activities.create",
  ROPA_EDIT: "privacy-and-data-protection.record-of-processing-activities.edit",
  ROPA_DELETE: "privacy-and-data-protection.record-of-processing-activities.delete",
  ROPA_APPROVE: "privacy-and-data-protection.record-of-processing-activities.approve",

  // User Consents
  USER_CONSENTS_VIEW: "privacy-and-data-protection.user-consents.view",
  USER_CONSENTS_CREATE: "privacy-and-data-protection.user-consents.create",
  USER_CONSENTS_EDIT: "privacy-and-data-protection.user-consents.edit",
  USER_CONSENTS_DELETE: "privacy-and-data-protection.user-consents.delete",
  USER_CONSENTS_APPROVE: "privacy-and-data-protection.user-consents.approve",

  // Consent Scopes
  CONSENT_SCOPES_VIEW: "privacy-and-data-protection.consent-scopes.view",
  CONSENT_SCOPES_CREATE: "privacy-and-data-protection.consent-scopes.create",
  CONSENT_SCOPES_EDIT: "privacy-and-data-protection.consent-scopes.edit",
  CONSENT_SCOPES_DELETE: "privacy-and-data-protection.consent-scopes.delete",
  CONSENT_SCOPES_APPROVE: "privacy-and-data-protection.consent-scopes.approve",

  // Consent Coverages
  CONSENT_COVERAGES_VIEW: "privacy-and-data-protection.consent-coverages.view",
  CONSENT_COVERAGES_CREATE: "privacy-and-data-protection.consent-coverages.create",
  CONSENT_COVERAGES_EDIT: "privacy-and-data-protection.consent-coverages.edit",
  CONSENT_COVERAGES_DELETE: "privacy-and-data-protection.consent-coverages.delete",
  CONSENT_COVERAGES_APPROVE: "privacy-and-data-protection.consent-coverages.approve",

  // Consent Records
  CONSENT_RECORDS_VIEW: "privacy-and-data-protection.consent-records.view",
  CONSENT_RECORDS_CREATE: "privacy-and-data-protection.consent-records.create",
  CONSENT_RECORDS_EDIT: "privacy-and-data-protection.consent-records.edit",
  CONSENT_RECORDS_DELETE: "privacy-and-data-protection.consent-records.delete",
  CONSENT_RECORDS_APPROVE: "privacy-and-data-protection.consent-records.approve",

  // Data Subject Request Accesses (DSAR)
  DSAR_VIEW: "privacy-and-data-protection.data-subject-request-accesses.view",
  DSAR_CREATE: "privacy-and-data-protection.data-subject-request-accesses.create",
  DSAR_EDIT: "privacy-and-data-protection.data-subject-request-accesses.edit",
  DSAR_DELETE: "privacy-and-data-protection.data-subject-request-accesses.delete",
  DSAR_APPROVE: "privacy-and-data-protection.data-subject-request-accesses.approve",

  // Data Protection Impact Assessments (DPIA)
  DPIA_VIEW: "privacy-and-data-protection.data-protection-impact-assessments.view",
  DPIA_CREATE: "privacy-and-data-protection.data-protection-impact-assessments.create",
  DPIA_EDIT: "privacy-and-data-protection.data-protection-impact-assessments.edit",
  DPIA_DELETE: "privacy-and-data-protection.data-protection-impact-assessments.delete",
  DPIA_APPROVE: "privacy-and-data-protection.data-protection-impact-assessments.approve",

  // Privacy Incidents
  PRIVACY_INCIDENTS_VIEW: "privacy-and-data-protection.privacy-incidents.view",
  PRIVACY_INCIDENTS_CREATE: "privacy-and-data-protection.privacy-incidents.create",
  PRIVACY_INCIDENTS_EDIT: "privacy-and-data-protection.privacy-incidents.edit",
  PRIVACY_INCIDENTS_DELETE: "privacy-and-data-protection.privacy-incidents.delete",
  PRIVACY_INCIDENTS_APPROVE: "privacy-and-data-protection.privacy-incidents.approve",

  // PDP Processing Registers
  PDP_PROCESSING_REGISTERS_VIEW: "privacy-and-data-protection.pdp-processing-registers.view",
  PDP_PROCESSING_REGISTERS_CREATE: "privacy-and-data-protection.pdp-processing-registers.create",
  PDP_PROCESSING_REGISTERS_EDIT: "privacy-and-data-protection.pdp-processing-registers.edit",
  PDP_PROCESSING_REGISTERS_DELETE: "privacy-and-data-protection.pdp-processing-registers.delete",
  PDP_PROCESSING_REGISTERS_APPROVE: "privacy-and-data-protection.pdp-processing-registers.approve",

  // ═══════════════════════════════════════════════════════════════════
  // GOVERNANCE & OVERSIGHT
  // ═══════════════════════════════════════════════════════════════════

  // AI Committees
  AI_COMMITTEES_VIEW: "governance-and-oversight.ai-committees.view",
  AI_COMMITTEES_CREATE: "governance-and-oversight.ai-committees.create",
  AI_COMMITTEES_EDIT: "governance-and-oversight.ai-committees.edit",
  AI_COMMITTEES_DELETE: "governance-and-oversight.ai-committees.delete",
  AI_COMMITTEES_APPROVE: "governance-and-oversight.ai-committees.approve",

  // Committee Memberships
  COMMITTEE_MEMBERSHIPS_VIEW: "governance-and-oversight.committee-memberships.view",
  COMMITTEE_MEMBERSHIPS_CREATE: "governance-and-oversight.committee-memberships.create",
  COMMITTEE_MEMBERSHIPS_EDIT: "governance-and-oversight.committee-memberships.edit",
  COMMITTEE_MEMBERSHIPS_DELETE: "governance-and-oversight.committee-memberships.delete",
  COMMITTEE_MEMBERSHIPS_APPROVE: "governance-and-oversight.committee-memberships.approve",

  // Committee Meetings
  COMMITTEE_MEETINGS_VIEW: "governance-and-oversight.committee-meetings.view",
  COMMITTEE_MEETINGS_CREATE: "governance-and-oversight.committee-meetings.create",
  COMMITTEE_MEETINGS_EDIT: "governance-and-oversight.committee-meetings.edit",
  COMMITTEE_MEETINGS_DELETE: "governance-and-oversight.committee-meetings.delete",
  COMMITTEE_MEETINGS_APPROVE: "governance-and-oversight.committee-meetings.approve",

  // Committee Decisions
  COMMITTEE_DECISIONS_VIEW: "governance-and-oversight.committee-decisions.view",
  COMMITTEE_DECISIONS_CREATE: "governance-and-oversight.committee-decisions.create",
  COMMITTEE_DECISIONS_EDIT: "governance-and-oversight.committee-decisions.edit",
  COMMITTEE_DECISIONS_DELETE: "governance-and-oversight.committee-decisions.delete",
  COMMITTEE_DECISIONS_APPROVE: "governance-and-oversight.committee-decisions.approve",

  // Committee Actions
  COMMITTEE_ACTIONS_VIEW: "governance-and-oversight.committee-actions.view",
  COMMITTEE_ACTIONS_CREATE: "governance-and-oversight.committee-actions.create",
  COMMITTEE_ACTIONS_EDIT: "governance-and-oversight.committee-actions.edit",
  COMMITTEE_ACTIONS_DELETE: "governance-and-oversight.committee-actions.delete",
  COMMITTEE_ACTIONS_APPROVE: "governance-and-oversight.committee-actions.approve",

  // AI Incidents
  AI_INCIDENTS_VIEW: "governance-and-oversight.ai-incidents.view",
  AI_INCIDENTS_CREATE: "governance-and-oversight.ai-incidents.create",
  AI_INCIDENTS_EDIT: "governance-and-oversight.ai-incidents.edit",
  AI_INCIDENTS_DELETE: "governance-and-oversight.ai-incidents.delete",
  AI_INCIDENTS_APPROVE: "governance-and-oversight.ai-incidents.approve",

  // Incident Alerts
  INCIDENT_ALERTS_VIEW: "governance-and-oversight.incident-alerts.view",
  INCIDENT_ALERTS_CREATE: "governance-and-oversight.incident-alerts.create",
  INCIDENT_ALERTS_EDIT: "governance-and-oversight.incident-alerts.edit",
  INCIDENT_ALERTS_DELETE: "governance-and-oversight.incident-alerts.delete",
  INCIDENT_ALERTS_APPROVE: "governance-and-oversight.incident-alerts.approve",

  // Incident Actions
  INCIDENT_ACTIONS_VIEW: "governance-and-oversight.incident-actions.view",
  INCIDENT_ACTIONS_CREATE: "governance-and-oversight.incident-actions.create",
  INCIDENT_ACTIONS_EDIT: "governance-and-oversight.incident-actions.edit",
  INCIDENT_ACTIONS_DELETE: "governance-and-oversight.incident-actions.delete",
  INCIDENT_ACTIONS_APPROVE: "governance-and-oversight.incident-actions.approve",

  // Incident Root Cause Analyses
  INCIDENT_RCA_VIEW: "governance-and-oversight.incident-root-cause-analyses.view",
  INCIDENT_RCA_CREATE: "governance-and-oversight.incident-root-cause-analyses.create",
  INCIDENT_RCA_EDIT: "governance-and-oversight.incident-root-cause-analyses.edit",
  INCIDENT_RCA_DELETE: "governance-and-oversight.incident-root-cause-analyses.delete",
  INCIDENT_RCA_APPROVE: "governance-and-oversight.incident-root-cause-analyses.approve",

  // Incident Notifications
  INCIDENT_NOTIFICATIONS_VIEW: "governance-and-oversight.incident-notifications.view",
  INCIDENT_NOTIFICATIONS_CREATE: "governance-and-oversight.incident-notifications.create",
  INCIDENT_NOTIFICATIONS_EDIT: "governance-and-oversight.incident-notifications.edit",
  INCIDENT_NOTIFICATIONS_DELETE: "governance-and-oversight.incident-notifications.delete",
  INCIDENT_NOTIFICATIONS_APPROVE: "governance-and-oversight.incident-notifications.approve",

  // Corrective Preventive Actions (CAPA)
  CAPA_VIEW: "governance-and-oversight.corrective-preventive-actions.view",
  CAPA_CREATE: "governance-and-oversight.corrective-preventive-actions.create",
  CAPA_EDIT: "governance-and-oversight.corrective-preventive-actions.edit",
  CAPA_DELETE: "governance-and-oversight.corrective-preventive-actions.delete",
  CAPA_APPROVE: "governance-and-oversight.corrective-preventive-actions.approve",

  // ═══════════════════════════════════════════════════════════════════
  // ADMINISTRATION
  // ═══════════════════════════════════════════════════════════════════

  // Users
  ADMIN_USERS_VIEW: "administration.users.view",
  ADMIN_USERS_CREATE: "administration.users.create",
  ADMIN_USERS_EDIT: "administration.users.edit",
  ADMIN_USERS_DELETE: "administration.users.delete",
  ADMIN_USERS_APPROVE: "administration.users.approve",

  // Roles
  ADMIN_ROLES_VIEW: "administration.roles.view",
  ADMIN_ROLES_CREATE: "administration.roles.create",
  ADMIN_ROLES_EDIT: "administration.roles.edit",
  ADMIN_ROLES_DELETE: "administration.roles.delete",
  ADMIN_ROLES_APPROVE: "administration.roles.approve",

  // Permissions
  ADMIN_PERMISSIONS_VIEW: "administration.permissions.view",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

