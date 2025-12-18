# Record of Processing Activities - Frontend Implementation Guide

## Overview
The Record of Processing Activities (ROPA) module allows users to create, manage, and track data processing activities in compliance with GDPR and other privacy regulations. This module tracks how personal data is processed, including purposes, legal basis, retention periods, and security measures.

## Base URL
All endpoints are prefixed with: `/api/record-of-processing-activities`

**Authentication Required:** Yes (Bearer token via `auth:supabase` middleware)

---

## API Endpoints

### 1. List Processing Activities
**GET** `/api/record-of-processing-activities`

Retrieves a paginated list of processing activities with optional filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | No | Items per page (1-100, default: 15) |
| `status` | string | No | Filter by status |
| `owner_team` | string | No | Filter by owner team |
| `from` | date | No | Filter by creation date from (ISO 8601) |
| `to` | date | No | Filter by creation date to (ISO 8601) |

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Processing activities retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "activity_code": "ROPA-2024-001",
        "activity_name": "Customer Data Processing",
        "purpose": "Customer relationship management",
        "detailed_purpose": null,
        "owner_team": "customer_service",
        "controller_role": "data_controller",
        "data_subject_categories": ["customer", "employee"],
        "data_categories": ["personal_data", "contact_data"],
        "contains_pii": true,
        "consent_required": true,
        "lawful_basis": "consent",
        "legitimate_interest_assessment": null,
        "consent_coverage_percent": 85,
        "dpia_required": false,
        "dpia_status": null,
        "dpia_id": null,
        "retention_period": "7 years",
        "retention_justification": "Legal requirement for financial records",
        "has_international_transfers": true,
        "applicable_jurisdictions": ["EU", "UK"],
        "security_measures": "Encryption at rest and in transit",
        "internal_recipients": ["HR", "Finance"],
        "external_recipients": ["Cloud Provider"],
        "status": "active",
        "last_reviewed_date": "2024-01-15T00:00:00Z",
        "next_review_date": "2025-01-15T00:00:00Z",
        "created_by": 1,
        "updated_by": 1,
        "version": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "per_page": 15,
    "total": 50,
    "last_page": 4
  }
}
```

---

### 2. Create Processing Activity
**POST** `/api/record-of-processing-activities`

Creates a new processing activity record.

#### Request Body
```json
{
  "activity_code": "ROPA-2024-001",
  "activity_name": "Customer Data Processing",
  "purpose": "Customer relationship management",
  "detailed_purpose": "Detailed description of processing purpose",
  "owner_team": "customer_service",
  "controller_role": "data_controller",
  "data_subject_categories": ["customer", "employee"],
  "data_categories": ["personal_data", "contact_data"],
  "contains_pii": true,
  "consent_required": true,
  "lawful_basis": "consent",
  "legitimate_interest_assessment": null,
  "consent_coverage_percent": 85,
  "dpia_required": false,
  "dpia_status": null,
  "dpia_id": null,
  "retention_period": "7 years",
  "retention_justification": "Legal requirement for financial records",
  "has_international_transfers": true,
  "applicable_jurisdictions": ["EU", "UK"],
  "linked_dataset_ids": [1, 2],
  "linked_ai_models_ids": [5],
  "security_measures": "Encryption at rest and in transit",
  "internal_recipients": ["HR", "Finance"],
  "external_recipients": ["Cloud Provider"],
  "status": "active",
  "last_reviewed_date": "2024-01-15",
  "next_review_date": "2025-01-15"
}
```

#### Validation Rules
- `activity_code`: Required, string, max 255, must be unique
- `activity_name`: Required, string, max 255
- `purpose`: Required, string
- `detailed_purpose`: Optional, string
- `owner_team`: Required, must be valid enum value (see Enums section)
- `controller_role`: Required, must be valid enum value
- `data_subject_categories`: Required, array with at least 1 item, each must be valid enum
- `data_categories`: Required, array with at least 1 item, each must be valid enum
- `contains_pii`: Optional, boolean
- `consent_required`: Optional, boolean
- `lawful_basis`: Required, must be valid enum value
- `legitimate_interest_assessment`: Optional, string
- `consent_coverage_percent`: Optional, integer, 0-100
- `dpia_required`: Optional, boolean
- `dpia_status`: Optional, must be valid enum value
- `dpia_id`: Optional, integer
- `retention_period`: Required, string, max 255
- `retention_justification`: Required, string
- `has_international_transfers`: Optional, boolean
- `applicable_jurisdictions`: Required, array with at least 1 item, each must be valid enum
- `linked_dataset_ids`: Optional, array of integers, must exist in datasets table
- `linked_ai_models_ids`: Optional, array of integers, must exist in ai_models table
- `security_measures`: Required, string
- `internal_recipients`: Optional, array of strings, max 255 each
- `external_recipients`: Optional, array of strings, max 255 each
- `status`: Required, must be valid enum value
- `last_reviewed_date`: Optional, date (ISO 8601)
- `next_review_date`: Optional, date (ISO 8601)

#### Response (201 Created)
```json
{
  "error": false,
  "message": "Processing activity created successfully",
  "data": {
    "id": 1,
    "activity_code": "ROPA-2024-001",
    "activity_name": "Customer Data Processing",
    // ... full resource object
  }
}
```

---

### 3. Get Single Processing Activity
**GET** `/api/record-of-processing-activities/{id}`

Retrieves a single processing activity by ID.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Processing activity retrieved successfully",
  "data": {
    // Full resource object (same structure as list item)
  }
}
```

---

### 4. Update Processing Activity
**POST** `/api/record-of-processing-activities/{id}`

Updates an existing processing activity. All fields are optional (use `sometimes` validation).

#### Request Body
Same structure as create, but all fields are optional. Only include fields you want to update.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Processing activity updated successfully",
  "data": {
    // Updated resource object
  }
}
```

**Note:** The version field is automatically incremented on update.

---

### 5. Delete Processing Activity
**DELETE** `/api/record-of-processing-activities/{id}`

Deletes a processing activity.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Processing activity deleted successfully",
  "data": null
}
```

---

## Enums

### Status
- `draft` - Draft status
- `active` - Active processing
- `under_review` - Under review
- `archived` - Archived

### OwnerTeam
Check enum file: `app/Enums/RecordOfProcessingActivity/OwnerTeam.php`

### ControllerRole
Check enum file: `app/Enums/RecordOfProcessingActivity/ControllerRole.php`

### LawfulBasis
Check enum file: `app/Enums/RecordOfProcessingActivity/LawfulBasis.php`

### DataSubjectCategory
Check enum file: `app/Enums/RecordOfProcessingActivity/DataSubjectCategory.php`

### DataCategory
Check enum file: `app/Enums/RecordOfProcessingActivity/DataCategory.php`

### DPIAStatus
Check enum file: `app/Enums/RecordOfProcessingActivity/DPIAStatus.php`

### ApplicableJurisdiction
Check enum file: `app/Enums/RecordOfProcessingActivity/ApplicableJurisdiction.php`

---

## Frontend Implementation Notes

### 1. Form Components
- Use multi-select dropdowns for `data_subject_categories` and `data_categories`
- Implement date pickers for `last_reviewed_date` and `next_review_date`
- Use checkbox groups for boolean fields
- Implement autocomplete/search for `linked_dataset_ids` and `linked_ai_models_ids`

### 2. Validation
- Client-side validation should mirror server-side rules
- Show real-time validation feedback
- Validate enum values before submission
- Ensure array fields have minimum required items

### 3. UI/UX Recommendations
- Display status badges with color coding
- Show version number prominently for tracking changes
- Implement review date reminders/alerts
- Use tabs or sections to organize the long form:
  - Basic Information
  - Data Categories & Subjects
  - Legal Basis & Consent
  - DPIA Information
  - Retention & Security
  - Linked Resources
  - Review Schedule

### 4. Data Display
- Format dates in user-friendly format (e.g., "Jan 15, 2024")
- Display arrays as tags or chips
- Show linked datasets and AI models as clickable links
- Display jurisdiction flags/icons

### 5. Error Handling
- Handle validation errors (422 status)
- Display field-specific error messages
- Show network errors gracefully
- Implement retry logic for failed requests

### 6. State Management
- Cache list results for better performance
- Implement optimistic updates for better UX
- Track form dirty state to prevent accidental navigation

### 7. Example React Hook
```typescript
const useRecordOfProcessingActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/record-of-processing-activities?${params}`);
      const data = await response.json();
      setActivities(data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData) => {
    const response = await fetch('/api/record-of-processing-activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData),
    });
    return response.json();
  };

  return { activities, loading, error, fetchActivities, createActivity };
};
```

---

## Testing Checklist
- [ ] List activities with pagination
- [ ] Filter by status, owner_team, date range
- [ ] Create new activity with all required fields
- [ ] Validate enum values
- [ ] Update activity (partial update)
- [ ] Delete activity
- [ ] Handle validation errors
- [ ] Handle network errors
- [ ] Test with linked datasets and AI models
- [ ] Verify version increment on update

