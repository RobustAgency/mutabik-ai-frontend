import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  projectService,
  type Project,
  type CreateProjectData,
  type AddMemberData,
  type AddFrameworksData,
  type ProjectFilters,
} from "@/service/app/projects";
import { toast } from "react-toastify";

// State interface
interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: ProjectFilters | null;
}

// Initial state
const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  filters: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (filters?: ProjectFilters, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects(filters);
      if (!response.error) {
        return { projects: response.data.data, filters };
      } else {
        return rejectWithValue(response.message || "Failed to fetch projects");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch projects";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProject = createAsyncThunk(
  "projects/fetchProject",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await projectService.getProject(id);
      if (!response.error) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch project");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch project";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (data: CreateProjectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(data);
      if (!response.error) {
        toast.success("Project created successfully");
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to create project");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create project";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addMember = createAsyncThunk(
  "projects/addMember",
  async (
    { projectId, data }: { projectId: number; data: AddMemberData },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const response = await projectService.addMember(projectId, data);
      if (!response.error) {
        toast.success("Member added successfully");
        // Refetch the current project if it's the same project
        const rootState = getState() as { projects: ProjectsState };
        if (rootState.projects.currentProject?.id === projectId) {
          dispatch(fetchProject(projectId));
        }
        return true;
      } else {
        return rejectWithValue(response.message || "Failed to add member");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add member";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addFrameworks = createAsyncThunk(
  "projects/addFrameworks",
  async (
    { projectId, data }: { projectId: number; data: AddFrameworksData },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const response = await projectService.addFrameworks(projectId, data);
      if (!response.error) {
        toast.success("Frameworks added successfully");
        // Refetch the current project if it's the same project
        const rootState = getState() as { projects: ProjectsState };
        if (rootState.projects.currentProject?.id === projectId) {
          dispatch(fetchProject(projectId));
        }
        return true;
      } else {
        return rejectWithValue(response.message || "Failed to add frameworks");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add frameworks";
      return rejectWithValue(errorMessage);
    }
  }
);

// Projects slice
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.filters = action.payload.filters || null;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to fetch projects");
      });

    // Fetch single project
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        state.error = null;
        // Also update the project in the projects list if it exists
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to fetch project");
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        // Add the new project to the list if it's not already there
        const exists = state.projects.some((p) => p.id === action.payload.id);
        if (!exists) {
          state.projects.unshift(action.payload);
        }
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to create project");
      });

    // Add member
    builder
      .addCase(addMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to add member");
      });

    // Add frameworks
    builder
      .addCase(addFrameworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFrameworks.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addFrameworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to add frameworks");
      });
  },
});

// Export actions
export const { clearCurrentProject, clearError, setCurrentProject } =
  projectsSlice.actions;

// Export reducer
export default projectsSlice.reducer;
