import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  useCaseService,
  type UseCase,
  type CreateUseCaseData,
} from "@/service/app/useCases";
import { toast } from "react-toastify";

// State interface
interface UseCasesState {
  useCases: UseCase[];
  currentUseCase: UseCase | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UseCasesState = {
  useCases: [],
  currentUseCase: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUseCases = createAsyncThunk(
  "useCases/fetchUseCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await useCaseService.getUseCases();
      if (!response.error && response.data?.data) {
        return response.data.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch use cases");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch use cases";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createUseCase = createAsyncThunk(
  "useCases/createUseCase",
  async (data: CreateUseCaseData, { rejectWithValue }) => {
    try {
      const payload: CreateUseCaseData = {
        ...data,
        regulatory_scope: Array.isArray(data.regulatory_scope)
          ? data.regulatory_scope.filter((x) => x.trim() !== "")
          : [],
      };

      const response = await useCaseService.createUseCase(payload);
      if (!response.error) {
        toast.success("Use case created successfully");
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to create use case");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create use case";
      return rejectWithValue(errorMessage);
    }
  }
);

// Use cases slice
const useCasesSlice = createSlice({
  name: "useCases",
  initialState,
  reducers: {
    clearCurrentUseCase: (state) => {
      state.currentUseCase = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUseCase: (state, action) => {
      state.currentUseCase = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch use cases
    builder
      .addCase(fetchUseCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUseCases.fulfilled, (state, action) => {
        state.loading = false;
        state.useCases = action.payload;
        state.error = null;
      })
      .addCase(fetchUseCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to fetch use cases");
      });

    // Create use case
    builder
      .addCase(createUseCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUseCase.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUseCase = action.payload;
        // Add the new use case to the list if it's not already there
        const exists = state.useCases.some((u) => u.id === action.payload.id);
        if (!exists) {
          state.useCases.unshift(action.payload);
        }
        state.error = null;
      })
      .addCase(createUseCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to create use case");
      });
  },
});

// Export actions
export const { clearCurrentUseCase, clearError, setCurrentUseCase } =
  useCasesSlice.actions;

// Export reducer
export default useCasesSlice.reducer;
