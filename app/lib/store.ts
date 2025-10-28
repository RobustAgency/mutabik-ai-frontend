// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./features/projectsSlice";
import { useCasesApi } from "./features/useCasesApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      projects: projectsReducer,
      [useCasesApi.reducerPath]: useCasesApi.reducer,
      // ... other reducers
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(useCasesApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
