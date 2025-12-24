
// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useCasesApi } from "./features/useCasesApi";
import { projectsApi } from "./features/projectsApi";
import projectsReducer from "./features/projectsSlice";
import { aiModelsApi } from "./features/aiModelsApi";
import { aiModelVersionsApi } from "./features/aiModelVersionsApi";
import { aiModelUseCasesApi } from "./features/aiModelUseCasesApi";
import { vendorsApi } from "./features/vendorsApi";
import { agreementsApi } from "./features/agreementsApi";
import { stakeholdersApi } from "./features/stakeholdersApi";
import { aiModelCardsApi } from "./features/aiModelCardsApi";
import { dataSourcesApi } from "./features/dataSourcesApi";
import { datasetsApi } from "./features/datasetsApi";
import { dataElementsApi } from "./features/dataElementsApi";
import { datasetSnapshotsApi } from "./features/datasetSnapshotsApi";
import { modelDatasetLinksApi } from "./features/modelDatasetLinksApi";
import { userConsentsApi } from "./features/userConsentsApi";
import { consentScopesApi } from "./features/consentScopesApi";
import { consentCoverageApi } from "./features/consentCoverageApi";
import { pdpProcessingRegisterApi } from "./features/pdpProcessingRegisterApi";
import { datasetSubjectPopulationApi } from "./features/datasetSubjectPopulationApi";
import { aiModelArtifactsApi } from "./features/aiModelArtifactsApi";
import { artifactAccessLogsApi } from "./features/artifactAccessLogsApi";
import { aiIncidentsApi } from "./features/aiIncidentsApi";
import { incidentAlertsApi } from "./features/incidentAlertsApi";
import { incidentActionsApi } from "./features/incidentActionsApi";
import { incidentRootCauseAnalysesApi } from "./features/incidentRootCauseAnalysesApi";
import { incidentNotificationsApi } from "./features/incidentNotificationsApi";
import { correctivePreventiveActionsApi } from "./features/correctivePreventiveActionsApi";
import { aiAssetsApi } from "./features/aiAssetsApi";
import { datasetElementMapApi } from "./features/datasetElementMapApi";
import { riskMethodologyApi } from "./features/riskMethodologyApi";
import { aiRiskRegisterApi } from "./features/aiRiskRegisterApi";
import { aiRiskTreatmentApi } from "./features/aiRiskTreatmentApi";
import { kriIndicatorApi } from "./features/kriIndicatorApi";
import { frameworksApi } from "./features/frameworksApi";
import { requirementsApi } from "./features/requirementsApi";
import { controlsApi } from "./features/controlsApi";
import { requirementControlsApi } from "./features/requirementControlsApi";
import { usersApi } from "./features/usersApi";
import { complianceEvidenceApi } from "./features/complianceEvidenceApi";
import { regulatorySubmissionsApi } from "./features/regulatorySubmissionsApi";
import { recordOfProcessingActivitiesApi } from "./features/recordOfProcessingActivitiesApi";
import { dataSubjectRequestAccessesApi } from "./features/dataSubjectRequestAccessesApi";
import { consentRecordsApi } from "./features/consentRecordsApi";
import { dataProtectionImpactAssessmentsApi } from "./features/dataProtectionImpactAssessmentsApi";
import { privacyIncidentsApi } from "./features/privacyIncidentsApi";
import { aiCommitteesApi } from "./features/aiCommitteesApi";
import { committeeMembershipsApi } from "./features/committeeMembershipsApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      projects: projectsReducer, // Keep for backward compatibility with old useProjects hook
      [useCasesApi.reducerPath]: useCasesApi.reducer,
      [projectsApi.reducerPath]: projectsApi.reducer,
      [aiModelsApi.reducerPath]: aiModelsApi.reducer,
      [aiModelVersionsApi.reducerPath]: aiModelVersionsApi.reducer,
      [aiModelUseCasesApi.reducerPath]: aiModelUseCasesApi.reducer,
      [vendorsApi.reducerPath]: vendorsApi.reducer,
      [agreementsApi.reducerPath]: agreementsApi.reducer,
      [stakeholdersApi.reducerPath]: stakeholdersApi.reducer,
      [aiModelCardsApi.reducerPath]: aiModelCardsApi.reducer,
      [dataSourcesApi.reducerPath]: dataSourcesApi.reducer,
      [datasetsApi.reducerPath]: datasetsApi.reducer,
      [dataElementsApi.reducerPath]: dataElementsApi.reducer,
      [datasetSnapshotsApi.reducerPath]: datasetSnapshotsApi.reducer,
      [modelDatasetLinksApi.reducerPath]: modelDatasetLinksApi.reducer,
      [userConsentsApi.reducerPath]: userConsentsApi.reducer,
      [consentScopesApi.reducerPath]: consentScopesApi.reducer,
      [consentCoverageApi.reducerPath]: consentCoverageApi.reducer,
      [pdpProcessingRegisterApi.reducerPath]: pdpProcessingRegisterApi.reducer,
      [datasetSubjectPopulationApi.reducerPath]:
        datasetSubjectPopulationApi.reducer,
      [aiModelArtifactsApi.reducerPath]: aiModelArtifactsApi.reducer,
      [artifactAccessLogsApi.reducerPath]: artifactAccessLogsApi.reducer,
      [aiIncidentsApi.reducerPath]: aiIncidentsApi.reducer,
      [incidentAlertsApi.reducerPath]: incidentAlertsApi.reducer,
      [incidentActionsApi.reducerPath]: incidentActionsApi.reducer,
      [incidentRootCauseAnalysesApi.reducerPath]:
        incidentRootCauseAnalysesApi.reducer,
      [incidentNotificationsApi.reducerPath]: incidentNotificationsApi.reducer,
      [correctivePreventiveActionsApi.reducerPath]:
        correctivePreventiveActionsApi.reducer,
      [aiAssetsApi.reducerPath]: aiAssetsApi.reducer,
      [datasetElementMapApi.reducerPath]: datasetElementMapApi.reducer,
      [riskMethodologyApi.reducerPath]: riskMethodologyApi.reducer,
      [aiRiskRegisterApi.reducerPath]: aiRiskRegisterApi.reducer,
      [aiRiskTreatmentApi.reducerPath]: aiRiskTreatmentApi.reducer,
      [kriIndicatorApi.reducerPath]: kriIndicatorApi.reducer,
      [frameworksApi.reducerPath]: frameworksApi.reducer,
      [requirementsApi.reducerPath]: requirementsApi.reducer,
      [controlsApi.reducerPath]: controlsApi.reducer,
      [requirementControlsApi.reducerPath]: requirementControlsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [complianceEvidenceApi.reducerPath]: complianceEvidenceApi.reducer,
      [regulatorySubmissionsApi.reducerPath]: regulatorySubmissionsApi.reducer,
      [consentRecordsApi.reducerPath]: consentRecordsApi.reducer,
      [dataSubjectRequestAccessesApi.reducerPath]:
        dataSubjectRequestAccessesApi.reducer,
      [recordOfProcessingActivitiesApi.reducerPath]:
        recordOfProcessingActivitiesApi.reducer,
      [dataProtectionImpactAssessmentsApi.reducerPath]:
        dataProtectionImpactAssessmentsApi.reducer,
      [privacyIncidentsApi.reducerPath]: privacyIncidentsApi.reducer,
      [aiCommitteesApi.reducerPath]: aiCommitteesApi.reducer,
      [committeeMembershipsApi.reducerPath]: committeeMembershipsApi.reducer,
      // ... other reducers
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        useCasesApi.middleware,
        projectsApi.middleware,
        aiModelsApi.middleware,
        aiModelVersionsApi.middleware,
        aiModelUseCasesApi.middleware,
        vendorsApi.middleware,
        agreementsApi.middleware,
        stakeholdersApi.middleware,
        aiModelCardsApi.middleware,
        dataSourcesApi.middleware,
        datasetsApi.middleware,
        dataElementsApi.middleware,
        datasetSnapshotsApi.middleware,
        modelDatasetLinksApi.middleware,
        userConsentsApi.middleware,
        consentScopesApi.middleware,
        consentCoverageApi.middleware,
        pdpProcessingRegisterApi.middleware,
        datasetSubjectPopulationApi.middleware,
        aiModelArtifactsApi.middleware,
        artifactAccessLogsApi.middleware,
        aiIncidentsApi.middleware,
        incidentAlertsApi.middleware,
        incidentActionsApi.middleware,
        incidentRootCauseAnalysesApi.middleware,
        incidentNotificationsApi.middleware,
        correctivePreventiveActionsApi.middleware,
        aiAssetsApi.middleware,
        datasetElementMapApi.middleware,
        riskMethodologyApi.middleware,
        aiRiskRegisterApi.middleware,
        aiRiskTreatmentApi.middleware,
        kriIndicatorApi.middleware,
        frameworksApi.middleware,
        requirementsApi.middleware,
        controlsApi.middleware,
        requirementControlsApi.middleware,
        usersApi.middleware,
        complianceEvidenceApi.middleware,
        regulatorySubmissionsApi.middleware,
        consentRecordsApi.middleware,
        dataSubjectRequestAccessesApi.middleware,
        recordOfProcessingActivitiesApi.middleware,
        dataProtectionImpactAssessmentsApi.middleware,
        privacyIncidentsApi.middleware,
        aiCommitteesApi.middleware,
        committeeMembershipsApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
