// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
// ... other slices

export const makeStore = () => {
  return configureStore({
    reducer: {
      // ... other reducers
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
