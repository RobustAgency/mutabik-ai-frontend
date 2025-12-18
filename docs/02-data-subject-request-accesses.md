# Data Subject Request Accesses - Frontend Implementation Guide

## Overview
The Data Subject Request Access (DSAR) module manages requests from data subjects to access, rectify, erase, or port their personal data in compliance with GDPR Article 15-20. This module tracks the entire lifecycle of DSAR requests from submission to completion.

## Base URL
All endpoints are prefixed with: `/api/data-subject-request-accesses`

**Authentication Required:** Yes (Bearer token via `auth:supabase` middleware)

---

## API Endpoints

### 1. List Data Subject Request Accesses
**GET** `/api/data-subject-request-accesses`

Retrieves a paginated list of DSAR requests with optional filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | No | Items per page (1-100, default: 15) |
| `status` | string | No | Filter by status (enum) |
| `request_type` | string | No | Filter by request type (enum) |
| `verification_status` | string | No | Filter by verification status (enum) |
| `jurisdiction` | string | No | Filter by jurisdiction (enum) |
| `subject_realm` | string | No | Filter by subject realm (enum) |
| `priority` | string | No | Filter by priority (enum) |

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Data Subject Requests retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "request_code": "DSAR-2024-550e8400-e29b-41d4-a716-446655440000",
        "request_type": "access",
        "subject_identifier": "user@example.com",
        "subject_key": "user_12345",
        "subject_name": "John Doe",
        "subject_realm": "customer",
        "verification_status": "verified",
        "verification_method": "email",
        "verification_date": "2024-01-15T10:30:00Z",
        "verified_by": 1,
        "request_details": "I would like to access all my personal data",
        "requested_data_categories": ["personal_data", "contact_data"],
        "request_source": "web_form",
        "submitted_date": "2024-01-15T00:00:00Z",
        "due_date": "2024-02-14T00:00:00Z",
        "extended_due_date": null,
        "response_date": null,
        "completed_date": null,
        "status": "in_progress",
        "priority": "high",
        "is_overdue": false,
        "assigned_to": 2,
        "assigned_date": "2024-01-15T00:00:00Z",
        "response_method": null,
        "response_format": null,
        "response_uri": null,
        "response_notes": null,
        "rejection_reason": null,
        "jurisdiction": "EU",
        "processing_activity_ids": [1, 2],
        "systems_checked": "CRM, Billing, Support",
        "records_found": 150,
        "remaining_days": 30,
        "created_at": "2024-01-15T00:00:00Z",
        "updated_at": "2024-01-15T00:00:00Z"
      }
    ],
    "per_page": 15,
    "total": 25,
    "last_page": 2
  }
}
```

---

### 2. Create Data Subject Request Access
**POST** `/api/data-subject-request-accesses`

Creates a new DSAR request. The `request_code` is automatically generated in format: `DSAR-{YEAR}-{UUID}`.

#### Request Body
```json
{
  "request_type": "access",
  "subject_identifier": "user@example.com",
  "subject_name": "John Doe",
  "subject_realm": "customer",
  "verification_status": "verified",
  "subject_key": "user_12345",
  "verification_method": "email",
  "verified_by": 1,
  "request_details": "I would like to access all my personal data",
  "requested_data_categories": ["personal_data", "contact_data"],
  "request_source": "web_form",
  "submitted_date": "2024-01-15",
  "due_date": "2024-02-14",
  "extended_due_date": null,
  "status": "in_progress",
  "response_date": null,
  "completed_date": null,
  "priority": "high",
  "is_overdue": false,
  "assigned_to": 2,
  "assigned_date": "2024-01-15",
  "response_method": null,
  "response_format": null,
  "response_uri": null,
  "response_notes": null,
  "rejection_reason": null,
  "jurisdiction": "EU",
  "processing_activity_ids": [1, 2],
  "systems_checked": "CRM, Billing, Support",
  "records_found": null
}
```

#### Validation Rules

**Conditional Validation:**
- If `verification_status` is `verified`:
  - `subject_key`: Required
  - `verification_method`: Required
  - `verified_by`: Required (must exist in users table)
  
- If `status` is `completed`:
  - `response_date`: Required
  - `completed_date`: Required, must be after or equal to `response_date`
  
- If `status` is `ready_for_response`:
  - `response_method`: Required
  - `response_format`: Required
  - `response_uri`: Required (valid URL)
  
- If `status` is `rejected`:
  - `jurisdiction`: Required

**Standard Rules:**
- `request_type`: Required, enum
- `subject_identifier`: Required, string, max 255
- `subject_name`: Optional, string, max 255
- `subject_realm`: Required, enum
- `verification_status`: Required, enum
- `request_details`: Required, string
- `requested_data_categories`: Optional, array of strings
- `request_source`: Required, enum
- `submitted_date`: Required, date
- `due_date`: Required, date, must be after or equal to `submitted_date`
- `extended_due_date`: Optional, date, must be after `due_date`
- `status`: Required, enum
- `priority`: Required, enum
- `is_overdue`: Required, boolean
- `assigned_to`: Required, integer, must exist in users table
- `assigned_date`: Required, date
- `response_notes`: Optional, string
- `rejection_reason`: Optional, string
- `processing_activity_ids`: Optional, array of integers, must exist in record_of_processing_activities table
- `systems_checked`: Required, string, max 255
- `records_found`: Optional, integer

**Note:** If `verification_status` is set to `verified` on create, `verification_date` is automatically set to current timestamp.

#### Response (201 Created)
```json
{
  "error": false,
  "message": "Data Subject Request Access created successfully",
  "data": {
    // Full resource object with generated request_code
  }
}
```

---

### 3. Get Single Data Subject Request Access
**GET** `/api/data-subject-request-accesses/{id}`

Retrieves a single DSAR request by ID.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Data Subject Request Access retrieved successfully",
  "data": {
    // Full resource object
  }
}
```

---

### 4. Update Data Subject Request Access
**POST** `/api/data-subject-request-accesses/{id}`

Updates an existing DSAR request. All fields are optional.

#### Request Body
Same structure as create, but all fields are optional. Only include fields you want to update.

**Note:** If `verification_status` changes to `verified`, `verification_date` is automatically set to current timestamp.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Data Subject Request Access updated successfully",
  "data": {
    // Updated resource object
  }
}
```

---

### 5. Delete Data Subject Request Access
**DELETE** `/api/data-subject-request-accesses/{id}`

Deletes a DSAR request.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Data Subject Request Access deleted successfully"
}
```

---

## Enums

### Status
- `new` - New request
- `pending_verification` - Pending verification
- `in_progress` - In progress
- `pending_approval` - Pending approval
- `ready_for_response` - Ready for response
- `completed` - Completed
- `rejected` - Rejected
- `cancelled` - Cancelled

### RequestType
Check enum file: `app/Enums/DataSubjectRequestAccess/RequestType.php`

### VerificationStatus
Check enum file: `app/Enums/DataSubjectRequestAccess/VerificationStatus.php`

### VerificationMethod
Check enum file: `app/Enums/DataSubjectRequestAccess/VerificationMethod.php`

### SubjectRealm
Check enum file: `app/Enums/DataSubjectRequestAccess/SubjectRealm.php`

### RequestSource
Check enum file: `app/Enums/DataSubjectRequestAccess/RequestSource.php`

### Priority
Check enum file: `app/Enums/DataSubjectRequestAccess/Priority.php`

### ResponseMethod
Check enum file: `app/Enums/DataSubjectRequestAccess/ResponseMethod.php`

### ResponseFormat
Check enum file: `app/Enums/DataSubjectRequestAccess/ResponseFormat.php`

### Jurisdiction
Check enum file: `app/Enums/DataSubjectRequestAccess/Jurisdiction.php`

---

## Frontend Implementation Notes

### 1. Form Components
- **Request Type Selector:** Radio buttons or dropdown for request types
- **Subject Information:** Form fields for identifier, name, realm
- **Verification Section:** Conditional display based on verification status
  - Show verification fields only when status is "verified"
- **Status Workflow:** Implement status-based form sections
  - Different fields required based on current status
- **Date Pickers:** For all date fields with proper validation
- **User Selector:** Autocomplete/search for `assigned_to` and `verified_by`
- **Processing Activities:** Multi-select for linked processing activities

### 2. Conditional Logic
Implement dynamic form validation based on:
- **Verification Status:** Show/hide verification fields
- **Request Status:** Show/hide response fields
  - `ready_for_response`: Show response method, format, URI
  - `completed`: Show response date, completed date
  - `rejected`: Show rejection reason, jurisdiction

### 3. UI/UX Recommendations
- **Status Badge:** Color-coded status indicators
- **Priority Indicator:** Visual priority badges (high/medium/low)
- **Due Date Alert:** Highlight overdue requests (use `is_overdue` and `remaining_days`)
- **Timeline View:** Show request lifecycle timeline
- **Workflow Steps:** Visual workflow showing current stage
- **Quick Actions:** 
  - "Mark as Verified" button
  - "Ready for Response" button
  - "Complete Request" button

### 4. Data Display
- **Request Code:** Display prominently as reference number
- **Remaining Days:** Show countdown to due date
- **Overdue Indicator:** Red badge/alert for overdue requests
- **Subject Information:** Card showing subject details
- **Processing Activities:** Links to related ROPA records
- **Response Information:** Collapsible section for response details

### 5. Status Workflow UI
```
New → Pending Verification → In Progress → Ready for Response → Completed
                                    ↓
                              Pending Approval
                                    ↓
                              Rejected/Cancelled
```

### 6. Error Handling
- Handle conditional validation errors
- Show field-specific error messages
- Validate date relationships (due_date >= submitted_date)
- Handle verification status changes

### 7. Example React Component Structure
```typescript
interface DSARFormData {
  request_type: string;
  subject_identifier: string;
  subject_name?: string;
  subject_realm: string;
  verification_status: string;
  // ... other fields
}

const DSARForm = () => {
  const [formData, setFormData] = useState<DSARFormData>({...});
  const [status, setStatus] = useState('new');
  
  // Conditional field rendering
  const showVerificationFields = formData.verification_status === 'verified';
  const showResponseFields = status === 'ready_for_response';
  const showCompletionFields = status === 'completed';
  
  return (
    <form>
      {/* Basic Information */}
      <RequestTypeSelector />
      <SubjectInformation />
      
      {/* Conditional: Verification */}
      {showVerificationFields && <VerificationSection />}
      
      {/* Conditional: Response */}
      {showResponseFields && <ResponseSection />}
      
      {/* Conditional: Completion */}
      {showCompletionFields && <CompletionSection />}
    </form>
  );
};
```

### 8. Dashboard Widgets
- **Pending Verification:** Count of requests pending verification
- **Overdue Requests:** List of overdue requests
- **Due This Week:** Requests due within 7 days
- **By Status:** Status distribution chart
- **By Request Type:** Request type breakdown

---

## Testing Checklist
- [ ] List requests with all filter options
- [ ] Create request with verification status = verified
- [ ] Create request with status = completed (requires response_date, completed_date)
- [ ] Create request with status = ready_for_response (requires response fields)
- [ ] Create request with status = rejected (requires jurisdiction)
- [ ] Update request - change verification status to verified
- [ ] Update request - change status to completed
- [ ] Validate date relationships (due_date >= submitted_date)
- [ ] Test overdue calculation (is_overdue, remaining_days)
- [ ] Delete request
- [ ] Handle validation errors for conditional fields
- [ ] Test with linked processing activities

