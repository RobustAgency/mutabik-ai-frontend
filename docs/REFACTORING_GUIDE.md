# Code Refactoring & Migration Guide

This guide explains how to migrate existing components to use the new shared utilities and reduce code duplication.

## Overview

We've identified and addressed major code repetition patterns across the codebase:

| Category | Files Affected | Lines Saved | Status |
|----------|---------------|-------------|--------|
| RTK Query Base | 29+ | ~1,200+ | ✅ Complete |
| Validation Utilities | 54+ | ~2,000+ | ✅ Complete |
| Delete Dialogs | 20+ | ~400+ | ✅ Complete |
| Detail Layouts | 20+ | ~600+ | ✅ Complete |

**Total Estimated Savings: ~4,200+ lines of duplicated code**

---

## 1. Migrating API Files (RTK Query)

### What Changed
- Shared `axiosBaseQuery` eliminates 40+ lines per file
- Shared types: `MutationError`, `PaginationMeta`
- Helper functions: `hasValidationErrors`, `extractErrorMessage`

### Migration Steps

**Before:**
```typescript
import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// 40+ lines of duplicated axiosBaseQuery code...
const axiosBaseQuery = (): BaseQueryFn<...> => async ({ url, method, data, params }) => {
  try {
    const result = await apiClient({ url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    // ... error handling ...
  }
};

// Duplicated MutationError interface
interface MutationError {
  error?: {
    status: number;
    data?: { message?: string; errors?: Record<string, string[]>; };
  };
}

export const entityApi = createApi({
  baseQuery: axiosBaseQuery(),
  // ...
});
```

**After:**
```typescript
import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { 
  axiosBaseQuery, 
  MutationError, 
  hasValidationErrors 
} from "@/lib/api/rtkQueryBase";

export const entityApi = createApi({
  baseQuery: axiosBaseQuery(),
  // ...
});
```

### Update Error Handling

**Before:**
```typescript
async onQueryStarted(_, { queryFulfilled }) {
  try {
    await queryFulfilled;
    toast.success("Entity created successfully");
  } catch (error) {
    const mutationError = error as MutationError;
    if (!mutationError?.error?.data?.errors) {
      const errorMessage = mutationError?.error?.data?.message || "Failed";
      toast.error(errorMessage);
    }
  }
}
```

**After:**
```typescript
async onQueryStarted(_, { queryFulfilled }) {
  try {
    await queryFulfilled;
    toast.success("Entity created successfully");
  } catch (error) {
    if (!hasValidationErrors(error)) {
      const mutationError = error as MutationError;
      const errorMessage = mutationError?.error?.data?.message || "Failed";
      toast.error(errorMessage);
    }
  }
}
```

### Files to Update
Update all 29 API files in `app/lib/features/*Api.ts`:
- stakeholdersApi.ts ✅ (Example completed)
- vendorsApi.ts
- useCasesApi.ts
- datasetsApi.ts
- dataSourcesApi.ts
- dataElementsApi.ts
- (and 23 more...)

---

## 2. Migrating Form Validation

### What Changed
- Reusable validation functions
- Consistent error messages
- Type-safe validation rules

### Migration Steps

**Before (Manual Validation):**
```typescript
const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (): boolean => {
  const errors: Record<string, string[]> = {};
  
  if (!formData.name?.trim()) {
    errors.name = ["Name is required"];
  } else if (formData.name.trim().length < 5 || formData.name.trim().length > 255) {
    errors.name = ["Name must be between 5-255 characters"];
  }
  
  if (!formData.email?.trim()) {
    errors.email = ["Email is required"];
  } else if (!isValidEmail(formData.email)) {
    errors.email = ["Please enter a valid email address"];
  }
  
  if (!formData.tags || formData.tags.length === 0) {
    errors.tags = ["At least one tag is required"];
  }
  
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

**After (Using Utilities):**
```typescript
import {
  validateTextField,
  validateEmail,
  validateArrayField,
  createValidationErrors,
} from "@/lib/utils/validation";

const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

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
      messages: { required: "At least one tag is required" }
    })
  };
  
  const errors = createValidationErrors(fieldErrors);
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### Available Validation Functions

```typescript
// Text validation
validateTextField(value, {
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  pattern?: RegExp,
  messages?: { ... }
})

// Numeric validation
validateNumericField(value, {
  required?: boolean,
  min?: number,
  max?: number,
  integer?: boolean,
  positive?: boolean,
  messages?: { ... }
})

// Email validation
validateEmail(email, customMessage?)

// Phone validation
validatePhone(phone, customMessage?)

// URL validation
validateUrl(url, customMessage?)

// Date validation
validateDate(date, { min?, max?, messages? })

// Array validation
validateArrayField(array, {
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  messages?: { ... }
})

// Helper functions
createValidationErrors(fieldErrors) // Filters out empty error arrays
combineValidations(...validations)  // Combines multiple validation results
```

### Files to Update
Update all 54+ form components with validation:
- CreateStakeholder.tsx ✅ (Example completed)
- CreateVendor.tsx
- CreateUseCases.tsx
- CreateDataset.tsx
- (and 50 more...)

---

## 3. Migrating Detail Pages

### What Changed
- `EntityDetailsLayout` component eliminates layout boilerplate
- `useDeleteConfirmation` hook simplifies delete dialogs

### Migration Steps

**Before (Manual Layout):**
```typescript
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetEntityQuery, useDeleteEntityMutation } from "@/app/lib/features/entityApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import EntityFormReadOnly from "./EntityFormReadOnly";

const EntityDetails: React.FC<{ entityId: string }> = ({ entityId }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: entity, isLoading, error } = useGetEntityQuery(entityId);
  const [deleteEntity, { isLoading: isDeleting }] = useDeleteEntityMutation();
  
  const handleDelete = async () => {
    try {
      await deleteEntity(entityId).unwrap();
      router.push("/entities");
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };
  
  const handleEdit = () => {
    router.push(`/entities/${entityId}/edit`);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !entity) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load entity</p>
            <Button onClick={() => router.push("/entities")}>
              Back to Entities
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
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
              <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">
                Edit
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">
                Delete
              </Button>
            </div>
          </div>
          
          <CardContent className="space-y-6">
            <EntityFormReadOnly entity={entity} />
          </CardContent>
        </Card>
      </div>
      
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Entity"
        description={`Are you sure you want to delete "${entity.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default EntityDetails;
```

**After (Using Utilities):**
```typescript
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetEntityQuery, useDeleteEntityMutation } from "@/app/lib/features/entityApi";
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import EntityFormReadOnly from "./EntityFormReadOnly";

const EntityDetails: React.FC<{ entityId: string }> = ({ entityId }) => {
  const router = useRouter();
  
  const { data: entity, isLoading, error } = useGetEntityQuery(entityId);
  const [deleteEntity, { isLoading: isDeleting }] = useDeleteEntityMutation();
  
  // Use delete confirmation hook
  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteEntity(id).unwrap();
    },
    isDeleting,
    entityTypeName: "Entity",
    onSuccess: () => router.push("/entities"),
  });
  
  const handleEdit = () => {
    router.push(`/entities/${entityId}/edit`);
  };
  
  const handleDelete = () => {
    if (entity) {
      openDeleteDialog(entityId, entity.name);
    }
  };
  
  return (
    <>
      <EntityDetailsLayout
        title="Entity Details"
        description="View and manage entity information"
        loading={isLoading}
        error={error ? "Failed to load entity details" : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      >
        {entity && <EntityFormReadOnly entity={entity} />}
      </EntityDetailsLayout>
      
      <DeleteConfirmationDialog />
    </>
  );
};

export default EntityDetails;
```

### Files to Update
Update all 20+ detail components:
- DataSourceDetails.tsx ✅ (Example completed)
- DatasetDetails.tsx
- DataElementDetails.tsx
- StakeholderDetails.tsx
- VendorDetails.tsx
- (and 15 more...)

---

## 4. Migration Priority

### Phase 1: High Priority (Week 1-2)
1. **RTK Query API files** (29 files)
   - High impact: ~1,200 lines saved
   - Low risk: Simple import changes
   - Start with: stakeholdersApi.ts, vendorsApi.ts, useCasesApi.ts

### Phase 2: High Priority (Week 3-4)
2. **Form Validation** (54+ files)
   - High impact: ~2,000 lines saved
   - Medium risk: Logic changes require testing
   - Start with: CreateStakeholder.tsx, CreateVendor.tsx, CreateDataset.tsx

### Phase 3: Medium Priority (Week 5)
3. **Detail Pages** (20+ files)
   - Medium impact: ~1,000 lines saved
   - Low risk: Layout changes with same functionality
   - Start with: DataSourceDetails.tsx, DatasetDetails.tsx, DataElementDetails.tsx

### Phase 4: Ongoing
4. **New Components**
   - Use new utilities for all new components
   - Reference examples in this guide

---

## 5. Testing Strategy

### After Migrating API Files
1. Test all CRUD operations
2. Verify error handling still works
3. Check validation error display
4. Verify toast notifications

### After Migrating Forms
1. Test all validation scenarios
2. Verify error messages display correctly
3. Test form submission with valid data
4. Test form submission with invalid data
5. Verify server-side validation handling

### After Migrating Detail Pages
1. Test loading states
2. Test error states
3. Test edit navigation
4. Test delete dialog and confirmation
5. Verify post-delete navigation

---

## 6. Common Pitfalls

### API Files
❌ **Don't:** Keep old imports
```typescript
import { AxiosRequestConfig, AxiosError } from "axios";
import { apiClient } from "@/lib/api";
```

✅ **Do:** Use shared imports
```typescript
import { axiosBaseQuery, MutationError, hasValidationErrors } from "@/lib/api/rtkQueryBase";
```

### Validation
❌ **Don't:** Mix manual and utility validation
```typescript
const errors: Record<string, string[]> = {};
if (!formData.name) errors.name = ["Required"];
const emailErrors = validateEmail(formData.email); // Mixed approach
```

✅ **Do:** Use utilities consistently
```typescript
const fieldErrors: Record<string, string[]> = {
  name: validateTextField(formData.name, { required: true }),
  email: validateEmail(formData.email)
};
```

### Detail Pages
❌ **Don't:** Partially migrate (mixing old and new)
```typescript
<EntityDetailsLayout ...>
  {/* Old manual ConfirmationDialog */}
  <ConfirmationDialog isOpen={showDialog} ... />
</EntityDetailsLayout>
```

✅ **Do:** Fully migrate to new hooks
```typescript
const { DeleteConfirmationDialog } = useDeleteConfirmation({...});
<EntityDetailsLayout ...>
  {children}
</EntityDetailsLayout>
<DeleteConfirmationDialog />
```

---

## 7. Benefits Summary

### Code Quality
- ✅ Eliminates 4,200+ lines of duplicated code
- ✅ Consistent patterns across the app
- ✅ Type-safe utilities with clear interfaces
- ✅ Easier to test in isolation

### Developer Experience
- ✅ Faster to implement new features
- ✅ Less boilerplate to write
- ✅ Easier to understand codebase
- ✅ Reduced cognitive load

### Maintenance
- ✅ Single source of truth for validation
- ✅ Easier to update patterns globally
- ✅ Fewer bugs from inconsistency
- ✅ Better error handling

---

## 8. Need Help?

- Check `/rules/mutabiq-ai-frontend-rules.md` for detailed rules
- Review completed examples:
  - `app/lib/features/stakeholdersApi.ts` (RTK Query)
  - `components/app/stakeholders/create/CreateStakeholder.tsx` (Validation)
  - `components/app/dataSources/details/DataSourceDetails.tsx` (Detail Page)
- Check utility files for JSDoc comments and examples

---

## 9. Future Improvements

Consider these for future refactoring:
- Toast notification utilities
- Form submission handlers hook
- Table wrapper component enhancements
- Shared filter state management

