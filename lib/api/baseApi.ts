/**
 * Base RTK Query API
 *
 * Single createApi instance shared across the entire application.
 * All feature API slices inject their endpoints into this base API
 * using `baseApi.injectEndpoints(...)`.
 *
 * Benefits:
 * - One reducer and one middleware in the Redux store
 * - Cross-feature tag invalidation works automatically
 * - Dramatically simplified store configuration
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./rtkQueryBase";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    // Core Assets
    "UseCase",
    "Project",
    "AiModel",
    "AiModelVersion",
    "AiModelUseCase",
    "AiModelCard",
    "AiModelArtifact",
    "ArtifactAccessLog",
    "AiAsset",

    // Vendors & Agreements
    "Vendor",
    "Agreement",
    "Stakeholder",

    // Data Management
    "DataSource",
    "Dataset",
    "DataElement",
    "DatasetSnapshot",
    "ModelDatasetLink",
    "DatasetElementMap",
    "DatasetSubjectPopulation",

    // Consent & Privacy
    "UserConsent",
    "ConsentScope",
    "ConsentCoverage",
    "ConsentRecord",
    "PdpProcessingRegister",
    "RecordOfProcessingActivity",
    "DataSubjectRequestAccess",
    "DPIA",
    "PrivacyIncident",

    // Incidents
    "AiIncident",
    "IncidentAlert",
    "IncidentAction",
    "IncidentRootCauseAnalysis",
    "IncidentNotification",
    "CorrectivePreventiveAction",

    // Risk & Compliance
    "RiskMethodology",
    "AiRiskRegister",
    "AiRiskTreatment",
    "KriIndicator",
    "Framework",
    "Requirement",
    "Control",
    "RequirementControl",
    "ComplianceEvidence",
    "RegulatorySubmission",

    // Governance
    "AiCommittee",
    "CommitteeMembership",
    "CommitteeMeeting",
    "CommitteeAction",
    "CommitteeDecision",

    // Administration
    "User",
    "Organization",
    "Role",
    "Permission",
    "Profile",
  ] as const,
  endpoints: () => ({}),
});

