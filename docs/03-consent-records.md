# Consent Records - Frontend Implementation Guide

## Overview
The Consent Records module manages user consent records for data processing activities. It tracks consent lifecycle from obtaining to withdrawal, including consent text, method, jurisdiction, and evidence. This module is essential for GDPR compliance and consent management.

## Base URL
All endpoints are prefixed with: `/api/consent-records`

**Authentication Required:** Yes (Bearer token via `auth:supabase` middleware)

---

## API Endpoints

### 1. List Consent Records
**GET** `/api/consent-records`

Retrieves a paginated list of consent records with optional filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | No | Items per page (1-100, default: 15) |
| `subject_realm` | string | No | Filter by subject realm (enum) |
| `status` | string | No | Filter by status (enum) |
| `lifecycle_stage` | string | No | Filter by lifecycle stage (enum) |
| `language` | string | No | Filter by language (enum) |
| `jurisdiction` | string | No | Filter by jurisdiction (enum) |

#### Response (200 OK)
```json
{
  "error": false,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "consent_code": "CNY-2024-550e8400-e29b-41d4-a716-446655440000",
        "subject_key": "user_12345",
        "subject_realm": "customer",
        "subject_age_group": "adult",
        "purpose": "marketing",
        "record_of_processing_activity_id": 1,
        "status": "granted",
        "lifecycle_stage": "obtained",
        "consent_version": 1,
        "consent_text": "I consent to receive marketing communications...",
        "consent_method": "web_form",
        "effective_from": "2024-01-15T00:00:00Z",
        "effective_to": "2025-01-15T00:00:00Z",
        "obtained_date": "2024-01-15T10:30:00Z",
        "withdrawal_date": null,
        "last_refreshed_date": null,
        "source_system": "crm",
        "evidence_uri": "https://example.com/evidence/consent_123.pdf",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "language": "en",
        "jurisdiction": "EU",
        "data_categories": ["personal_data", "contact_data"],
        "can_withdraw": true,
        "withdrawal_method": "web_form",
        "created_at": "2024-01-15T00:00:00Z",
        "updated_at": "2024-01-15T00:00:00Z"
      }
    ],
    "per_page": 15,
    "total": 30,
    "last_page": 2
  },
  "message": "Consent records retrieved successfully"
}
```

---

### 2. Create Consent Record
**POST** `/api/consent-records`

Creates a new consent record. The `consent_code` is automatically generated in format: `CNY-{YEAR}-{UUID}`.

#### Request Body
```json
{
  "subject_key": "user_12345",
  "subject_realm": "customer",
  "subject_age_group": "adult",
  "purpose": "marketing",
  "record_of_processing_activity_id": 1,
  "status": "granted",
  "lifecycle_stage": "obtained",
  "consent_version": 1,
  "consent_text": "I consent to receive marketing communications via email and SMS.",
  "consent_method": "web_form",
  "effective_from": "2024-01-15",
  "effective_to": "2025-01-15",
  "last_refreshed_date": null,
  "source_system": "crm",
  "evidence_uri": "https://example.com/evidence/consent_123.pdf",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "language": "en",
  "jurisdiction": "EU",
  "data_categories": ["personal_data", "contact_data"],
  "can_withdraw": true,
  "withdrawal_method": "web_form"
}
```

#### Validation Rules
- `subject_key`: Required, string, max 255
- `subject_realm`: Required, enum
- `subject_age_group`: Optional, string, max 50
- `purpose`: Required, enum
- `record_of_processing_activity_id`: Required, integer, must exist in record_of_processing_activities table
- `status`: Required, enum
- `lifecycle_stage`: Required, enum
- `consent_version`: Required, integer, min 1
- `consent_text`: Required, string
- `consent_method`: Required, enum
- `effective_from`: Required, date
- `effective_to`: Optional, date, must be after or equal to `effective_from`
- `last_refreshed_date`: Optional, date
- `source_system`: Required, enum
- `evidence_uri`: Optional, string, valid URL
- `ip_address`: Optional, valid IP address
- `user_agent`: Optional, string
- `language`: Required, enum
- `jurisdiction`: Required, enum
- `data_categories`: Required, array with at least 1 item, each must be valid DataCategory enum
- `can_withdraw`: Required, boolean
- `withdrawal_method`: Required, string, max 255

**Automatic Behavior:**
- If `lifecycle_stage` is `obtained`, `obtained_date` is automatically set to current timestamp
- If `lifecycle_stage` is `withdrawn`, `withdrawal_date` is automatically set to current timestamp

#### Response (201 Created)
```json
{
  "error": false,
  "message": "Consent record created successfully",
  "data": {
    // Full resource object with generated consent_code
  }
}
```

---

### 3. Get Single Consent Record
**GET** `/api/consent-records/{id}`

Retrieves a single consent record by ID.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Consent record retrieved successfully",
  "data": {
    // Full resource object
  }
}
```

---

### 4. Update Consent Record
**POST** `/api/consent-records/{id}`

Updates an existing consent record. All fields are optional.

#### Request Body
Same structure as create, but all fields are optional. Only include fields you want to update.

**Automatic Behavior:**
- If `lifecycle_stage` changes to `obtained`, `obtained_date` is automatically set to current timestamp
- If `lifecycle_stage` changes to `withdrawn`, `withdrawal_date` is automatically set to current timestamp

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Consent record updated successfully",
  "data": {
    // Updated resource object
  }
}
```

---

### 5. Delete Consent Record
**DELETE** `/api/consent-records/{id}`

Deletes a consent record.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Consent record deleted successfully",
  "data": null
}
```

---

## Enums

### Status
- `granted` - Consent granted
- `denied` - Consent denied
- `withdrawn` - Consent withdrawn
- `expired` - Consent expired

### Lifecycle
Check enum file: `app/Enums/ConsentRecord/Lifecycle.php`

### Purpose
Check enum file: `app/Enums/ConsentRecord/Purpose.php`

### Method
Check enum file: `app/Enums/ConsentRecord/Method.php`

### SubjectRealm
Check enum file: `app/Enums/ConsentRecord/SubjectRealm.php`

### SourceSystem
Check enum file: `app/Enums/ConsentRecord/SourceSystem.php`

### Language
Check enum file: `app/Enums/ConsentRecord/Language.php`

### Jurisdiction
Check enum file: `app/Enums/ConsentRecord/Jurisdiction.php`

### DataCategory
(From RecordOfProcessingActivity enum)
Check enum file: `app/Enums/RecordOfProcessingActivity/DataCategory.php`

---

## Frontend Implementation Notes

### 1. Form Components
- **Subject Information:** Input for subject_key, dropdown for subject_realm
- **Processing Activity Link:** Search/select dropdown for `record_of_processing_activity_id`
- **Consent Text Editor:** Rich text editor or textarea for consent text
- **Date Range Picker:** For effective_from and effective_to
- **Data Categories:** Multi-select dropdown
- **Evidence Upload:** File upload component that stores URI
- **IP Address Capture:** Auto-capture from request headers
- **User Agent Capture:** Auto-capture from browser

### 2. Lifecycle Management
Implement lifecycle stage transitions:
- **Obtained:** When consent is first obtained
- **Withdrawn:** When user withdraws consent
- **Expired:** When consent expires (based on effective_to date)

### 3. UI/UX Recommendations
- **Status Badge:** Color-coded status indicators
  - Green: Granted
  - Red: Denied/Withdrawn
  - Yellow: Expired
- **Lifecycle Timeline:** Visual timeline showing consent lifecycle
- **Consent Text Preview:** Expandable preview of consent text
- **Evidence Link:** Clickable link to evidence document
- **Withdrawal Button:** Quick action to withdraw consent
- **Expiry Warning:** Alert when consent is nearing expiry
- **Version History:** Display consent version number

### 4. Consent Capture Flow
For web forms capturing consent:
1. Display consent text clearly
2. Capture IP address and user agent automatically
3. Set effective_from to current date
4. Set lifecycle_stage to "obtained"
5. Store evidence (screenshot, PDF, etc.)
6. Generate consent_code

### 5. Data Display
- **Consent Code:** Display as reference number
- **Subject Information:** Card showing subject details
- **Processing Activity:** Link to related ROPA
- **Effective Period:** Show date range with expiry indicator
- **Evidence:** Link or preview of evidence document
- **Metadata:** Display IP, user agent, source system

### 6. Withdrawal Flow
When user withdraws consent:
1. Update `lifecycle_stage` to "withdrawn"
2. Set `withdrawal_date` automatically
3. Update `status` to "withdrawn"
4. Log withdrawal method
5. Optionally send notification

### 7. Example React Component
```typescript
interface ConsentRecordFormData {
  subject_key: string;
  subject_realm: string;
  purpose: string;
  record_of_processing_activity_id: number;
  status: string;
  lifecycle_stage: string;
  consent_text: string;
  // ... other fields
}

const ConsentRecordForm = () => {
  const [formData, setFormData] = useState<ConsentRecordFormData>({...});
  
  // Auto-capture metadata
  useEffect(() => {
    // Capture IP and user agent
    // This should be done server-side in production
  }, []);
  
  const handleLifecycleChange = (stage: string) => {
    setFormData(prev => ({
      ...prev,
      lifecycle_stage: stage,
      // Obtained/withdrawn dates are set server-side
    }));
  };
  
  return (
    <form>
      <SubjectInformation />
      <ProcessingActivitySelector />
      <ConsentTextEditor />
      <LifecycleStageSelector onChange={handleLifecycleChange} />
      <DataCategoriesSelector />
      <EvidenceUpload />
    </form>
  );
};
```

### 8. Dashboard Widgets
- **Active Consents:** Count of granted consents
- **Withdrawn Consents:** Count of withdrawn consents
- **Expiring Soon:** Consents expiring within 30 days
- **By Purpose:** Consent breakdown by purpose
- **By Jurisdiction:** Consent distribution by jurisdiction
- **Consent Rate:** Percentage of granted vs denied

### 9. Compliance Features
- **Consent Audit Trail:** Track all consent changes
- **Evidence Storage:** Secure storage of consent evidence
- **Withdrawal Tracking:** Track withdrawal requests and processing
- **Expiry Management:** Automated alerts for expiring consents
- **Version Control:** Track consent text versions

---

## Testing Checklist
- [ ] List consent records with all filter options
- [ ] Create consent with lifecycle_stage = obtained (auto-sets obtained_date)
- [ ] Create consent with lifecycle_stage = withdrawn (auto-sets withdrawal_date)
- [ ] Update consent - change lifecycle_stage to obtained
- [ ] Update consent - change lifecycle_stage to withdrawn
- [ ] Validate effective_to >= effective_from
- [ ] Test with linked processing activity
- [ ] Test evidence URI upload
- [ ] Validate data categories enum values
- [ ] Delete consent record
- [ ] Handle validation errors
- [ ] Test IP address and user agent capture
- [ ] Test consent expiry logic

