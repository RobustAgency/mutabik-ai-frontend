# Quick Reference: Shared Utilities

## 🚀 Quick Start

### RTK Query API Files
```typescript
// Import
import { axiosBaseQuery, MutationError, hasValidationErrors } from "@/lib/api/rtkQueryBase";

// Use
export const entityApi = createApi({
  baseQuery: axiosBaseQuery(),
  // ... rest of config
});
```

### Form Validation
```typescript
// Import
import { validateTextField, validateEmail, createValidationErrors } from "@/lib/utils/validation";

// Use
const fieldErrors = {
  name: validateTextField(formData.name, {
    required: true,
    minLength: 5,
    maxLength: 255
  }),
  email: validateEmail(formData.email)
};
const errors = createValidationErrors(fieldErrors);
```

### Delete Confirmation
```typescript
// Import
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";

// Use
const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
  deleteMutation: async (id) => await deleteEntity(id).unwrap(),
  isDeleting,
  entityTypeName: "Entity",
  onSuccess: () => router.push("/entities"),
});

// Render
<Button onClick={() => openDeleteDialog(id, name)}>Delete</Button>
<DeleteConfirmationDialog />
```

### Detail Page Layout
```typescript
// Import
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";

// Use
<EntityDetailsLayout
  title="Entity Details"
  description="View and manage entity"
  loading={isLoading}
  error={error ? "Failed to load" : null}
  onEdit={handleEdit}
  onDelete={handleDelete}
>
  <EntityForm entity={entity} />
</EntityDetailsLayout>
```

---

## 📚 Validation Functions

```typescript
// Text (required, min/max length, pattern)
validateTextField(value, {
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  pattern?: RegExp,
  messages?: { required?, length?, pattern? }
})

// Number (required, min/max, integer, positive)
validateNumericField(value, {
  required?: boolean,
  min?: number,
  max?: number,
  integer?: boolean,
  positive?: boolean,
  messages?: { required?, range?, integer?, positive? }
})

// Email
validateEmail(email, customMessage?)

// Phone
validatePhone(phone, customMessage?)

// URL
validateUrl(url, customMessage?)

// Date (with range)
validateDate(date, {
  min?: string,
  max?: string,
  messages?: { invalid?, min?, max? }
})

// Array (min/max items)
validateArrayField(array, {
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  messages?: { required?, minLength?, maxLength? }
})

// Helpers
createValidationErrors(fieldErrors) // Filters empty arrays
combineValidations(...validations)  // Combines results
```

---

## 🔧 Common Patterns

### Combine Multiple Validations
```typescript
email: [
  ...validateTextField(formData.email, { required: true }),
  ...validateEmail(formData.email)
]
```

### Optional Field Validation
```typescript
// Only validates if value provided
description: validateTextField(formData.description, {
  minLength: 10,
  maxLength: 500
  // No required: true
})
```

### Custom Error Messages
```typescript
name: validateTextField(formData.name, {
  required: true,
  minLength: 5,
  maxLength: 255,
  messages: {
    required: "Please provide a name",
    length: "Name must be 5-255 characters long"
  }
})
```

### Numeric Ranges
```typescript
age: validateNumericField(formData.age, {
  required: true,
  min: 18,
  max: 120,
  integer: true,
  messages: {
    required: "Age is required",
    range: "Age must be between 18-120"
  }
})
```

---

## 📋 Migration Checklist

### RTK Query API File
- [ ] Import `axiosBaseQuery, MutationError, hasValidationErrors`
- [ ] Remove local `axiosBaseQuery` function (40+ lines)
- [ ] Remove local `MutationError` interface
- [ ] Use `baseQuery: axiosBaseQuery()`
- [ ] Update error handling with `hasValidationErrors()`

### Form Component
- [ ] Import validation utilities
- [ ] Replace manual validation functions
- [ ] Use `validateTextField`, `validateNumericField`, etc.
- [ ] Use `createValidationErrors()` to filter
- [ ] Remove old helper functions (isValidEmail, etc.)

### Detail Page
- [ ] Import `EntityDetailsLayout` and `useDeleteConfirmation`
- [ ] Replace manual loading/error rendering
- [ ] Replace Card + header boilerplate
- [ ] Use `useDeleteConfirmation` hook
- [ ] Remove manual delete dialog state
- [ ] Render `<DeleteConfirmationDialog />`

---

## 🎯 Examples

See these completed migrations:
- **API:** `app/lib/features/stakeholdersApi.ts`
- **Form:** `components/app/stakeholders/create/CreateStakeholder.tsx`
- **Detail:** `components/app/dataSources/details/DataSourceDetails.tsx`

---

## 📖 Full Documentation

- **Migration Guide:** `/docs/REFACTORING_GUIDE.md`
- **Summary:** `/docs/REFACTORING_SUMMARY.md`
- **Rules:** `/rules/mutabiq-ai-frontend-rules.md`

