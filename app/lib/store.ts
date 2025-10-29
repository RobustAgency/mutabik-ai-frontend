// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./features/projectsSlice";
import { useCasesApi } from "./features/useCasesApi";
import { aiModelsApi } from "./features/aiModelsApi";
import { aiModelVersionsApi } from "./features/aiModelVersionsApi";
import { aiModelUseCasesApi } from "./features/aiModelUseCasesApi";
import { vendorsApi } from "./features/vendorsApi";
import { stakeholdersApi } from "./features/stakeholdersApi";

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
      // ... other reducers
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        useCasesApi.middleware,
        aiModelsApi.middleware,
        aiModelVersionsApi.middleware,
        aiModelUseCasesApi.middleware,
        vendorsApi.middleware,
        stakeholdersApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
