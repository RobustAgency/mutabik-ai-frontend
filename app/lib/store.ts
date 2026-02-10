// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/lib/api/baseApi";
import projectsReducer from "./features/projectsSlice";

// Register all feature API endpoints (side-effect imports)
import "./features";

export const makeStore = () => {
  return configureStore({
    reducer: {
      projects: projectsReducer, // Keep for backward compatibility with old useProjects hook
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
