// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./features/projectsSlice";
import useCasesReducer from "./features/useCasesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      projects: projectsReducer,
      useCases: useCasesReducer,
      // ... other reducers
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
