/\*\*

- MUTABIQ AI FRONTEND - COMPREHENSIVE DEVELOPMENT RULES
- Based on AI Use Cases, AI Models, Redux Implementation, and Enterprise Patterns
-
- This file defines the complete standards, patterns, and conventions for developing
- features in the Mutabiq AI platform, including components, state management, API integration,
- form handling, filtering, loading states, RBAC, and error handling.
  \*/

// ============================================================================
// 0. BUILD-SAFETY RULES (ENFORCED) – Prevent recurrent build/lint errors
// ============================================================================

/\*\*

- RULE 0.1: Next.js Client vs Server Component Contracts
- - Do NOT declare Client Components (files starting with "use client") as async
- - Client entry functions MUST be sync, no `await params`
- - If a page needs `params` as Promise (Next PageProps), make it a Server Component (no "use client") and use `async ({ params }) => { const { id } = await params }`
- - Example (Server Component): params: Promise<{ id: string }>
    \*/
    const NEXT_COMPONENT_CONTRACTS = {
    clientComponents: 'No async functions; do not await params',
    serverPages: 'May be async and await params Promise<PageParams>',
    paramsExamples: ['Client: params: { id: string }', 'Server: params: Promise<{ id: string }>']
    };

/\*\*

- RULE 0.2: RTK Query Hook Parameter Types
- - Always pass objects that match the hook’s expected filter type
- - Example: useGetAiModelVersionsQuery expects AiModelVersionFilters | void
- - CORRECT: useGetAiModelVersionsQuery({ ai_model_id })
- - INCORRECT: useGetAiModelVersionsQuery(ai_model_id)
    \*/
    const RTK_QUERY_PARAM_SAFETY = {
    exampleCorrect: 'useGetAiModelVersionsQuery({ ai_model_id: modelId })',
    exampleWrong: 'useGetAiModelVersionsQuery(modelId)'
    };

/\*\*

- RULE 0.3: API Payload Mapping (FormData -> CreateData)
- - Map UI form state to API create types explicitly; align field names
- - Example: AI Models
- - Form: source_organization_id, vendor_id, current_owner
- - API: source_organization (string|null), vendor (string|null), current_owner (string|null)
- - Ensure payload matches `CreateAiModelData` keys
    \*/
    const API_PAYLOAD_MAPPING = {
    aiModels: {
    form: ['source_organization_id', 'vendor_id', 'current_owner'],
    api: ['source_organization', 'vendor', 'current_owner']
    }
    };

/\*\*

- RULE 0.4: Domain Types – Stakeholder fields
- - Use Stakeholder.display_name for UI labels; `name` is not present
- - Do not reference non-existent fields like `role` unless typed
    \*/
    const DOMAIN_TYPE_GUARDS = {
    stakeholder: 'Use display_name, not name; check interfaces before rendering'
    };

/\*\*

- RULE 0.5: Optional Arrays – Safe Updates
- - Treat optional arrays as [] when updating to avoid iterator/type errors
- - Pattern:
- const current = (prev[field] ?? []) as string[];
- const next = checked ? (current.includes(v) ? current : [...current, v]) : current.filter(x => x !== v);
  \*/
  const OPTIONAL_ARRAY_UPDATES = {
  pattern: 'Normalize optional arrays with ?? [] before spread/filter'
  };

/\*\*

- RULE 0.6: Lint Cleanliness – Unused Imports/Vars
- - Remove unused imports and variables immediately
- - Do not destructure unused values from hooks (e.g., error) unless used
- - Keep imports minimal and accurate to usage
    \*/
    const LINT_HYGIENE = {
    imports: 'Only import what is used',
    vars: 'No unused variables; remove unused destructured fields'
    };

// ============================================================================
// 1. COMPONENT STRUCTURE RULES
// ============================================================================

/\*\*

- RULE 1.1: Component File Structure
- - Use "use client" directive for client-side components
- - Import React with \* as React for better tree-shaking
- - Group imports: React, UI components, hooks, types, utilities
- - Export default component at the end
    \*/
    const COMPONENT_STRUCTURE = {
    directive: '"use client"',
    imports: [
    'React imports',
    'UI components (Card, Button, DataTable)',
    'Custom hooks',
    'Type definitions',
    'Utility functions'
    ],
    exports: 'default export only'
    };

/\*\*

- RULE 1.2: Component Naming
- - Use PascalCase for component names
- - Use descriptive names that indicate purpose
- - Match component name with file name
    \*/
    const NAMING_CONVENTIONS = {
    components: 'PascalCase (e.g., AiModels, UseCases)',
    files: 'Match component name (e.g., AiModels.tsx)',
    hooks: 'camelCase with use prefix (e.g., useAiModels)',
    services: 'camelCase with Service suffix (e.g., aiModelService)',
    api: 'camelCase with Api suffix (e.g., aiModelsApi)',
    slices: 'camelCase with Slice suffix (e.g., projectsSlice)'
    };

// ============================================================================
// 2. DATA TABLE COMPONENT RULES
// ============================================================================

/\*\*

- RULE 2.1: DataTable Wrapper Structure
- - Always wrap DataTable in Card components
- - Use consistent Card styling: rounded-2xl, border-[#E4E7EC], bg-white
- - Include header section with title and action button
- - Use nested Card for DataTable with border-0
    \*/
    const DATA_TABLE_STRUCTURE = {
    outerCard: 'w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4',
    header: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
    title: 'font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]',
    innerCard: 'bg-white w-full rounded-xl border-0 py-0'
    };

/\*\*

- RULE 2.2: Column Definition Standards
- - Use ColumnDef<EntityType>[] for type safety
- - Define accessorKey matching entity property names
- - Use consistent header styling
- - Implement proper cell rendering with type safety
    \*/
    const COLUMN_DEFINITION_RULES = {
    type: 'ColumnDef<EntityType>[]',
    header: 'font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]',
    cell: 'font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]',
    nameCell: 'font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]'
    };

/\*\*

- RULE 2.3: Status Badge Implementation
- - Use getStatusBadge utility for business/operational status
- - Implement custom badge logic for regulatory classifications
- - Use consistent color schemes: green (active/success), blue (info), red (danger), gray (neutral)
- - IMPORTANT: Badge component only supports three variants: "filled", "light", "outlined"
- - Always use one of these valid variants when implementing Badge components
    \*/
    const STATUS_BADGE_RULES = {
    business: 'Use getStatusBadge(status, "business")',
    operational: 'Use getStatusBadge(status, "operational")',
    regulatory: 'Custom switch statement with color mapping',
    variants: {
    filled: 'Solid background badge (default)',
    light: 'Light background badge with colored text',
    outlined: 'Outlined badge with border'
    },
    usage: 'ONLY use "filled", "light", or "outlined" as variant prop',
    colors: {
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800'
    }
    };

// ============================================================================
// 3. REDUX STATE MANAGEMENT RULES
// ============================================================================

/\*\*

- RULE 3.1: Redux Architecture Decision Matrix
-
- Use RTK Query for:
- - ✅ Simple CRUD operations
- - ✅ Server state management
- - ✅ Automatic caching and synchronization
- - ✅ API endpoints with standard patterns
- - ✅ Data that doesn't need complex client-side logic
-
- Use Traditional Redux Slice for:
- - ✅ Complex client state with relationships
- - ✅ State that needs custom logic
- - ✅ State that persists across page navigation
- - ✅ State with complex side effects
- - ✅ State that needs manual control over updates
    \*/
    const REDUX_ARCHITECTURE = {
    rtkQuery: {
    useFor: ['AI Models', 'Use Cases', 'Vendors', 'Stakeholders', 'AI Model Versions'],
    pattern: 'createApi with custom base query',
    benefits: ['Automatic caching', 'Background refetching', 'Optimistic updates']
    },
    traditionalSlice: {
    useFor: ['Projects', 'Complex UI state', 'Multi-step forms'],
    pattern: 'createSlice with createAsyncThunk',
    benefits: ['Full control', 'Complex state logic', 'Custom side effects']
    }
    };

/\*\*

- RULE 3.2: RTK Query API Slice Structure
- - Use createApi with custom axios base query
- - Implement proper tag invalidation
- - Handle response transformation consistently
- - Use toast notifications for user feedback
- - Include error handling with meaningful messages
    \*/
    const RTK_QUERY_RULES = {
    baseQuery: 'Custom axios base query with error handling',
    tags: 'Use entity type tags for cache invalidation',
    transform: 'Transform API response to expected format',
    toast: 'Success/error notifications in onQueryStarted',
    errorHandling: 'Extract meaningful error messages',
    structure: {
    reducerPath: 'entityApi',
    baseQuery: 'axiosBaseQuery()',
    tagTypes: '["Entity"]',
    endpoints: 'CRUD operations with proper typing'
    }
    };

/\*\*

- RULE 3.3: Traditional Redux Slice Structure
- - Use createSlice with createAsyncThunk
- - Define clear state interface
- - Implement proper loading and error states
- - Use extraReducers for async thunk handling
- - Include custom reducers for local state updates
    \*/
    const TRADITIONAL_SLICE_RULES = {
    state: 'Define clear interface with loading, error, data properties',
    thunks: 'Use createAsyncThunk for async operations',
    reducers: 'Custom reducers for local state updates',
    extraReducers: 'Handle async thunk states (pending, fulfilled, rejected)',
    actions: 'Export both thunks and slice actions'
    };

/\*\*

- RULE 3.4: Custom Hooks Pattern
- - Create custom hooks for each entity
- - Use typed Redux hooks (useAppDispatch, useAppSelector)
- - Implement backward compatibility wrappers
- - Handle loading states and errors consistently
- - Use useCallback for stable function references
    \*/
    const CUSTOM_HOOKS_RULES = {
    rtkQuery: 'Use generated hooks from API slice',
    traditional: 'Use typed Redux hooks with selectors',
    wrappers: 'Maintain backward compatibility with legacy functions',
    loading: 'Combine loading states from queries and mutations',
    errors: 'Extract error messages with fallbacks',
    callbacks: 'Use useCallback for all returned functions'
    };

// ============================================================================
// 3.5 SHARED RTK QUERY UTILITIES
// ============================================================================

/**
 * RULE 3.5: Shared RTK Query Base Query and Helpers
 * - Use shared axiosBaseQuery from lib/api/rtkQueryBase.ts
 * - Use shared MutationError, PaginationMeta types
 * - Use helper functions: extractErrorMessage, hasValidationErrors, extractValidationErrors
 * - Eliminates duplication of 40+ lines per API file
    */
    const SHARED_RTK_QUERY_RULES = {
    baseQuery: {
    import: 'import { axiosBaseQuery } from "@/lib/api/rtkQueryBase"',
    usage: 'baseQuery: axiosBaseQuery()',
    benefits: 'Eliminates 40+ lines of duplicated code per API file'
    },
    types: {
    mutationError: 'import { MutationError } from "@/lib/api/rtkQueryBase"',
    pagination: 'import { PaginationMeta } from "@/lib/api/rtkQueryBase"',
    usage: 'Use MutationError type in error handling'
    },
    helpers: {
    hasValidationErrors: 'Check if error contains validation errors',
    extractErrorMessage: 'Extract error message with fallback',
    extractValidationErrors: 'Get validation errors object'
    },
    example: `
import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors } from "@/lib/api/rtkQueryBase";

export const entityApi = createApi({
  reducerPath: "entityApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Entity"],
  endpoints: (builder) => ({
    createEntity: builder.mutation<Entity, CreateEntityData>({
      query: (data) => ({ url: "/entities", method: "POST", data }),
      invalidatesTags: [{ type: "Entity", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Entity created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage = mutationError?.error?.data?.message || "Failed to create entity";
            toast.error(errorMessage);
          }
        }
      },
    }),
  }),
});
    `
    };

// ============================================================================
// 4. API INTEGRATION RULES
// ============================================================================

/\*\*

- RULE 4.1: Service Layer Standards
- - Define TypeScript interfaces for all entities
- - Include both full entity and create data interfaces
- - Implement CRUD operations consistently
- - Use ApiResponse wrapper for type safety
- - Define filter interfaces for query parameters
    \*/
    const SERVICE_LAYER_RULES = {
    interfaces: 'Define Entity and CreateEntityData interfaces',
    crud: 'Implement get, create, update, delete methods',
    response: 'Use ApiResponse<T> wrapper for all responses',
    filters: 'Define filter interfaces for query parameters',
    naming: 'Use camelCase with Service suffix'
    };

/\*\*

- RULE 4.2: API Response Handling
- - Use consistent response transformation
- - Handle both array and single entity responses
- - Implement proper error extraction
- - Use fallback values for missing data
    \*/
    const API_RESPONSE_RULES = {
    transform: 'Transform API response to expected format',
    arrays: 'Handle both { data: { data: Entity[] } } and Entity[] formats',
    single: 'Handle both { data: Entity } and Entity formats',
    errors: 'Extract meaningful error messages',
    fallbacks: 'Use empty arrays/objects as fallbacks'
    };

// ============================================================================
// 5. STYLING AND UI RULES
// ============================================================================

/\*\*

- RULE 5.1: Color Scheme Standards
- - Primary green: #4FD58F (buttons, success states)
- - Text colors: #000000 (titles), #1D2939 (names), #667085 (labels)
- - Border: #E4E7EC (card borders)
- - Background: #F9FAFB (button backgrounds)
    \*/
    const COLOR_SCHEME = {
    primary: '#4FD58F',
    text: {
    title: '#000000',
    name: '#1D2939',
    label: '#667085'
    },
    border: '#E4E7EC',
    background: '#F9FAFB'
    };

/\*\*

- RULE 5.2: Typography Standards
- - Use font-sans for all text
- - Consistent font weights: medium (headers), normal (content)
- - Standard text sizes: 12px (headers), 14px (content)
- - Line heights: 4 (headers), 5 (content)
    \*/
    const TYPOGRAPHY = {
    font: 'font-sans',
    weights: {
    header: 'font-medium',
    content: 'font-normal'
    },
    sizes: {
    header: 'text-[12px]',
    content: 'text-sm'
    },
    lineHeights: {
    header: 'leading-4',
    content: 'leading-5'
    }
    };

/\*\*

- RULE 5.3: Button Standards
- - Primary buttons: #4FD58F background, white text
- - Height: 40px for action buttons
- - Consistent padding and font styling
    \*/
    const BUTTON_STANDARDS = {
    primary: 'h-10 bg-[#4FD58F] text-white text-sm font-medium px-4',
    outline: 'h-11 border border-[#D0D5DD] bg-[#F9FAFB] text-sm',
    height: '40px (action buttons), 44px (filter buttons)'
    };

// ============================================================================
// 6. DATA FORMATTING RULES
// ============================================================================

/\*\*

- RULE 6.1: Date Formatting
- - Use formatDate utility for consistent date display
- - Format: "Oct 6, 2025" (MMM d, yyyy)
- - Handle null/undefined dates gracefully
    \*/
    const DATE_FORMATTING = {
    utility: 'formatDate(dateString)',
    format: 'MMM d, yyyy (e.g., "Oct 6, 2025")',
    fallback: '"-" for null/undefined dates'
    };

/\*\*

- RULE 6.2: Category/Enum Formatting
- - Use formatCategory utility for snake_case to Title Case
- - Replace underscores with spaces
- - Capitalize first letter of each word
- - Return "-" for empty values
    \*/
    const CATEGORY_FORMATTING = {
    utility: 'formatCategory(value)',
    transform: 'snake_case -> Title Case',
    empty: 'Return "-" for empty values'
    };

// ============================================================================
// 7. NAVIGATION RULES
// ============================================================================

/\*\*

- RULE 7.1: Router Integration
- - Use useRouter from next/navigation
- - Navigate to detail pages on row click
- - Navigate to create pages on button click
- - Use consistent URL patterns
    \*/
    const NAVIGATION_RULES = {
    hook: 'useRouter from next/navigation',
    detail: 'router.push(`/path/${entity.id}/details`)',
    create: 'router.push("/path/create")',
    patterns: {
    list: '/core-assets/entity-type',
    detail: '/core-assets/entity-type/{id}/details',
    create: '/core-assets/entity-type/create'
    }
    };

// ============================================================================
// 7.5 SHARED UI COMPONENTS AND HOOKS
// ============================================================================

/**
 * RULE 7.5: Shared Delete Confirmation Hook
 * - Use useDeleteConfirmation hook from hooks/useDeleteConfirmation.tsx
 * - Eliminates repetitive delete dialog state management
 * - Provides consistent delete confirmation UX
 * - Reduces 20+ lines of boilerplate per component
    */
    const DELETE_CONFIRMATION_HOOK_RULES = {
    import: 'import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation"',
    usage: {
    setup: 'Initialize hook with delete mutation and options',
    handlers: 'openDeleteDialog(id, name), closeDeleteDialog',
    component: 'Render DeleteConfirmationDialog component'
    },
    example: `
// Instead of manual state management:
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);
const [deleteName, setDeleteName] = useState("");

const handleDeleteClick = (id: string, name: string) => {
  setDeleteId(id);
  setDeleteName(name);
  setShowDeleteDialog(true);
};

const handleConfirmDelete = async () => {
  if (!deleteId) return;
  try {
    await deleteEntity(deleteId).unwrap();
    router.push("/entities");
  } catch (error) {
    console.error(error);
  }
  setShowDeleteDialog(false);
};

// And render ConfirmationDialog with all props...

// Use useDeleteConfirmation hook:
const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
  deleteMutation: async (id: string) => {
    await deleteEntity(id).unwrap();
  },
  isDeleting,
  entityTypeName: "Entity",
  onSuccess: () => router.push("/entities"),
});

// In render:
<Button onClick={() => openDeleteDialog(entity.id, entity.name)}>Delete</Button>
<DeleteConfirmationDialog />
    `,
    benefits: [
    'Eliminates 400+ lines of duplicated delete dialog code',
    'Consistent delete confirmation UX',
    'Type-safe with proper error handling',
    'Automatic loading states'
    ]
    };

/**
 * RULE 7.6: EntityDetailsLayout Component
 * - Use EntityDetailsLayout from components/custom/EntityDetailsLayout.tsx
 * - Standardized layout for all detail pages
 * - Eliminates repetitive Card + header + action button structure
 * - Reduces 50+ lines of boilerplate per detail page
    */
    const ENTITY_DETAILS_LAYOUT_RULES = {
    import: 'import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout"',
    usage: {
    basic: 'Wrap content in EntityDetailsLayout with props',
    loading: 'Built-in loading state handling',
    error: 'Built-in error state handling',
    actions: 'Built-in Edit/Delete buttons with handlers'
    },
    example: `
// Instead of manual layout:
if (isLoading) {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    </div>
  );
}

if (error) {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    </div>
  );
}

return (
  <div className="max-w-7xl mx-auto">
    <Card className="p-6 border-[#E4E7EC] shadow-none">
      <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-6">
        <div>
          <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
            Entity Details
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
            View and manage entity information
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </div>
      <CardContent className="space-y-6">
        {/* Content */}
      </CardContent>
    </Card>
  </div>
);

// Use EntityDetailsLayout:
<EntityDetailsLayout
  title="Entity Details"
  description="View and manage entity information"
  loading={isLoading}
  error={error ? "Failed to load entity" : null}
  onEdit={handleEdit}
  onDelete={handleDelete}
>
  <EntityFormReadOnly entity={entity} />
</EntityDetailsLayout>
    `,
    props: {
    title: 'Page title (required)',
    description: 'Page description (required)',
    loading: 'Loading state (optional)',
    error: 'Error message (optional)',
    onEdit: 'Edit button handler (optional)',
    onDelete: 'Delete button handler (optional)',
    customActions: 'Custom action buttons (optional)',
    showEdit: 'Show edit button (default: true if onEdit provided)',
    showDelete: 'Show delete button (default: true if onDelete provided)',
    children: 'Main content (required)'
    },
    benefits: [
    'Eliminates 600+ lines of duplicated layout code',
    'Consistent detail page UX across the app',
    'Built-in loading and error states',
    'Type-safe with clear props interface'
    ]
    };

// ============================================================================
// 8. ERROR HANDLING RULES
// ============================================================================

/\*\*

- RULE 8.1: Error State Management
- - Handle loading states in DataTable
- - Provide meaningful empty states
- - Include action buttons in empty states
- - Use consistent error messaging
    \*/
    const ERROR_HANDLING = {
    loading: 'Pass loading prop to DataTable',
    empty: {
    title: 'No {entity} found',
    description: 'Get started by creating your first {entity}',
    action: 'Button to navigate to create page'
    },
    errors: 'Extract from RTK Query error responses or Redux state'
    };

// ============================================================================
// 9. TYPE SAFETY RULES
// ============================================================================

/\*\*

- RULE 9.1: TypeScript Standards
- - Use strict typing for all props and data
- - Define interfaces for all entity types
- - Use proper generic types for DataTable
- - Implement type guards where necessary
    \*/
    const TYPE_SAFETY = {
    entities: 'Define Entity interface with all properties',
    create: 'Define CreateEntityData interface',
    filters: 'Define EntityFilters interface',
    responses: 'Use ApiResponse<T> wrapper',
    generics: 'Use proper generic types for DataTable columns',
    redux: 'Use typed Redux hooks (useAppDispatch, useAppSelector)'
    };

// ============================================================================
// 10. PERFORMANCE RULES
// ============================================================================

/\*\*

- RULE 10.1: Optimization Standards
- - Use React.memo for expensive components
- - Implement useCallback for event handlers
- - Use proper dependency arrays
- - Avoid unnecessary re-renders
- - Leverage RTK Query caching
    \*/
    const PERFORMANCE = {
    memo: 'Use React.memo for table components',
    callbacks: 'Use useCallback for all event handlers',
    dependencies: 'Proper dependency arrays in useEffect',
    rendering: 'Minimize unnecessary re-renders',
    caching: 'Leverage RTK Query automatic caching'
    };

// ============================================================================
// 11. REDUX STORE CONFIGURATION RULES
// ============================================================================

/\*\*

- RULE 11.1: Store Setup
- - Use configureStore from RTK
- - Include both RTK Query APIs and traditional slices
- - Configure middleware properly
- - Export typed hooks
    \*/
    const STORE_CONFIGURATION = {
    structure: {
    reducer: 'Combine RTK Query APIs and traditional slices',
    middleware: 'Include RTK Query middleware for each API',
    devtools: 'Enable Redux DevTools in development'
    },
    types: 'Export AppStore, RootState, AppDispatch types',
    hooks: 'Create typed hooks (useAppDispatch, useAppSelector)'
    };

/\*\*

- RULE 11.2: Provider Setup
- - Use StoreProvider wrapper
- - Implement singleton store pattern
- - Wrap with React Redux Provider
    \*/
    const PROVIDER_SETUP = {
    pattern: 'Singleton store with useRef',
    wrapper: 'StoreProvider component',
    provider: 'React Redux Provider'
    };

// ============================================================================
// 12. FILE ORGANIZATION RULES
// ============================================================================

/\*\*

- RULE 12.1: Feature-Based Organization
- - Group related files by feature
- - Separate concerns: components, hooks, services, types
- - Use consistent naming conventions
    \*/
    const FILE_ORGANIZATION = {
    structure: {
    components: 'app/components/app/entityName/',
    hooks: 'hooks/app/useEntityName.ts',
    services: 'service/app/entityName.ts',
    types: 'interfaces/EntityName.ts',
    api: 'app/lib/features/entityNameApi.ts',
    slice: 'app/lib/features/entityNameSlice.ts'
    },
    naming: 'Use kebab-case for directories, PascalCase for files'
    };

// ============================================================================
// 13. FORM HANDLING STANDARDS
// ============================================================================

/\*\*

- RULE 13.1: Form Structure and State Management
- - Use controlled components with useState
- - Define FormDataType interface for type safety
- - Implement proper validation with error states
- - Use consistent form layout and styling
    \*/
    const FORM_HANDLING_RULES = {
    state: {
    pattern: 'useState<FormDataType>(initialFormData)',
    interface: 'Define FormDataType interface matching API schema',
    validation: 'Client-side validation with error state management'
    },
    layout: {
    wrapper: 'Card component with consistent styling',
    sections: 'Group related fields in logical sections',
    spacing: 'space-y-6 or space-y-10 for vertical spacing'
    },
    validation: {
    client: 'Validate required fields before submission',
    server: 'Handle server validation errors gracefully',
    display: 'Show validation errors inline with fields'
    }
    };

/\*\*

- RULE 13.2: Form Submission and Error Handling
- - Prevent double submission with loading states
- - Handle both client and server validation errors
- - Show success/error feedback with toast notifications
- - Implement proper form reset after successful submission
    \*/
    const FORM_SUBMISSION_RULES = {
    submission: {
    prevent: 'Disable submit button during loading',
    loading: 'Show loading state during submission',
    success: 'Toast notification + redirect on success'
    },
    errors: {
    client: 'Show inline validation errors',
    server: 'Display server errors in Alert component',
    field: 'Highlight individual field errors'
    },
    reset: 'Reset form state after successful submission'
    };

/\*\*

- RULE 13.3: Form Field Standards
- - Use consistent input styling and validation
- - Implement proper field change handlers
- - Support different input types (text, select, textarea, etc.)
- - Use proper labels and help text
    \*/
    const FORM_FIELD_RULES = {
    inputs: {
    styling: 'Consistent input styling across all forms',
    validation: 'Real-time validation with error states',
    types: 'Support text, select, textarea, date, number inputs'
    },
    handlers: {
    change: 'handleFieldChange for individual fields',
    complex: 'handleComplexFieldChange for nested objects',
    arrays: 'handleArrayFieldChange for array fields'
    },
    labels: {
    required: 'Mark required fields with asterisk',
    help: 'Provide helpful descriptions where needed',
    accessibility: 'Proper label association with inputs'
    }
    };

/**
 * RULE 13.3A: Validation Utilities (RECOMMENDED)
 * - Use shared validation utilities from lib/utils/validation.ts
 * - Eliminates duplicated validation logic across 50+ form components
 * - Provides consistent validation messages and behavior
 * - Type-safe validation with clear error messages
    */
    const VALIDATION_UTILITIES_RULES = {
    import: 'import { validateTextField, validateNumericField, validateEmail, validateArrayField, createValidationErrors } from "@/lib/utils/validation"',
    functions: {
    validateTextField: 'Validate text with min/max length, required, pattern',
    validateNumericField: 'Validate numbers with min/max, integer, positive',
    validateEmail: 'Validate email format',
    validatePhone: 'Validate phone number format',
    validateUrl: 'Validate URL format',
    validateDate: 'Validate date and date ranges',
    validateArrayField: 'Validate array length (min/max items)',
    createValidationErrors: 'Filter and create validation errors object',
    combineValidations: 'Combine multiple validation results'
    },
    example: `
// Instead of manual validation:
const validateForm = (): boolean => {
  const errors: Record<string, string[]> = {};
  if (!formData.name?.trim()) {
    errors.name = ["Name is required"];
  } else if (formData.name.trim().length < 5) {
    errors.name = ["Name must be at least 5 characters"];
  }
  if (!formData.email?.trim()) {
    errors.email = ["Email is required"];
  } else if (!emailRegex.test(formData.email)) {
    errors.email = ["Invalid email"];
  }
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};

// Use validation utilities:
const validateForm = (): boolean => {
  const fieldErrors: Record<string, string[]> = {
    name: validateTextField(formData.name, {
      required: true,
      minLength: 5,
      maxLength: 255,
      messages: {
        required: "Name is required",
        length: "Name must be between 5-255 characters"
      }
    }),
    email: [
      ...validateTextField(formData.email, {
        required: true,
        messages: { required: "Email is required" }
      }),
      ...validateEmail(formData.email)
    ],
    tags: validateArrayField(formData.tags, {
      required: true,
      minLength: 1,
      messages: { required: "At least one tag is required" }
    })
  };
  
  const errors = createValidationErrors(fieldErrors);
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
    `,
    benefits: [
    'Eliminates 2000+ lines of duplicated validation code',
    'Consistent validation messages across the app',
    'Type-safe validation with clear error handling',
    'Easy to test validation logic in isolation',
    'Reduces bugs from inconsistent validation'
    ]
    };

/**
 * RULE 13.4: Multi-Step Wizard Form Pattern (Standard for All New Modules)
 * - All new modules with complex forms MUST follow the CreateUseCases wizard pattern
 * - Use MultiStepWizard component for consistent UI/UX across all modules
 * - Implement step-by-step validation with clear error messaging
 * - Maintain consistent Card structure and styling
 * - Note: Draft functionality is optional and module-specific
    */
    const MULTI_STEP_WIZARD_RULES = {
    structure: {
    pattern: 'Use MultiStepWizard wrapper component',
    steps: 'Define WIZARD_STEPS array with id, title, description',
    state: 'Manage currentStep with useState',
    navigation: 'Implement handleNext, handlePrevious, handleSubmit'
    },
    validation: {
    stepValidation: 'Implement validateStep(step: number) function',
    formValidation: 'Implement validateForm() for final submission',
    errorState: 'Use validationErrors state: Record<string, string[]>',
    display: 'Show errors in Alert component at top of form',
    navigation: 'Navigate to first step with errors on submission'
    },
    layout: {
    wrapper: 'max-w-7xl mx-auto px-4 py-6',
    card: 'Card with p-6 border-[#E4E7EC] shadow-none',
    header: 'h1 with font-sans font-semibold text-2xl text-[#1D2939]',
    description: 'p with font-sans font-normal text-sm text-[#667085]',
    content: 'CardContent with space-y-8 w-full p-0'
    },
    stepContent: {
    pattern: 'Use switch/case in renderStepContent()',
    components: 'Create separate component for each step',
    props: 'Pass formData, setFormData, errors to each step component',
    consistency: 'All step components follow same prop interface'
    },
    formData: {
    interface: 'Define FormDataType interface with all fields',
    initial: 'Create initialFormData constant with default values',
    state: 'Use useState<FormDataType>(initialFormData)',
    updates: 'Use setFormData to update form state'
    },
    validation_rules: {
    required: 'Validate required fields with clear error messages',
    length: 'Validate string length constraints (min/max)',
    format: 'Validate email, URL, date formats where applicable',
    numeric: 'Validate numeric ranges and integer constraints',
    arrays: 'Validate array length (e.g., at least one stakeholder)',
    conditional: 'Validate conditional fields based on other field values'
    },
    submission: {
    clientValidation: 'Validate entire form before API call',
    apiCall: 'Use RTK Query mutation for submission',
    loading: 'Pass isLoading to MultiStepWizard',
    success: 'Reset form and navigate to list page on success',
    error: 'Handle server errors and navigate to error step',
    scrollTop: 'Scroll to top on navigation: window.scrollTo({ top: 0, behavior: "smooth" })'
    },
    userExperience: {
    progressIndicator: 'Show clear step progress in wizard',
    navigation: 'Enable Previous/Next buttons with proper state',
    disableNext: 'Disable Next until step validation passes',
    errorFeedback: 'Show all validation errors in Alert at top',
    fieldErrors: 'Also show inline errors on individual fields',
    smoothTransitions: 'Smooth scroll to top on step changes'
    },
    optional_features: {
    saveDraft: 'Draft functionality is optional per module requirements',
    autosave: 'Autosave functionality is optional per module',
    progressPersistence: 'LocalStorage persistence is optional'
    },
    consistency: {
    allModules: 'ALL new modules MUST follow this exact pattern',
    validation: 'Validation patterns MUST be consistent across modules',
    ui: 'UI/UX MUST match CreateUseCases component styling',
    structure: 'File structure and naming MUST be consistent'
    }
    };

/**
 * RULE 13.5: Multi-Step Wizard Implementation Example
 * 
 * const WIZARD_STEPS = [
 *   { id: 1, title: "Step 1", description: "Description" },
 *   { id: 2, title: "Step 2", description: "Description" }
 * ];
 * 
 * const [currentStep, setCurrentStep] = useState(1);
 * const [formData, setFormData] = useState<FormDataType>(initialFormData);
 * const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
 * 
 * const validateStep = (step: number): boolean => {
 *   const errors: Record<string, string[]> = {};
 *   switch (step) {
 *     case 1:
 *       if (!formData.name?.trim()) errors.name = ["Name is required"];
 *       break;
 *   }
 *   setValidationErrors(errors);
 *   return Object.keys(errors).length === 0;
 * };
 * 
 * const handleNext = () => {
 *   if (validateStep(currentStep)) {
 *     setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
 *     window.scrollTo({ top: 0, behavior: "smooth" });
 *   }
 * };
 * 
 * const handleSubmit = async () => {
 *   if (!validateForm()) return;
 *   try {
 *     await createMutation(formData).unwrap();
 *     router.push("/list-page");
 *   } catch (err: any) {
 *     if (err?.data?.errors) {
 *       setValidationErrors(err.data.errors);
 *     }
 *   }
 * };
    */

/**
 * RULE 13.6: Multi-Step Form Component Structure (MANDATORY for Complex Forms)
 * - ALL complex multi-step forms MUST follow the AiRiskRegisterForm structure
 * - Break large forms into smaller, maintainable step components
 * - Extract shared types and validation logic into separate files
 * - Keep main form component as a lightweight coordinator
 * - This pattern reduces file size by 70-80% and improves maintainability
    */
    const MULTI_STEP_FORM_STRUCTURE_RULES = {
    fileOrganization: {
    pattern: 'Organize form files in create/ directory with subdirectories',
    structure: {
    mainForm: 'EntityForm.tsx - Main coordinator component (200-300 lines)',
    types: 'types.ts - Shared FormState type and getInitialState helper',
    validation: 'validation.ts - Step validation logic and helper functions',
    steps: 'steps/ directory - Individual step components (100-200 lines each)'
    },
    example: `
components/app/entityName/create/
├── EntityForm.tsx (main coordinator)
├── types.ts (FormState type, getInitialState)
├── validation.ts (validateStep, parseNumber, etc.)
└── steps/
    ├── BasicInformationStep.tsx
    ├── AdditionalDetailsStep.tsx
    ├── ReviewStep.tsx
    └── ConfirmationStep.tsx
    `
    },
    mainFormComponent: {
    responsibilities: {
    state: 'Manage formState, currentStep, validationErrors',
    dataFetching: 'Fetch dropdown data (models, versions, etc.)',
    navigation: 'Handle step navigation (handleNext, handlePrevious)',
    submission: 'Handle form submission and payload transformation',
    coordination: 'Render appropriate step component based on currentStep'
    },
    structure: {
    imports: 'Import step components, types, validation utilities',
    state: 'useState for formState, currentStep, validationErrors',
    queries: 'RTK Query hooks for dropdown data',
    handlers: 'handleNext, handlePrevious, handleSubmit, handleValidateStep',
    render: 'renderStepContent() with switch/case for step components',
    wrapper: 'Card + MultiStepWizard wrapper'
    },
    targetSize: '200-300 lines maximum (down from 1000+ lines)'
    },
    typesFile: {
    purpose: 'Centralize FormState type definition and initialization',
    exports: {
    FormState: 'Type definition for all form fields',
    getInitialState: 'Function to initialize form state from initialData'
    },
    example: `
// types.ts
import { Entity, FieldType } from "@/interfaces/Entity";

export type FormState = {
  field1: string;
  field2: FieldType;
  // ... all form fields
};

export const getInitialState = (initial?: Entity): FormState => ({
  field1: initial?.field1 ?? "",
  field2: initial?.field2 ?? FieldType.DEFAULT,
  // ... initialize all fields
});
    `
    },
    validationFile: {
    purpose: 'Extract validation logic from main form component',
    exports: {
    validateStep: 'Function to validate a specific step, returns { isValid, errors }',
    parseNumber: 'Helper function for number parsing',
    otherHelpers: 'Any other validation-related utilities'
    },
    example: `
// validation.ts
import { validateTextField, validateNumericField, createValidationErrors } from "@/lib/utils/validation";
import { FormState } from "./types";

export const validateStep = (
  step: number,
  formState: FormState
): { isValid: boolean; errors: Record<string, string[]> } => {
  const fieldErrors: Record<string, string[]> = {};
  
  if (step === 1) {
    fieldErrors.field1 = validateTextField(formState.field1, {
      required: true,
      messages: { required: "Field1 is required" }
    });
  }
  
  const errors = createValidationErrors(fieldErrors);
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const parseNumber = (value: string) => {
  if (!value || value.trim() === "" || value === "0") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed;
};
    `
    },
    stepComponents: {
    pattern: 'Each step is a separate component in steps/ directory',
    naming: 'Use descriptive names: BasicInformationStep, RiskAssessmentStep, etc.',
    props: {
    required: [
    'formState: FormState',
    'setFormState: React.Dispatch<React.SetStateAction<FormState>>',
    'validationErrors: Record<string, string[]>'
    ],
    optional: [
    'Data for dropdowns (models, versions, etc.)',
    'Loading states for async data',
    'Any step-specific props'
    ]
    },
    structure: {
    imports: 'Import UI components, types, utilities',
    interface: 'Define StepProps interface',
    component: 'Export step component with consistent props',
    content: 'Render step-specific form fields',
    styling: 'Use consistent Card/div structure with section headers'
    },
    example: `
// steps/BasicInformationStep.tsx
"use client";

import React from "react";
import { Input, Label, Select } from "@/components/ui/...";
import { FormState } from "../types";

interface BasicInformationStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  // Step-specific props (dropdowns, loading states, etc.)
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  // ... other props
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h3>
        <hr className="border-gray-200" />
      </div>
      {/* Step-specific form fields */}
    </div>
  );
};
    `,
    targetSize: '100-200 lines per step component'
    },
    benefits: {
    maintainability: 'Each step is isolated and easy to modify',
    readability: 'Main form is clean and focused on coordination',
    reusability: 'Step components can be reused or tested independently',
    scalability: 'Easy to add new steps or modify existing ones',
    sizeReduction: 'Reduces main form from 1000+ lines to 200-300 lines (70-80% reduction)'
    },
    implementationChecklist: {
    structure: [
    '[ ] Create types.ts with FormState and getInitialState',
    '[ ] Create validation.ts with validateStep and helpers',
    '[ ] Create steps/ directory',
    '[ ] Extract each step into separate component file',
    '[ ] Update main form to import and use step components'
    ],
    mainForm: [
    '[ ] Import step components from steps/',
    '[ ] Import types from types.ts',
    '[ ] Import validation from validation.ts',
    '[ ] Replace renderStepContent() switch cases with step components',
    '[ ] Pass required props to each step component',
    '[ ] Keep main form under 300 lines'
    ],
    stepComponents: [
    '[ ] Define StepProps interface with required props',
    '[ ] Extract step JSX into component',
    '[ ] Pass formState, setFormState, validationErrors as props',
    '[ ] Pass step-specific data (dropdowns, loading states) as props',
    '[ ] Use consistent section header styling',
    '[ ] Keep each step component under 200 lines'
    ],
    validation: [
    '[ ] Move validateStep logic to validation.ts',
    '[ ] Update to return { isValid, errors } object',
    '[ ] Extract helper functions (parseNumber, etc.)',
    '[ ] Import validation utilities from lib/utils/validation'
    ],
    types: [
    '[ ] Define FormState type with all form fields',
    '[ ] Create getInitialState function',
    '[ ] Export both for use in main form and step components'
    ]
    },
    exampleStructure: `
// Main Form (EntityForm.tsx) - ~250 lines
import { FormState, getInitialState } from "./types";
import { validateStep, parseNumber } from "./validation";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { AdditionalDetailsStep } from "./steps/AdditionalDetailsStep";

export const EntityForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [formState, setFormState] = useState<FormState>(getInitialState(initialData));
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  
  // Data fetching
  const { data: models } = useGetModelsQuery();
  
  const handleValidateStep = (step: number): boolean => {
    const { isValid, errors } = validateStep(step, formState);
    setValidationErrors(errors);
    return isValid;
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            models={models}
          />
        );
      case 2:
        return (
          <AdditionalDetailsStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <MultiStepWizard {...wizardProps}>
        {renderStepContent()}
      </MultiStepWizard>
    </Card>
  );
};
    `,
    consistency: {
    mandatory: 'ALL new complex forms MUST follow this exact structure',
    existing: 'Refactor existing large forms (>500 lines) to use this structure',
    exceptions: 'Simple single-step forms (<200 lines) may remain in single file',
    enforcement: 'Code reviews should enforce this structure for complex forms'
    }
    };

// ============================================================================
// 14. FILTERING / PAGINATION RULES
// ============================================================================

/\*\*

- RULE 14.1: DataTable Filtering Implementation
- - Support both client-side and server-side filtering
- - Implement debounced search (300ms delay)
- - Use consistent filter UI components
- - Handle filter state management properly
    \*/
    const FILTERING_RULES = {
    search: {
    debounce: '300ms delay for search input',
    placeholder: 'Consistent search placeholder text',
    clear: 'Provide clear search functionality'
    },
    serverSide: {
    pattern: 'Use serverSide prop for DataTable',
    params: 'Pass filter parameters to API calls',
    state: 'Manage filter state in custom hooks'
    },
    clientSide: {
    pattern: 'Use TanStack Table filtering for small datasets',
    performance: 'Only for datasets < 1000 items'
    }
    };

/\*\*

- RULE 14.2: Pagination Implementation
- - Support both client-side and server-side pagination
- - Use consistent pagination component (Pagniation)
- - Handle page state management
- - Provide proper loading states during page changes
    \*/
    const PAGINATION_RULES = {
    serverSide: {
    pattern: 'Use pagination prop with server-side data',
    state: 'Manage page state in custom hooks',
    loading: 'Show loading during page transitions'
    },
    clientSide: {
    pattern: 'Use TanStack Table pagination for small datasets',
    performance: 'Only for datasets < 1000 items'
    },
    component: {
    usage: 'Use custom Pagniation component',
    props: 'Pass currentPage, totalPages, onPageChange',
    styling: 'Consistent pagination button styling'
    }
    };

/\*\*

- RULE 14.3: Filter State Management
- - Use consistent filter interfaces
- - Implement proper filter reset functionality
- - Handle URL state synchronization
- - Provide filter persistence across navigation
    \*/
    const FILTER_STATE_RULES = {
    interfaces: {
    pattern: 'Define EntityFilters interface',
    properties: 'Include search, page, per_page, and entity-specific filters',
    optional: 'Make all filter properties optional'
    },
    management: {
    state: 'Manage filter state in custom hooks',
    reset: 'Provide resetFilters function',
    url: 'Sync filter state with URL parameters'
    },
    persistence: {
    storage: 'Use localStorage for filter persistence',
    navigation: 'Maintain filters across page navigation'
    }
    };

// ============================================================================
// 15. LOADING + SKELETON RULES
// ============================================================================

/\*\*

- RULE 15.1: Loading State Implementation
- - Use consistent loading indicators across the app
- - Implement proper loading states for different scenarios
- - Avoid janky UX with proper loading transitions
- - Use skeleton components for better perceived performance
    \*/
    const LOADING_RULES = {
    indicators: {
    spinner: 'Use custom Spinner component with size variants',
    skeleton: 'Implement skeleton components for complex layouts',
    inline: 'Show inline loading states for specific actions'
    },
    states: {
    initial: 'Show loading on initial data fetch',
    refresh: 'Show loading on data refresh',
    mutation: 'Show loading during create/update/delete operations',
    navigation: 'Show loading during page transitions'
    },
    components: {
    spinner: 'Custom Spinner with sm, md, lg sizes',
    skeleton: 'Skeleton components for cards, tables, forms',
    overlay: 'Full-screen loading for critical operations'
    }
    };

/\*\*

- RULE 15.2: Skeleton Component Standards
- - Create skeleton components that match actual content layout
- - Use consistent skeleton styling and animations
- - Implement skeletons for common UI patterns
- - Provide proper accessibility attributes
    \*/
    const SKELETON_RULES = {
    patterns: {
    table: 'Skeleton rows for DataTable loading',
    card: 'Skeleton cards for grid layouts',
    form: 'Skeleton form fields for form loading',
    list: 'Skeleton list items for list loading'
    },
    styling: {
    animation: 'Subtle pulse animation for skeleton elements',
    colors: 'Use gray-200 for skeleton background',
    spacing: 'Match actual content spacing and sizing'
    },
    accessibility: {
    aria: 'Use aria-label="Loading" for screen readers',
    role: 'Add role="status" for loading indicators'
    }
    };

/\*\*

- RULE 15.3: Loading State Management
- - Combine loading states from different sources
- - Handle loading states in custom hooks
- - Provide loading state to components
- - Implement proper loading state cleanup
    \*/
    const LOADING_STATE_RULES = {
    combination: {
    pattern: 'Combine loading states from queries and mutations',
    logic: 'loading = queryLoading || mutationLoading',
    cleanup: 'Reset loading states on component unmount'
    },
    hooks: {
    pattern: 'Return loading state from custom hooks',
    naming: 'Use loading or isLoading for loading state',
    types: 'Use boolean type for loading states'
    },
    components: {
    props: 'Pass loading prop to DataTable and other components',
    conditional: 'Conditionally render loading vs content',
    transitions: 'Smooth transitions between loading and loaded states'
    }
    };

// ============================================================================
// 16. RBAC / ACCESS CONTROL RULES
// ============================================================================

/\*\*

- RULE 16.1: Role-Based Access Control Implementation
- - Define clear role hierarchy and permissions
- - Implement role-based navigation and UI rendering
- - Use consistent role checking patterns
- - Handle unauthorized access gracefully
    \*/
    const RBAC_RULES = {
    roles: {
    hierarchy: 'SUPER_ADMIN > ADMIN > OWNER > PROJECT_LEAD > REVIEWER > CONTRIBUTOR > AUDITOR',
    definition: 'Define roles in interfaces/Roles.ts enum',
    metadata: 'Store role in user.user_metadata.role'
    },
    navigation: {
    pattern: 'Use role-based route filtering in Sidebar',
    logic: 'role === Role.SUPER_ADMIN ? adminRoutes : userRoutes',
    protection: 'Protect routes with middleware and component guards'
    },
    ui: {
    conditional: 'Conditionally render UI elements based on role',
    patterns: 'Use role checks for button visibility, form access',
    fallback: 'Show appropriate fallback for unauthorized users'
    }
    };

/\*\*

- RULE 16.2: Permission-Based Access Control
- - Implement granular permissions for different actions
- - Use permission checks for CRUD operations
- - Handle permission-based UI rendering
- - Provide clear feedback for unauthorized actions
    \*/
    const PERMISSION_RULES = {
    checks: {
    pattern: 'Check permissions before rendering UI elements',
    functions: 'Create utility functions for permission checks',
    hooks: 'Use custom hooks for permission state management'
    },
    operations: {
    create: 'Check create permission before showing create buttons',
    edit: 'Check edit permission before showing edit actions',
    delete: 'Check delete permission before showing delete actions',
    view: 'Check view permission before showing sensitive data'
    },
    feedback: {
    unauthorized: 'Show appropriate message for unauthorized access',
    redirect: 'Redirect to appropriate page for unauthorized users',
    fallback: 'Show fallback UI for users without permissions'
    }
    };

/\*\*

- RULE 16.3: Route Protection and Middleware
- - Implement route-level protection with middleware
- - Handle authentication and authorization checks
- - Redirect users to appropriate pages based on role
- - Protect API endpoints with proper authorization
    \*/
    const ROUTE_PROTECTION_RULES = {
    middleware: {
    pattern: 'Use Next.js middleware for route protection',
    checks: 'Check authentication and role in middleware',
    redirects: 'Redirect to login or appropriate dashboard'
    },
    components: {
    guards: 'Implement component-level permission guards',
    wrappers: 'Use HOCs for permission-based component wrapping',
    conditional: 'Conditionally render components based on permissions'
    },
    api: {
    authorization: 'Include authorization headers in API calls',
    validation: 'Validate permissions on server side',
    errors: 'Handle 403 errors gracefully in UI'
    }
    };

// ============================================================================
// 17. ERROR UX RENDERING RULES
// ============================================================================

/\*\*

- RULE 17.1: Toast vs Inline Error Decision Matrix
- - Use toast notifications for global actions and feedback
- - Use inline errors for form validation and field-specific issues
- - Implement consistent error messaging patterns
- - Provide clear error recovery actions
    \*/
    const ERROR_RENDERING_RULES = {
    toast: {
    useFor: [
    'API operation success/failure',
    'Global application errors',
    'Network connectivity issues',
    'Authentication errors',
    'Bulk operations results'
    ],
    patterns: {
    success: 'toast.success("Operation completed successfully")',
    error: 'toast.error("Operation failed: error message")',
    info: 'toast.info("Information message")',
    warning: 'toast.warning("Warning message")'
    }
    },
    inline: {
    useFor: [
    'Form field validation errors',
    'Field-specific error messages',
    'Component-level error states',
    'Input validation feedback'
    ],
    patterns: {
    field: 'Show error below input field',
    component: 'Show error within component boundary',
    form: 'Show validation errors in Alert component'
    }
    }
    };

/\*\*

- RULE 17.2: Error State Management
- - Implement consistent error state handling
- - Provide proper error recovery mechanisms
- - Use appropriate error UI components
- - Handle different types of errors appropriately
    \*/
    const ERROR_STATE_RULES = {
    types: {
    validation: 'Show inline errors with field highlighting',
    network: 'Show toast with retry option',
    auth: 'Show toast and redirect to login',
    server: 'Show toast with error details',
    unknown: 'Show generic error message with support contact'
    },
    components: {
    alert: 'Use Alert component for form validation errors',
    toast: 'Use ToastContainer for global notifications',
    inline: 'Show error text below form fields',
    fallback: 'Show error boundary for unexpected errors'
    },
    recovery: {
    retry: 'Provide retry buttons for failed operations',
    refresh: 'Allow users to refresh data',
    contact: 'Provide support contact for persistent errors',
    fallback: 'Show fallback UI for critical errors'
    }
    };

/\*\*

- RULE 17.3: Error Message Standards
- - Use clear, actionable error messages
- - Avoid technical jargon in user-facing messages
- - Provide context for error resolution
- - Implement consistent error message formatting
    \*/
    const ERROR_MESSAGE_RULES = {
    content: {
    clear: 'Use clear, non-technical language',
    actionable: 'Provide specific steps to resolve error',
    context: 'Include relevant context for the error',
    helpful: 'Suggest alternative actions when possible'
    },
    formatting: {
    consistent: 'Use consistent error message format',
    length: 'Keep messages concise but informative',
    tone: 'Use professional, helpful tone',
    localization: 'Prepare messages for future localization'
    },
    examples: {
    good: 'Please check your internet connection and try again',
    bad: 'NetworkError: Failed to fetch data from API endpoint',
    better: 'Unable to load data. Please check your connection and try again.'
    }
    };

// ============================================================================
// IMPLEMENTATION CHECKLIST
// ============================================================================

/\*\*

- When implementing a new feature, ensure:
-
- ✅ Component Structure:
- - [ ] "use client" directive
- - [ ] Proper import organization
- - [ ] Default export
-
- ✅ DataTable Implementation:
- - [ ] Card wrapper with consistent styling
- - [ ] Header with title and action button
- - [ ] ColumnDef<EntityType>[] typing
- - [ ] Consistent header and cell styling
-
- ✅ Detail Pages (RECOMMENDED):
- - [ ] Use EntityDetailsLayout from components/custom/EntityDetailsLayout.tsx
- - [ ] Use useDeleteConfirmation hook for delete dialogs
- - [ ] Pass loading/error states to EntityDetailsLayout
- - [ ] Render DeleteConfirmationDialog component
- - [ ] Remove manual Card + header boilerplate
-
- ✅ State Management Decision:
- - [ ] Choose RTK Query for simple CRUD
- - [ ] Choose Traditional Redux for complex state
- - [ ] Implement appropriate patterns
-
- ✅ RTK Query Implementation (if applicable):
- - [ ] Import axiosBaseQuery from lib/api/rtkQueryBase.ts
- - [ ] Import MutationError, hasValidationErrors from shared utilities
- - [ ] Use shared base query instead of duplicating
- - [ ] Proper tag invalidation
- - [ ] Response transformation
- - [ ] Toast notifications with hasValidationErrors check
-
- ✅ Traditional Redux Implementation (if applicable):
- - [ ] State interface definition
- - [ ] Async thunks for API calls
- - [ ] Extra reducers for thunk handling
- - [ ] Custom reducers for local state
-
- ✅ Custom Hooks:
- - [ ] Typed Redux hooks
- - [ ] Backward compatibility wrappers
- - [ ] Proper loading and error handling
- - [ ] useCallback for stable references
-
- ✅ Service Layer:
- - [ ] Entity and CreateEntityData interfaces
- - [ ] CRUD operations
- - [ ] ApiResponse wrapper
- - [ ] Filter interfaces
-
- ✅ Form Handling:
- - [ ] FormDataType interface definition
- - [ ] Controlled components with useState
- - [ ] Client-side validation using validation utilities
- - [ ] Server error handling
- - [ ] Consistent form layout
-
- ✅ Validation Utilities (RECOMMENDED):
- - [ ] Import validation utilities from lib/utils/validation.ts
- - [ ] Use validateTextField for text inputs
- - [ ] Use validateNumericField for numeric inputs
- - [ ] Use validateEmail for email validation
- - [ ] Use validateArrayField for array validation
- - [ ] Use createValidationErrors to filter errors
- - [ ] Remove manual validation functions
-
- ✅ Multi-Step Wizard (for complex forms):
- - [ ] WIZARD_STEPS array with step definitions
- - [ ] MultiStepWizard wrapper component
- - [ ] Step-by-step validation with validateStep()
- - [ ] Form validation with validateForm()
- - [ ] Validation errors in Alert component
- - [ ] Separate step components with consistent props
- - [ ] Next/Previous/Submit navigation handlers
- - [ ] Smooth scroll on step changes
- - [ ] Navigate to error step on validation failure
-
- ✅ Multi-Step Form Structure (MANDATORY for complex forms >500 lines):
- - [ ] Create types.ts with FormState type and getInitialState helper
- - [ ] Create validation.ts with validateStep function and helper utilities
- - [ ] Create steps/ directory for step components
- - [ ] Extract each step into separate component file (100-200 lines each)
- - [ ] Main form component acts as coordinator (200-300 lines max)
- - [ ] Step components receive formState, setFormState, validationErrors as props
- - [ ] Pass step-specific data (dropdowns, loading states) as props to steps
- - [ ] Use consistent section header styling in step components
- - [ ] Import step components in main form renderStepContent()
- - [ ] Keep main form under 300 lines (70-80% size reduction)
-
- ✅ Filtering & Pagination:
- - [ ] Server-side or client-side filtering decision
- - [ ] Debounced search implementation
- - [ ] Pagination component integration
- - [ ] Filter state management
-
- ✅ Loading States:
- - [ ] Loading indicators for all async operations
- - [ ] Skeleton components for complex layouts
- - [ ] Proper loading state management
- - [ ] Smooth loading transitions
-
- ✅ RBAC Implementation:
- - [ ] Role-based navigation
- - [ ] Permission checks for UI elements
- - [ ] Route protection
- - [ ] Unauthorized access handling
-
- ✅ Error Handling:
- - [ ] Toast vs inline error decision
- - [ ] Consistent error messaging
- - [ ] Error recovery mechanisms
- - [ ] Proper error state management
-
- ✅ Styling:
- - [ ] Consistent color scheme
- - [ ] Typography standards
- - [ ] Button styling
-
- ✅ Data Formatting:
- - [ ] Date formatting utility
- - [ ] Category formatting utility
- - [ ] Status badge implementation
-
- ✅ Navigation:
- - [ ] Router integration
- - [ ] Consistent URL patterns
- - [ ] Row click navigation
-
- ✅ Type Safety:
- - [ ] Entity interfaces
- - [ ] Generic types
- - [ ] Type guards
- - [ ] Typed Redux hooks
-
- ✅ Performance:
- - [ ] useCallback for handlers
- - [ ] Proper dependencies
- - [ ] Memoization where needed
- - [ ] RTK Query caching
-
- ✅ Store Configuration:
- - [ ] Add to store reducer
- - [ ] Include middleware
- - [ ] Export typed hooks
-
- ✅ File Organization:
- - [ ] Feature-based structure
- - [ ] Consistent naming
- - [ ] Proper separation of concerns
        \*/

// ============================================================================
// REDUX IMPLEMENTATION EXAMPLES
// ============================================================================

/\*\*

- RTK Query API Slice Example:
-
- export const entityApi = createApi({
- reducerPath: "entityApi",
- baseQuery: axiosBaseQuery(),
- tagTypes: ["Entity"],
- endpoints: (builder) => ({
-     getEntities: builder.query<Entity[], void>({
-       query: () => ({ url: "/entities", method: "GET" }),
-       providesTags: (result) =>
-         result ? [...result.map(({ id }) => ({ type: "Entity", id }))] : [],
-     }),
-     createEntity: builder.mutation<Entity, CreateEntityData>({
-       query: (data) => ({ url: "/entities", method: "POST", data }),
-       invalidatesTags: [{ type: "Entity", id: "LIST" }],
-     }),
- }),
- });
-
- Traditional Redux Slice Example:
-
- const entitySlice = createSlice({
- name: "entity",
- initialState: { entities: [], loading: false, error: null },
- reducers: { clearError: (state) => { state.error = null; } },
- extraReducers: (builder) => {
-     builder
-       .addCase(fetchEntities.pending, (state) => { state.loading = true; })
-       .addCase(fetchEntities.fulfilled, (state, action) => {
-         state.entities = action.payload;
-       });
- },
- });
-
- Custom Hook Example:
-
- export const useEntity = () => {
- const { data, loading, error } = useGetEntitiesQuery();
- const [createMutation] = useCreateEntityMutation();
-
- return {
-     entities: data ?? [],
-     loading,
-     error,
-     createEntity: (data) => createMutation(data),
- };
- };
-
- Form Handling Example:
-
- const [formData, setFormData] = useState<FormDataType>(initialFormData);
- const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
-
- const handleSubmit = async (e: React.FormEvent) => {
- e.preventDefault();
- if (!formData.name.trim()) {
-     toast.error("Name is required");
-     return;
- }
- // Submit logic
- };
-
- Filtering Example:
-
- const handleSearch = useCallback((searchTerm: string) => {
- if (debounceRef.current) clearTimeout(debounceRef.current);
- debounceRef.current = setTimeout(() => {
-     onSearch(searchTerm);
- }, 300);
- }, [onSearch]);
-
- RBAC Example:
-
- const { user } = useAuth();
- const role = user?.user_metadata?.role ?? "Owner";
- const canEdit = role === Role.ADMIN || role === Role.OWNER;
-
- Error Handling Example:
-
- // Toast for global actions
- toast.success("Entity created successfully");
- toast.error("Failed to create entity");
-
- // Inline for form validation
- {validationErrors.name && (
- <p className="text-red-500 text-sm mt-1">{validationErrors.name[0]}</p>
- )}
-
- Multi-Step Wizard Example (STANDARD FOR ALL NEW MODULES):
- NOTE: For complex forms (>500 lines), MUST follow RULE 13.6 structure pattern
- (types.ts, validation.ts, steps/ directory). See RULE 13.6 for details.
-
- // 1. Define steps
- const WIZARD_STEPS = [
-   { id: 1, title: "Basic Information", description: "Core details" },
-   { id: 2, title: "Additional Details", description: "Extra info" }
- ];
-
- // 2. Setup state
- const [currentStep, setCurrentStep] = useState(1);
- const [formData, setFormData] = useState<FormDataType>(initialFormData);
- const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
- const [createEntity, { isLoading }] = useCreateEntityMutation();
-
- // 3. Step validation (extract to validation.ts for complex forms)
- const validateStep = (step: number): boolean => {
-   const errors: Record<string, string[]> = {};
-   switch (step) {
-     case 1:
-       if (!formData.name?.trim()) {
-         errors.name = ["Name is required"];
-       } else if (formData.name.trim().length < 5) {
-         errors.name = ["Name must be at least 5 characters"];
-       }
-       break;
-     case 2:
-       if (!formData.description?.trim()) {
-         errors.description = ["Description is required"];
-       }
-       break;
-   }
-   setValidationErrors(errors);
-   return Object.keys(errors).length === 0;
- };
-
- // 4. Navigation handlers
- const handleNext = () => {
-   if (validateStep(currentStep)) {
-     setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
-     setValidationErrors({});
-     window.scrollTo({ top: 0, behavior: "smooth" });
-   } else {
-     window.scrollTo({ top: 0, behavior: "smooth" });
-   }
- };
-
- const handlePrevious = () => {
-   setCurrentStep((prev) => Math.max(prev - 1, 1));
-   setValidationErrors({});
-   window.scrollTo({ top: 0, behavior: "smooth" });
- };
-
- // 5. Form submission
- const handleSubmit = async () => {
-   setValidationErrors({});
-   if (!validateForm()) {
-     // Navigate to first step with errors
-     for (let step = 1; step <= WIZARD_STEPS.length; step++) {
-       if (!validateStep(step)) {
-         setCurrentStep(step);
-         window.scrollTo({ top: 0, behavior: "smooth" });
-         return;
-       }
-     }
-     return;
-   }
-   try {
-     await createEntity(formData).unwrap();
-     setFormData(initialFormData);
-     router.push("/entity-list");
-   } catch (err: any) {
-     if (err?.data?.errors) {
-       setValidationErrors(err.data.errors);
-     }
-   }
- };
-
- // 6. Render with MultiStepWizard
- // For complex forms, extract renderStepContent() cases into step components
- const renderStepContent = () => {
-   switch (currentStep) {
-     case 1:
-       return <BasicInformationStep formData={formData} setFormData={setFormData} errors={validationErrors} />;
-     case 2:
-       return <AdditionalDetailsStep formData={formData} setFormData={setFormData} errors={validationErrors} />;
-     default:
-       return null;
-   }
- };
-
- return (
-   <div className="max-w-7xl mx-auto px-4 py-6">
-     <Card className="p-6 border-[#E4E7EC] shadow-none">
-       <CardContent className="space-y-8 w-full p-0">
-         {Object.keys(validationErrors).length > 0 && (
-           <Alert variant="destructive">
-             <AlertCircle className="h-4 w-4" />
-             <AlertDescription>
-               <p className="font-semibold mb-2">Please fix the following errors:</p>
-               <ul className="list-disc list-inside space-y-1">
-                 {Object.entries(validationErrors).map(([field, errors]) => (
-                   <li key={field}>{field}: {errors[0]}</li>
-                 ))}
-               </ul>
-             </AlertDescription>
-           </Alert>
-         )}
-         <MultiStepWizard
-           currentStep={currentStep}
-           steps={WIZARD_STEPS}
-           onNext={handleNext}
-           onPrevious={handlePrevious}
-           onSubmit={handleSubmit}
-           isLoading={isLoading}
-         >
-           {renderStepContent()}
-         </MultiStepWizard>
-       </CardContent>
-     </Card>
-   </div>
- );
-
- Badge Variants Example:
-
- // CORRECT - Use only these three variants
- <Badge variant="filled">Active</Badge>
- <Badge variant="light">Pending</Badge>
- <Badge variant="outlined">Draft</Badge>
-
- // INCORRECT - These variants DO NOT exist
- <Badge variant="solid">Active</Badge>  // ❌ Wrong
- <Badge variant="default">Active</Badge>  // ❌ Wrong
- <Badge variant="subtle">Active</Badge>  // ❌ Wrong
  \*/
