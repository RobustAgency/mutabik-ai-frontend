# Data Protection Impact Assessments - Frontend Implementation Guide

## Overview
The Data Protection Impact Assessment (DPIA) module manages DPIAs required under GDPR Article 35. DPIAs assess the impact of data processing operations on data protection and identify measures to mitigate risks. This module tracks the entire DPIA lifecycle from initiation to completion.

## Base URL
All endpoints are prefixed with: `/api/data-protection-impact-assessments`

**Authentication Required:** Yes (Bearer token via `auth:supabase` middleware)

---

## API Endpoints

### 1. List Data Protection Impact Assessments
**GET** `/api/data-protection-impact-assessments`

Retrieves a paginated list of DPIAs with optional filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | No | Items per page (1-100, default: 15) |
| `name` | string | No | Filter by DPIA name (partial match) |
| `status` | string | No | Filter by status (enum) |
| `stage` | string | No | Filter by stage (enum) |
| `risk_level` | string | No | Filter by risk level (enum) |

#### Response (200 OK)
```json
{
  "error": false,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "dpia_code": "DPIA-2024-550e8400-e29b-41d4-a716-446655440000",
        "dpia_name": "AI Customer Analytics DPIA",
        "ropa_id": 1,
        "linked_ai_model_id": 5,
        "linked_asset_type": "ai_model",
        "automated_trigger": true,
        "trigger_reason": "High-risk processing detected",
        "risk_level": "high",
        "risk_score": 20,
        "stage": "necessity",
        "completion_percentage": 25,
        "necessity_justification": "Processing is necessary for business operations...",
        "proportionality_assessment": "Processing is proportionate to the purpose...",
        "alternatives_considered": "Alternative approaches were evaluated...",
        "identified_risks": null,
        "likelihood_assessment": "Medium likelihood of data breach...",
        "impact_assessment": "High impact on data subjects if breach occurs...",
        "mitigation_measures": null,
        "residual_risk_level": null,
        "dpo_consulted": false,
        "dpo_consultation_date": null,
        "dpo_advice": null,
        "dpo_user_id": null,
        "stakeholders_consulted": [1, 2],
        "stakeholder_feedback": "Stakeholders raised concerns about...",
        "data_subjects_consulted": true,
        "consultation_method": null,
        "final_decision": null,
        "approval_date": null,
        "approved_by": null,
        "conditions": null,
        "status": "in_progress",
        "review_frequency_months": 12,
        "next_review_date": "2025-01-15T00:00:00Z",
        "applicable_jurisdictions": ["EU", "UK"],
        "created_by": 1,
        "updated_by": 1,
        "created_at": "2024-01-15T00:00:00Z",
        "updated_at": "2024-01-15T00:00:00Z"
      }
    ],
    "per_page": 15,
    "total": 10,
    "last_page": 1
  },
  "message": "Data Protection Impact Assessments retrieved successfully"
}
```

---

### 2. Create Data Protection Impact Assessment
**POST** `/api/data-protection-impact-assessments`

Creates a new DPIA. The `dpia_code` is automatically generated in format: `DPIA-{YEAR}-{UUID}`.

#### Request Body
```json
{
  "dpia_name": "AI Customer Analytics DPIA",
  "ropa_id": 1,
  "linked_ai_model_id": 5,
  "linked_asset_type": "ai_model",
  "automated_trigger": true,
  "trigger_reason": "High-risk processing detected",
  "risk_level": "high",
  "risk_score": 20,
  "stage": "necessity",
  "completion_percentage": 25,
  "necessity_justification": "Processing is necessary for business operations and customer service improvement.",
  "proportionality_assessment": "Processing is proportionate to the purpose and does not exceed what is necessary.",
  "alternatives_considered": "Alternative approaches were evaluated but found to be less effective.",
  "identified_risks": null,
  "likelihood_assessment": "Medium likelihood of data breach due to large dataset size.",
  "impact_assessment": "High impact on data subjects if breach occurs, affecting 10,000+ individuals.",
  "mitigation_measures": null,
  "residual_risk_level": null,
  "dpo_consulted": false,
  "dpo_consultation_date": null,
  "dpo_advice": null,
  "dpo_user_id": null,
  "stakeholders_consulted": [1, 2],
  "stakeholder_feedback": "Stakeholders raised concerns about data retention.",
  "data_subjects_consulted": true,
  "consultation_method": null,
  "final_decision": null,
  "approval_date": null,
  "approved_by": null,
  "conditions": null,
  "status": "in_progress",
  "review_frequency_months": 12,
  "applicable_jurisdictions": ["EU", "UK"]
}
```

#### Validation Rules

**Conditional Validation:**
- If `stage` is `necessity`:
  - `necessity_justification`: Required
  
- If `stage` is `risk_identification`:
  - `identified_risks`: Required
  
- If `stage` is `mitigation`:
  - `mitigation_measures`: Required
  
- If `stage` is `dpo_consultation`, `approval`, or `completed`:
  - `residual_risk_level`: Required
  
- If `dpo_consulted` is `true`:
  - `dpo_consultation_date`: Required
  - `dpo_advice`: Required
  - `dpo_user_id`: Required (must exist in users table)
  - `consultation_method`: Required
  
- If `stage` is `approval`:
  - `final_decision`: Required
  - `approval_date`: Required
  - `approved_by`: Required (must exist in users table)
  
- If `final_decision` is `approved_with_conditions`:
  - `conditions`: Required

**Standard Rules:**
- `dpia_name`: Required, string, max 255
- `ropa_id`: Required, integer, must exist in record_of_processing_activities table
- `linked_ai_model_id`: Optional, integer, must exist in ai_models table
- `linked_asset_type`: Required, enum
- `automated_trigger`: Required, boolean
- `trigger_reason`: Required, string, max 255
- `risk_level`: Required, enum
- `risk_score`: Required, integer, 1-25
- `stage`: Required, enum
- `completion_percentage`: Required, integer, 0-100
- `proportionality_assessment`: Required, string
- `alternatives_considered`: Required, string
- `likelihood_assessment`: Required, string
- `impact_assessment`: Required, string
- `stakeholders_consulted`: Optional, array of integers, must exist in stakeholders table
- `stakeholder_feedback`: Optional, string
- `data_subjects_consulted`: Required, boolean
- `status`: Required, enum
- `review_frequency_months`: Required, integer, min 1
- `applicable_jurisdictions`: Required, array with at least 1 item, each must be valid enum

**Automatic Behavior:**
- If `review_frequency_months` is provided, `next_review_date` is automatically calculated as current date + review_frequency_months
- `created_by` and `updated_by` are automatically set to authenticated user

#### Response (201 Created)
```json
{
  "error": false,
  "message": "Data Protection Impact Assessment created successfully",
  "data": {
    // Full resource object with generated dpia_code and calculated next_review_date
  }
}
```

---

### 3. Get Single Data Protection Impact Assessment
**GET** `/api/data-protection-impact-assessments/{id}`

Retrieves a single DPIA by ID.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Data Protection Impact Assessment retrieved successfully",
  "data": {
    // Full resource object
  }
}
```

---

### 4. Update Data Protection Impact Assessment
**POST** `/api/data-protection-impact-assessments/{id}`

Updates an existing DPIA. All fields are optional.

#### Request Body
Same structure as create, but all fields are optional. Only include fields you want to update.

**Automatic Behavior:**
- If `review_frequency_months` is updated, `next_review_date` is recalculated
- `updated_by` is automatically set to authenticated user

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Data Protection Impact Assessment updated successfully",
  "data": {
    // Updated resource object
  }
}
```

---

### 5. Delete Data Protection Impact Assessment
**DELETE** `/api/data-protection-impact-assessments/{id}`

Deletes a DPIA.

#### Response (200 OK)
```json
{
  "data": null,
  "error": false,
  "message": "Data Protection Impact Assessment deleted successfully"
}
```

---

## Enums

### Status
- `draft` - Draft DPIA
- `in_progress` - In progress
- `dpo_review` - Under DPO review
- `pending_approval` - Pending approval
- `completed` - Completed
- `archived` - Archived

### Stage
Check enum file: `app/Enums/DataProtectionImpactAssessment/Stage.php`

### RiskLevel
Check enum file: `app/Enums/DataProtectionImpactAssessment/RiskLevel.php`

### ResidualRiskLevel
Check enum file: `app/Enums/DataProtectionImpactAssessment/ResidualRiskLevel.php`

### FinalDecision
Check enum file: `app/Enums/DataProtectionImpactAssessment/FinalDecision.php`

### LinkedAssetsType
Check enum file: `app/Enums/DataProtectionImpactAssessment/LinkedAssetsType.php`

### Jurisdiction
Check enum file: `app/Enums/DataProtectionImpactAssessment/Jurisdiction.php`

---

## Frontend Implementation Notes

### 1. Multi-Stage Form
DPIA is a multi-stage process. Implement a wizard/stepper interface:

**Stage 1: Necessity**
- Necessity justification (required)
- Proportionality assessment
- Alternatives considered

**Stage 2: Risk Identification**
- Identified risks (required)
- Likelihood assessment
- Impact assessment

**Stage 3: Mitigation**
- Mitigation measures (required)
- Residual risk level

**Stage 4: DPO Consultation**
- DPO consultation toggle
- DPO user selection
- Consultation date
- DPO advice
- Consultation method

**Stage 5: Approval**
- Final decision (required)
- Approval date (required)
- Approved by (required)
- Conditions (if approved with conditions)

### 2. Form Components
- **ROPA Link:** Search/select dropdown for `ropa_id`
- **AI Model Link:** Optional search/select for `linked_ai_model_id`
- **Risk Score Calculator:** Visual calculator or input (1-25)
- **Completion Percentage:** Progress bar or slider (0-100)
- **Stage Selector:** Dropdown or stepper for stage selection
- **Stakeholder Multi-Select:** Multi-select for stakeholders
- **Jurisdiction Multi-Select:** Multi-select for jurisdictions
- **Rich Text Editors:** For long text fields (justification, assessment, etc.)

### 3. Conditional Logic
Implement dynamic form sections based on:
- **Current Stage:** Show/hide fields based on stage
- **DPO Consulted:** Show DPO fields when true
- **Final Decision:** Show conditions field when "approved_with_conditions"

### 4. UI/UX Recommendations
- **Progress Indicator:** Show completion percentage visually
- **Stage Stepper:** Visual stepper showing current stage
- **Risk Level Badge:** Color-coded risk level indicator
  - Low: Green
  - Medium: Yellow
  - High: Orange
  - Critical: Red
- **Risk Score Display:** Visual representation of risk score (1-25)
- **Review Date Alert:** Alert when review date is approaching
- **DPO Consultation Badge:** Indicator when DPO consultation is required
- **Approval Status:** Clear approval status display

### 5. Workflow Visualization
```
Necessity → Risk Identification → Mitigation → DPO Consultation → Approval → Completed
```

### 6. Data Display
- **DPIA Code:** Display as reference number
- **Linked ROPA:** Link to related processing activity
- **Linked AI Model:** Link to related AI model (if applicable)
- **Risk Assessment:** Visual risk matrix or chart
- **Stakeholders:** List of consulted stakeholders
- **Review Schedule:** Display next review date

### 7. Risk Assessment UI
```typescript
interface RiskAssessment {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number; // 1-25
  likelihood: string;
  impact: string;
  mitigation: string;
  residual_risk: string;
}

const RiskAssessmentSection = ({ dpia }: { dpia: DPIA }) => {
  return (
    <div>
      <RiskLevelBadge level={dpia.risk_level} />
      <RiskScoreDisplay score={dpia.risk_score} max={25} />
      <RiskMatrix 
        likelihood={dpia.likelihood_assessment}
        impact={dpia.impact_assessment}
      />
      {dpia.mitigation_measures && (
        <MitigationMeasures measures={dpia.mitigation_measures} />
      )}
      {dpia.residual_risk_level && (
        <ResidualRiskBadge level={dpia.residual_risk_level} />
      )}
    </div>
  );
};
```

### 8. Dashboard Widgets
- **Active DPIAs:** Count of in-progress DPIAs
- **Pending DPO Review:** DPIAs awaiting DPO consultation
- **Pending Approval:** DPIAs awaiting approval
- **High Risk DPIAs:** DPIAs with high/critical risk level
- **Due for Review:** DPIAs with upcoming review dates
- **By Stage:** DPIA distribution by stage
- **By Risk Level:** Risk level breakdown

### 9. Automation Features
- **Auto-trigger Detection:** Show when DPIA was auto-triggered
- **Review Reminders:** Alert when review date is approaching
- **Stage Progression:** Guide user through stage progression
- **Completion Tracking:** Auto-calculate completion percentage

### 10. Example React Component Structure
```typescript
interface DPIAFormData {
  dpia_name: string;
  ropa_id: number;
  stage: string;
  risk_level: string;
  risk_score: number;
  // ... other fields
}

const DPIAWizard = () => {
  const [formData, setFormData] = useState<DPIAFormData>({...});
  const [currentStage, setCurrentStage] = useState('necessity');
  
  const stages = [
    'necessity',
    'risk_identification',
    'mitigation',
    'dpo_consultation',
    'approval'
  ];
  
  const renderStageContent = () => {
    switch (currentStage) {
      case 'necessity':
        return <NecessityStage />;
      case 'risk_identification':
        return <RiskIdentificationStage />;
      case 'mitigation':
        return <MitigationStage />;
      case 'dpo_consultation':
        return <DPOConsultationStage />;
      case 'approval':
        return <ApprovalStage />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <StageStepper stages={stages} current={currentStage} />
      <CompletionProgress percentage={formData.completion_percentage} />
      {renderStageContent()}
      <NavigationButtons 
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};
```

---

## Testing Checklist
- [ ] List DPIAs with all filter options
- [ ] Create DPIA with stage = necessity (requires necessity_justification)
- [ ] Create DPIA with stage = risk_identification (requires identified_risks)
- [ ] Create DPIA with stage = mitigation (requires mitigation_measures)
- [ ] Create DPIA with dpo_consulted = true (requires DPO fields)
- [ ] Create DPIA with stage = approval (requires approval fields)
- [ ] Create DPIA with final_decision = approved_with_conditions (requires conditions)
- [ ] Update DPIA - change review_frequency_months (auto-calculates next_review_date)
- [ ] Test risk_score validation (1-25)
- [ ] Test completion_percentage validation (0-100)
- [ ] Test with linked ROPA and AI model
- [ ] Test stakeholder selection
- [ ] Delete DPIA
- [ ] Handle validation errors for conditional fields
- [ ] Test stage progression workflow

