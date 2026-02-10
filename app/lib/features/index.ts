/**
 * Feature API Registry
 *
 * This file imports all feature API slices so their endpoints are
 * injected into the shared baseApi at startup. Each import triggers
 * `baseApi.injectEndpoints(...)` as a side effect.
 *
 * When adding a new feature API, add its import here.
 */

// Core Assets
import "./useCasesApi";
import "./projectsApi";
import "./aiModelsApi";
import "./aiModelVersionsApi";
import "./aiModelUseCasesApi";
import "./aiModelCardsApi";
import "./aiModelArtifactsApi";
import "./artifactAccessLogsApi";
import "./aiAssetsApi";

// Vendors & Agreements
import "./vendorsApi";
import "./agreementsApi";
import "./stakeholdersApi";

// Data Management
import "./dataSourcesApi";
import "./datasetsApi";
import "./dataElementsApi";
import "./datasetSnapshotsApi";
import "./modelDatasetLinksApi";
import "./datasetElementMapApi";
import "./datasetSubjectPopulationApi";

// Consent & Privacy
import "./userConsentsApi";
import "./consentScopesApi";
import "./consentCoverageApi";
import "./consentRecordsApi";
import "./pdpProcessingRegisterApi";
import "./recordOfProcessingActivitiesApi";
import "./dataSubjectRequestAccessesApi";
import "./dataProtectionImpactAssessmentsApi";
import "./privacyIncidentsApi";

// Incidents
import "./aiIncidentsApi";
import "./incidentAlertsApi";
import "./incidentActionsApi";
import "./incidentRootCauseAnalysesApi";
import "./incidentNotificationsApi";
import "./correctivePreventiveActionsApi";

// Risk & Compliance
import "./riskMethodologyApi";
import "./aiRiskRegisterApi";
import "./aiRiskTreatmentApi";
import "./kriIndicatorApi";
import "./frameworksApi";
import "./requirementsApi";
import "./controlsApi";
import "./requirementControlsApi";
import "./complianceEvidenceApi";
import "./regulatorySubmissionsApi";

// Governance
import "./aiCommitteesApi";
import "./committeeMembershipsApi";
import "./committeeMeetingsApi";
import "./committeeActionsApi";
import "./committeeDecisionsApi";

// Administration
import "./usersApi";
import "./organizationsApi";
import "./rolesApi";
import "./profileApi";

