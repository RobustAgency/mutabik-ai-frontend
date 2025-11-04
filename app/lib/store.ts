// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./features/projectsSlice";
import { useCasesApi } from "./features/useCasesApi";
import { aiModelsApi } from "./features/aiModelsApi";
import { aiModelVersionsApi } from "./features/aiModelVersionsApi";
import { aiModelUseCasesApi } from "./features/aiModelUseCasesApi";
import { vendorsApi } from "./features/vendorsApi";
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

export const makeStore = () => {
  return configureStore({
    reducer: {
      projects: projectsReducer,
      [useCasesApi.reducerPath]: useCasesApi.reducer,
      [aiModelsApi.reducerPath]: aiModelsApi.reducer,
      [aiModelVersionsApi.reducerPath]: aiModelVersionsApi.reducer,
      [aiModelUseCasesApi.reducerPath]: aiModelUseCasesApi.reducer,
      [vendorsApi.reducerPath]: vendorsApi.reducer,
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
      [datasetSubjectPopulationApi.reducerPath]: datasetSubjectPopulationApi.reducer,
      [aiModelArtifactsApi.reducerPath]: aiModelArtifactsApi.reducer,
      // ... other reducers
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        useCasesApi.middleware,
        aiModelsApi.middleware,
        aiModelVersionsApi.middleware,
        aiModelUseCasesApi.middleware,
        vendorsApi.middleware,
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
        aiModelArtifactsApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
