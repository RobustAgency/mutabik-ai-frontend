# API Files Refactoring Summary

## ✅ Completed Refactoring (9 files)

### Meta-based Pattern (6 files)
- `frameworksApi.ts`
- `requirementsApi.ts`
- `complianceEvidenceApi.ts`
- `controlsApi.ts`
- `requirementControlsApi.ts`
- `regulatorySubmissionsApi.ts`

### Pagination-based Pattern (3 files)
- `vendorsApi.ts` (with STATISTICS tag)
- `aiIncidentsApi.ts` (with toast handlers)
- `consentRecordsApi.ts` (calculated from/to with toast)

---

## 📋 Refactoring Patterns Guide

### Pattern 1: Meta-based Response
**Files that use this pattern:**
- Files with `normaliseMeta` function
- Returns `{ data: T[], meta: ListMeta }`

**Refactoring steps:**
```typescript
// 1. Add imports
import {
  transformListResponseWithMeta,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  ListResponseWithMeta,
  SingleItemResponse,
  ListMeta,
} from "@/lib/api/rtkQueryHelpers";

// 2. Remove normaliseMeta function (use helper instead)

// 3. Replace transformResponse
transformResponse: transformListResponseWithMeta<EntityType>,

// 4. Replace providesTags
providesTags: (result) => createListTags(result, "EntityName"),

// 5. Replace single item transformResponse
transformResponse: transformSingleItemResponse<EntityType>,

// 6. Replace single item providesTags
providesTags: createItemTags("EntityName"),

// 7. Replace invalidatesTags
invalidatesTags: createInvalidateListTags("EntityName"),  // for create
invalidatesTags: createInvalidateItemAndListTags("EntityName"),  // for update/delete
```

---

### Pattern 2: Pagination-based Response (with from/to already in response)
**Files that use this pattern:**
- Files with `pagination: PaginationMeta` (from/to included)
- Returns `{ data: T[], pagination: PaginationMeta }`

**Refactoring steps:**
```typescript
// 1. Add imports
import {
  transformListResponseWithPagination,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,  // if has toast
  createDeleteToastHandler,     // if has delete with toast
} from "@/lib/api/rtkQueryHelpers";
import { toast } from "react-toastify";  // if using toast handlers

// 2. Replace transformResponse
transformResponse: transformListResponseWithPagination<EntityType>,

// 3. Replace providesTags
providesTags: (result) => createListTags(result, "EntityName"),

// 4. Replace toast handlers (if applicable)
onQueryStarted: createMutationToastHandler(
  "Entity created successfully",
  "Failed to create entity"
),
```

---

### Pattern 3: Pagination with Calculated from/to
**Files that use this pattern:**
- Files that calculate `from` and `to` manually
- Returns `{ data: T[], pagination?: PaginationMeta }`

**Refactoring steps:**
```typescript
// 1. Add imports
import {
  transformListResponseWithCalculatedPagination,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
  createDeleteToastHandler,
} from "@/lib/api/rtkQueryHelpers";
import { toast } from "react-toastify";  // if using toast handlers

// 2. Replace transformResponse (removes manual from/to calculation)
transformResponse: transformListResponseWithCalculatedPagination<EntityType>,

// 3. Rest same as Pattern 2
```

---

## 🔍 Remaining Files to Refactor

### Meta-based Pattern (0 remaining)
✅ All done!

### Pagination-based Pattern (remaining ~15-20 files)
Files likely using pagination pattern:
- `agreementsApi.ts`
- `stakeholdersApi.ts`
- `datasetsApi.ts`
- `dataElementsApi.ts`
- `dataSourcesApi.ts`
- `datasetSnapshotsApi.ts`
- `recordOfProcessingActivitiesApi.ts`
- `dataProtectionImpactAssessmentsApi.ts`
- `dataSubjectRequestAccessesApi.ts`
- `privacyIncidentsApi.ts`
- `kriIndicatorApi.ts`
- `riskMethodologyApi.ts`
- `aiRiskRegisterApi.ts`
- `aiRiskTreatmentApi.ts`
- `userConsentsApi.ts`
- `pdpProcessingRegisterApi.ts`
- `consentScopesApi.ts`
- `consentCoverageApi.ts`
- `aiModelsApi.ts`
- `aiAssetsApi.ts`
- `aiModelArtifactsApi.ts`
- `aiModelCardsApi.ts`
- `aiModelUseCasesApi.ts`
- `aiModelVersionsApi.ts`
- `artifactAccessLogsApi.ts`
- `aiCommitteesApi.ts`
- `committeeMembershipsApi.ts`
- `useCasesApi.ts`
- `projectsApi.ts`
- `modelDatasetLinksApi.ts`
- `datasetSubjectPopulationApi.ts`
- `incidentActionsApi.ts`
- `incidentAlertsApi.ts`
- `incidentNotificationsApi.ts`
- `incidentRootCauseAnalysesApi.ts`
- `correctivePreventiveActionsApi.ts`
- `datasetElementMapApi.ts`
- `usersApi.ts`

### Special Cases (need manual review)
- Files with complex response structures
- Files with unique endpoints
- Files with custom transformations

---

## 📊 Expected Impact

**Before refactoring:**
- ~48 files × ~150 lines avg = ~7,200 lines

**After refactoring:**
- ~48 files × ~90 lines avg + 245 lines helpers = ~4,565 lines
- **Estimated reduction: ~2,635 lines (37% reduction)**

---

## 🚀 Quick Reference: Common Replacements

### List Query
```typescript
// BEFORE
transformResponse: (response: EntityListResponse) => {
  const list = response?.data?.data ?? [];
  const meta = normaliseMeta(response?.data);
  return { data: list, meta };
},
providesTags: (result) =>
  result
    ? [
        ...result.data.map(({ id }) => ({ type: "Entity" as const, id })),
        { type: "Entity" as const, id: "LIST" },
      ]
    : [{ type: "Entity" as const, id: "LIST" }],

// AFTER
transformResponse: transformListResponseWithMeta<Entity>,
providesTags: (result) => createListTags(result, "Entity"),
```

### Single Item Query
```typescript
// BEFORE
transformResponse: (response: EntitySingleResponse) => {
  return (response?.data as Entity) ?? (response as unknown as Entity);
},
providesTags: (result, _error, id) => [{ type: "Entity", id }],

// AFTER
transformResponse: transformSingleItemResponse<Entity>,
providesTags: createItemTags("Entity"),
```

### Create Mutation
```typescript
// BEFORE
invalidatesTags: [{ type: "Entity", id: "LIST" }],

// AFTER
invalidatesTags: createInvalidateListTags("Entity"),
```

### Update/Delete Mutation
```typescript
// BEFORE
invalidatesTags: (result, _error, { id }) => [
  { type: "Entity", id },
  { type: "Entity", id: "LIST" },
],

// AFTER
invalidatesTags: createInvalidateItemAndListTags("Entity"),
```

### Toast Handler
```typescript
// BEFORE
async onQueryStarted(_, { queryFulfilled }) {
  try {
    await queryFulfilled;
    toast.success("Entity created successfully");
  } catch (error) {
    if (!hasValidationErrors(error)) {
      const mutationError = error as MutationError;
      const errorMessage =
        mutationError?.error?.data?.message || "Failed to create entity";
      toast.error(errorMessage);
    }
  }
},

// AFTER
onQueryStarted: createMutationToastHandler(
  "Entity created successfully",
  "Failed to create entity"
),
```

---

## ⚠️ Important Notes

1. **Toast Import**: When using toast handlers, import `toast` in the API file:
   ```typescript
   import { toast } from "react-toastify";
   ```

2. **Additional Tags**: Some APIs have additional tags (e.g., STATISTICS). Keep those manually:
   ```typescript
   invalidatesTags: [
     ...createInvalidateListTags("Entity"),
     { type: "Entity", id: "STATISTICS" },
   ],
   ```

3. **Special Transformations**: Some files have unique response structures. Review those individually.

4. **Type Definitions**: Keep interface/type definitions from interfaces folder - only refactor the API slice code.

---

## ✅ Testing Checklist

After refactoring each file:
- [ ] File compiles without TypeScript errors
- [ ] No linting errors
- [ ] Test the actual API calls in the application
- [ ] Verify pagination works correctly
- [ ] Verify tags are invalidated correctly
- [ ] Verify toast notifications work (if applicable)

