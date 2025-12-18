# Privacy Incidents - Frontend Implementation Guide

## Overview
The Privacy Incidents module manages privacy and data breach incidents in compliance with GDPR Article 33-34. It tracks incident detection, investigation, notification requirements, and resolution. This module is critical for breach notification compliance and incident management.

## Base URL
All endpoints are prefixed with: `/api/privacy-incidents`

**Authentication Required:** Yes (Bearer token via `auth:supabase` middleware)

---

## API Endpoints

### 1. List Privacy Incidents
**GET** `/api/privacy-incidents`

Retrieves a paginated list of privacy incidents with optional filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | No | Items per page (1-100, default: 15) |
| `incident_type` | string | No | Filter by incident type (enum) |
| `risk_level` | string | No | Filter by risk level (enum) |
| `status` | string | No | Filter by status (enum) |
| `is_breach` | boolean | No | Filter by breach status |

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Privacy incidents retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "organization_id": 1,
        "incident_code": "INC-2024-550e8400-e29b-41d4-a716-446655440000",
        "incident_title": "Unauthorized Access to Customer Database",
        "incident_type": "unauthorized_access",
        "risk_level": "high",
        "is_breach": true,
        "breach_criteria_met": ["confidentiality", "availability"],
        "detected_date": "2024-01-15T10:30:00Z",
        "occurred_date": "2024-01-14T08:00:00Z",
        "notification_deadline": "2024-01-18T10:30:00Z",
        "hours_to_deadline": 48,
        "is_deadline_passed": false,
        "incident_description": "Unauthorized access to customer database detected...",
        "what_happened": "An external attacker gained access to the customer database...",
        "how_discovered": "Detected through automated security monitoring...",
        "data_compromised": "Customer names, emails, and phone numbers",
        "data_categories_affected": ["personal_data", "contact_data"],
        "estimated_affected_subjects": 5000,
        "affected_subject_keys": ["user_123", "user_456"],
        "notification_required": "yes",
        "notification_status": "pending",
        "authority_notified": false,
        "authority_notification_date": null,
        "supervisory_authority": null,
        "authority_reference_number": null,
        "authority_response": null,
        "subjects_notified": false,
        "subject_notification_date": null,
        "notification_method": null,
        "notification_template_used": null,
        "immediate_actions": "System access revoked, passwords reset, security audit initiated",
        "mitigation_measures": "Enhanced encryption, additional access controls implemented",
        "preventive_measures": "Regular security audits, employee training, improved monitoring",
        "root_cause_analysis": null,
        "responsible_party": "Third-party vendor",
        "lessons_learned": null,
        "status": "under_investigation",
        "resolution_date": null,
        "days_to_resolution": null,
        "processing_activity_ids": [1, 2],
        "affected_systems": ["CRM", "Billing"],
        "third_party_involved": true,
        "vendor_id": 3,
        "evidence_uris": ["https://example.com/evidence/incident_123.pdf"],
        "created_by": 1,
        "updated_by": 1,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "per_page": 15,
    "total": 20,
    "last_page": 2
  }
}
```

---

### 2. Create Privacy Incident
**POST** `/api/privacy-incidents`

Creates a new privacy incident. The `incident_code` is automatically generated in format: `INC-{YEAR}-{UUID}`.

#### Request Body
```json
{
  "incident_title": "Unauthorized Access to Customer Database",
  "incident_type": "unauthorized_access",
  "risk_level": "high",
  "is_breach": true,
  "breach_criteria_met": ["confidentiality", "availability"],
  "detected_date": "2024-01-15T10:30:00Z",
  "occurred_date": "2024-01-14T08:00:00Z",
  "hours_to_deadline": null,
  "is_deadline_passed": false,
  "incident_description": "Unauthorized access to customer database detected through security monitoring.",
  "what_happened": "An external attacker gained access to the customer database through a compromised API key.",
  "how_discovered": "Detected through automated security monitoring and anomaly detection.",
  "data_compromised": "Customer names, emails, phone numbers, and purchase history.",
  "data_categories_affected": ["personal_data", "contact_data", "transactional_data"],
  "estimated_affected_subjects": 5000,
  "affected_subject_keys": ["user_123", "user_456"],
  "notification_required": "yes",
  "notification_status": "pending",
  "authority_notified": false,
  "authority_notification_date": null,
  "supervisory_authority": null,
  "authority_reference_number": null,
  "authority_response": null,
  "subjects_notified": false,
  "subject_notification_date": null,
  "notification_method": null,
  "notification_template_used": null,
  "immediate_actions": "System access revoked, passwords reset, security audit initiated.",
  "mitigation_measures": "Enhanced encryption, additional access controls implemented, security patches applied.",
  "preventive_measures": "Regular security audits scheduled, employee training on security best practices, improved monitoring systems.",
  "root_cause_analysis": null,
  "responsible_party": "Third-party vendor",
  "lessons_learned": null,
  "status": "under_investigation",
  "resolution_date": null,
  "processing_activity_ids": [1, 2],
  "affected_systems": ["CRM", "Billing"],
  "third_party_involved": true,
  "vendor_id": 3,
  "evidence_uris": ["https://example.com/evidence/incident_123.pdf"]
}
```

#### Validation Rules

**Conditional Validation:**
- If `is_breach` is `true`:
  - `breach_criteria_met`: Required, array with at least 1 item
  
- If `authority_notified` is `true`:
  - `authority_notification_date`: Required
  - `supervisory_authority`: Required
  
- If `subjects_notified` is `true`:
  - `subject_notification_date`: Required
  - `notification_method`: Required
  
- If `status` is `resolved`:
  - `root_cause_analysis`: Required
  - `lessons_learned`: Required
  - `resolution_date`: Required
  
- If `third_party_involved` is `true`:
  - `vendor_id`: Required (must exist in vendors table)

**Standard Rules:**
- `incident_title`: Required, string, max 255
- `incident_type`: Required, enum
- `risk_level`: Required, enum
- `is_breach`: Required, boolean
- `detected_date`: Required, date
- `occurred_date`: Optional, date
- `hours_to_deadline`: Optional, integer
- `is_deadline_passed`: Optional, boolean
- `incident_description`: Required, string
- `what_happened`: Required, string
- `how_discovered`: Required, string
- `data_compromised`: Required, string
- `data_categories_affected`: Required, array with at least 1 item, each must be valid DataCategory enum
- `estimated_affected_subjects`: Required, integer
- `affected_subject_keys`: Optional, array
- `notification_required`: Required, enum
- `notification_status`: Required, enum
- `authority_notified`: Required, boolean
- `authority_reference_number`: Optional, string
- `authority_response`: Optional, string
- `subjects_notified`: Required, boolean
- `notification_template_used`: Optional, string
- `immediate_actions`: Required, string
- `mitigation_measures`: Required, string
- `preventive_measures`: Required, string
- `responsible_party`: Optional, string
- `status`: Required, enum
- `processing_activity_ids`: Optional, array of integers, must exist in record_of_processing_activities table
- `affected_systems`: Required, array of strings, max 255 each
- `third_party_involved`: Required, boolean
- `evidence_uris`: Optional, array of valid URLs

**Automatic Behavior:**
- `organization_id` is automatically set to authenticated user's organization
- `incident_code` is automatically generated
- `created_by` and `updated_by` are automatically set to authenticated user
- If `detected_date` is provided, `notification_deadline` is automatically calculated as detected_date + 72 hours
- If both `detected_date` and `resolution_date` are provided, `days_to_resolution` is automatically calculated

#### Response (201 Created)
```json
{
  "error": false,
  "message": "Privacy incident created successfully",
  "data": {
    // Full resource object with generated incident_code and calculated notification_deadline
  }
}
```

---

### 3. Get Single Privacy Incident
**GET** `/api/privacy-incidents/{id}`

Retrieves a single privacy incident by ID.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Privacy incident retrieved successfully",
  "data": {
    // Full resource object
  }
}
```

---

### 4. Update Privacy Incident
**POST** `/api/privacy-incidents/{id}`

Updates an existing privacy incident. All fields are optional.

#### Request Body
Same structure as create, but all fields are optional. Only include fields you want to update.

**Automatic Behavior:**
- `updated_by` is automatically set to authenticated user
- If `detected_date` is changed, `notification_deadline` is recalculated (detected_date + 72 hours)
- If both `detected_date` and `resolution_date` are provided, `days_to_resolution` is recalculated

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Privacy incident updated successfully",
  "data": {
    // Updated resource object
  }
}
```

---

### 5. Delete Privacy Incident
**DELETE** `/api/privacy-incidents/{id}`

Deletes a privacy incident.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Privacy incident deleted successfully",
  "data": null
}
```

---

## Enums

### Status
- `detected` - Incident detected
- `under_investigation` - Under investigation
- `contained` - Incident contained
- `notified` - Notifications sent
- `remediation` - Remediation in progress
- `resolved` - Incident resolved
- `closed` - Incident closed

### IncidentType
Check enum file: `app/Enums/PrivacyIncident/IncidentType.php`

### RiskLevel
Check enum file: `app/Enums/PrivacyIncident/RiskLevel.php`

### NotificationRequired
Check enum file: `app/Enums/PrivacyIncident/NotificationRequired.php`

### NotificationStatus
Check enum file: `app/Enums/PrivacyIncident/NotificationStatus.php`

### NotificationMethod
Check enum file: `app/Enums/PrivacyIncident/NotificationMethod.php`

### DataCategory
(From RecordOfProcessingActivity enum)
Check enum file: `app/Enums/RecordOfProcessingActivity/DataCategory.php`

---

## Frontend Implementation Notes

### 1. Incident Form Sections
Organize the form into logical sections:

**Section 1: Basic Information**
- Incident title, type, risk level
- Breach status and criteria
- Detection and occurrence dates

**Section 2: Incident Details**
- What happened, how discovered
- Data compromised, categories affected
- Affected subjects count and keys

**Section 3: Notification**
- Notification requirements and status
- Authority notification details
- Subject notification details

**Section 4: Response & Resolution**
- Immediate actions
- Mitigation measures
- Preventive measures
- Root cause analysis (if resolved)
- Lessons learned (if resolved)

**Section 5: Related Information**
- Linked processing activities
- Affected systems
- Third-party involvement
- Evidence documents

### 2. Form Components
- **Incident Type Selector:** Dropdown for incident types
- **Risk Level Selector:** Color-coded risk level selector
- **Breach Criteria Checkboxes:** Multi-select for breach criteria
- **Date/Time Pickers:** For detected_date, occurred_date, notification dates
- **Affected Subjects Counter:** Input for estimated_affected_subjects
- **Affected Systems Multi-Select:** Multi-select for affected systems
- **Processing Activities Multi-Select:** Multi-select for linked ROPAs
- **Vendor Selector:** Search/select for vendor (if third-party involved)
- **Evidence Upload:** File upload component that stores URIs
- **Rich Text Editors:** For description, actions, measures, analysis

### 3. Conditional Logic
Implement dynamic form sections based on:
- **Is Breach:** Show breach criteria when true
- **Authority Notified:** Show authority fields when true
- **Subjects Notified:** Show subject notification fields when true
- **Status = Resolved:** Show root cause analysis and lessons learned
- **Third Party Involved:** Show vendor selector when true

### 4. UI/UX Recommendations
- **Urgency Indicator:** 
  - Red alert for incidents with deadline approaching (< 24 hours)
  - Yellow warning for incidents with deadline approaching (< 72 hours)
- **Notification Deadline Countdown:** Display hours_to_deadline prominently
- **Status Badge:** Color-coded status indicators
- **Risk Level Badge:** Visual risk level indicator
- **Breach Indicator:** Clear badge when is_breach = true
- **Timeline View:** Visual timeline of incident lifecycle
- **Quick Actions:**
  - "Mark as Breach" button
  - "Notify Authority" button
  - "Notify Subjects" button
  - "Resolve Incident" button

### 5. Notification Deadline Management
- **Auto-calculate:** notification_deadline = detected_date + 72 hours
- **Countdown Timer:** Display hours remaining until deadline
- **Alert System:** Alert when deadline is approaching
- **Deadline Status:** Show if deadline has passed

### 6. Data Display
- **Incident Code:** Display as reference number
- **Affected Subjects:** Show count prominently
- **Notification Status:** Clear notification status indicators
- **Timeline:** Visual timeline showing:
  - Detected date
  - Occurred date
  - Notification deadline
  - Authority notification date
  - Subject notification date
  - Resolution date
- **Processing Activities:** Links to related ROPA records
- **Affected Systems:** List of affected systems
- **Evidence:** Links to evidence documents

### 7. Status Workflow UI
```
Detected → Under Investigation → Contained → Notified → Remediation → Resolved → Closed
```

### 8. Dashboard Widgets
- **Active Incidents:** Count of active incidents
- **Breaches:** Count of incidents where is_breach = true
- **Pending Notifications:** Incidents requiring notification
- **Approaching Deadlines:** Incidents with deadline < 24 hours
- **By Risk Level:** Risk level distribution
- **By Status:** Status distribution
- **By Incident Type:** Incident type breakdown
- **Resolution Time:** Average days to resolution

### 9. Compliance Features
- **72-Hour Rule:** Automatic calculation and tracking of notification deadline
- **Breach Criteria:** Track which breach criteria are met
- **Notification Tracking:** Track authority and subject notifications
- **Evidence Management:** Secure storage of incident evidence
- **Audit Trail:** Track all incident changes

### 10. Example React Component
```typescript
interface PrivacyIncidentFormData {
  incident_title: string;
  incident_type: string;
  risk_level: string;
  is_breach: boolean;
  detected_date: string;
  // ... other fields
}

const PrivacyIncidentForm = () => {
  const [formData, setFormData] = useState<PrivacyIncidentFormData>({...});
  const [status, setStatus] = useState('detected');
  
  // Calculate notification deadline
  const notificationDeadline = useMemo(() => {
    if (formData.detected_date) {
      const detected = new Date(formData.detected_date);
      const deadline = new Date(detected.getTime() + 72 * 60 * 60 * 1000);
      return deadline;
    }
    return null;
  }, [formData.detected_date]);
  
  // Conditional field rendering
  const showBreachFields = formData.is_breach;
  const showAuthorityFields = formData.authority_notified;
  const showSubjectFields = formData.subjects_notified;
  const showResolutionFields = status === 'resolved';
  
  return (
    <form>
      <BasicInformationSection />
      {showBreachFields && <BreachCriteriaSection />}
      <IncidentDetailsSection />
      <NotificationSection 
        showAuthority={showAuthorityFields}
        showSubjects={showSubjectFields}
        deadline={notificationDeadline}
      />
      <ResponseSection />
      {showResolutionFields && <ResolutionSection />}
      <RelatedInformationSection />
    </form>
  );
};
```

### 11. Alert System
```typescript
const IncidentAlerts = ({ incident }: { incident: PrivacyIncident }) => {
  const hoursToDeadline = incident.hours_to_deadline;
  const isUrgent = hoursToDeadline !== null && hoursToDeadline < 24;
  const isWarning = hoursToDeadline !== null && hoursToDeadline < 72;
  
  return (
    <>
      {isUrgent && (
        <Alert severity="error">
          Urgent: Notification deadline in {hoursToDeadline} hours!
        </Alert>
      )}
      {isWarning && !isUrgent && (
        <Alert severity="warning">
          Warning: Notification deadline in {hoursToDeadline} hours
        </Alert>
      )}
      {incident.is_deadline_passed && (
        <Alert severity="error">
          Deadline has passed! Notify authority immediately.
        </Alert>
      )}
    </>
  );
};
```

---

## Testing Checklist
- [ ] List incidents with all filter options
- [ ] Create incident with is_breach = true (requires breach_criteria_met)
- [ ] Create incident with authority_notified = true (requires authority fields)
- [ ] Create incident with subjects_notified = true (requires subject notification fields)
- [ ] Create incident with status = resolved (requires resolution fields)
- [ ] Create incident with third_party_involved = true (requires vendor_id)
- [ ] Test notification deadline calculation (detected_date + 72 hours)
- [ ] Test days_to_resolution calculation
- [ ] Update incident - change detected_date (recalculates notification_deadline)
- [ ] Update incident - change status to resolved
- [ ] Test with linked processing activities
- [ ] Test affected systems array
- [ ] Test evidence URIs
- [ ] Delete incident
- [ ] Handle validation errors for conditional fields
- [ ] Test deadline countdown and alerts

