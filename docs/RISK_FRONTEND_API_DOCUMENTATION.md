# Frontend API Documentation

## Overview

This document provides comprehensive information for implementing the following API endpoints in the frontend:
- AI Risk Register
- Risk Methodologies
- AI Risk Treatments
- KRI Indicators

All endpoints require authentication with the `Authorization: Bearer {token}` header (Supabase authentication).

---

## Table of Contents

1. [AI Risk Register](#ai-risk-register)
2. [Risk Methodologies](#risk-methodologies)
3. [AI Risk Treatments](#ai-risk-treatments)
4. [KRI Indicators](#kri-indicators)
5. [Common Response Format](#common-response-format)
6. [Error Handling](#error-handling)

---

## AI Risk Register

### Overview
Manage AI risk register entries including risk assessment, categorization, scoring, and tracking.

### Base URL
```
/api/ai-risk-register
```

### Endpoints

#### 1. List AI Risk Registers
**Endpoint:** `GET /api/ai-risk-register`

**Description:** Retrieve a paginated list of AI risk register entries.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | integer | No | Items per page (default: 15) |

**Response (200):**
```json
{
  "error": false,
  "message": "AI risk register entries retrieved successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Model Bias Risk",
        "risk_category": "bias_fairness",
        "ai_model_id": 1,
        "ai_model_version_id": 1,
        "use_case_id": 1,
        "description": "Risk of biased predictions",
        "related_controls": [],
        "likelihood_code": "M",
        "impact_code": "H",
        "inherent_score": "7",
        "residual_score": "3",
        "risk_level": "high",
        "decision": "treat",
        "risk_owner": 1,
        "review_cadence": "quarterly",
        "next_review_due": "2025-03-09",
        "status": "identified",
        "linked_assessment_id": null,
        "linked_incident_id": null,
        "linked_capa_id": null,
        "evidence_link": "https://example.com/evidence",
        "likelihood_label_snapshot": "Medium",
        "impact_label_snapshot": "High",
        "method_name_snapshot": "Risk Matrix v1",
        "created_by": "user@example.com",
        "organization_id": 1,
        "created_at": "2024-12-09T10:00:00Z",
        "updated_at": "2024-12-09T10:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 15,
      "total": 10
    }
  }
}
```

---

#### 2. Create AI Risk Register
**Endpoint:** `POST /api/ai-risk-register`

**Description:** Create a new AI risk register entry.

**Request Body:**
```json
{
  "title": "Model Bias Risk",
  "risk_category": "bias_fairness",
  "ai_model_id": 1,
  "ai_model_version_id": 1,
  "use_case_id": 1,
  "description": "Risk of biased predictions in credit assessment",
  "related_controls": ["control_1", "control_2"],
  "likelihood_code": "M",
  "impact_code": "H",
  "inherent_score": "7",
  "residual_score": "3",
  "risk_level": "high",
  "decision": "treat",
  "risk_owner": 1,
  "review_cadence": "quarterly",
  "next_review_due": "2025-03-09",
  "status": "identified",
  "linked_assessment_id": null,
  "linked_incident_id": null,
  "linked_capa_id": null,
  "evidence_link": "https://example.com/evidence",
  "likelihood_label_snapshot": "Medium",
  "impact_label_snapshot": "High",
  "method_name_snapshot": "Risk Matrix v1",
  "created_by": "user@example.com"
}
```

**Validation Rules:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | string | Yes | Max 255 characters |
| `risk_category` | enum | Yes | Valid RiskCategory enum value: `safety`, `privacy`, `bias_fairness`, `security`, `robustness`, `explainability`, `legal_compliance`, `ethics`, `availability`, `resilience`, `vendor`, `cost`, `reputation`, `other` |
| `ai_model_id` | integer | Yes | Must exist in ai_models table |
| `ai_model_version_id` | integer | No | Must exist in ai_model_versions table |
| `use_case_id` | integer | No | Must exist in use_cases table |
| `description` | string | Yes | Any length |
| `related_controls` | array | No | Array of control identifiers |
| `likelihood_code` | string | Yes | Max 255 characters |
| `impact_code` | string | Yes | Max 255 characters |
| `inherent_score` | string | No | Max 255 characters |
| `residual_score` | string | No | Max 255 characters |
| `risk_level` | enum | Yes | Valid RiskLevel enum value: `low`, `medium`, `high`, `critical` |
| `decision` | enum | Yes | Valid RiskDecision enum value: `treat`, `accept`, `transfer`, `avoid` |
| `risk_owner` | integer | Yes | Must exist in stakeholders table |
| `review_cadence` | enum | Yes | Valid ReviewCadence enum value: `monthly`, `quarterly`, `semi_annual`, `annual` |
| `next_review_due` | date | Yes | Valid date format (YYYY-MM-DD) |
| `status` | enum | Yes | Valid RiskStatus enum value: `identified`, `assessed`, `in_treatment`, `accepted`, `transferred`, `closed` |
| `linked_assessment_id` | integer | No | Integer value |
| `linked_incident_id` | integer | No | Must exist in ai_incidents table |
| `linked_capa_id` | integer | No | Must exist in corrective_preventive_actions table |
| `evidence_link` | string | No | Max 500 characters, valid URL |
| `likelihood_label_snapshot` | string | No | Max 255 characters |
| `impact_label_snapshot` | string | No | Max 255 characters |
| `method_name_snapshot` | string | No | Max 255 characters |
| `created_by` | string | Yes | Valid email address |

**Response (201):**
```json
{
  "error": false,
  "message": "AI risk register entry created successfully",
  "data": {
    "id": 1,
    "title": "Model Bias Risk",
    // ... full object as shown in list endpoint
  }
}
```

---

#### 3. Show AI Risk Register
**Endpoint:** `GET /api/ai-risk-register/{aiRiskRegister}`

**Description:** Retrieve a specific AI risk register entry by ID.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `aiRiskRegister` | integer | AI Risk Register ID |

**Response (200):**
```json
{
  "error": false,
  "message": "AI risk register entry retrieved successfully",
  "data": {
    "id": 1,
    "title": "Model Bias Risk",
    // ... full object
  }
}
```

---

#### 4. Update AI Risk Register
**Endpoint:** `POST /api/ai-risk-register/{aiRiskRegister}`

**Description:** Update an existing AI risk register entry (partial update supported).

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `aiRiskRegister` | integer | AI Risk Register ID |

**Request Body:**
```json
{
  "title": "Updated Model Bias Risk",
  "risk_level": "medium",
  "status": "mitigated"
}
```

**Validation Rules:** Same as Create, but all fields are optional (use `sometimes` rule)

**Response (200):**
```json
{
  "error": false,
  "message": "AI risk register entry updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Model Bias Risk",
    // ... updated object
  }
}
```

---

#### 5. Delete AI Risk Register
**Endpoint:** `DELETE /api/ai-risk-register/{aiRiskRegister}`

**Description:** Delete an AI risk register entry.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `aiRiskRegister` | integer | AI Risk Register ID |

**Response (200):**
```json
{
  "error": false,
  "message": "AI risk register entry deleted successfully",
  "data": null
}
```

---

## Risk Methodologies

### Overview
Manage risk assessment methodologies including likelihood/impact scales, risk matrices, and acceptance thresholds.

### Base URL
```
/api/risk-methodologies
```

### Endpoints

#### 1. List Risk Methodologies
**Endpoint:** `GET /api/risk-methodologies`

**Description:** Retrieve a filtered and paginated list of risk methodologies.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Filter by methodology name |
| `effective_from` | date | No | Filter by effective from date (YYYY-MM-DD) |
| `effective_to` | date | No | Filter by effective to date (YYYY-MM-DD) |
| `per_page` | integer | No | Items per page (min: 1, max: 100, default: 15) |

**Example Request:**
```
GET /api/risk-methodologies?name=ISO&per_page=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "ISO 31010 Risk Matrix",
      "likelihood_scale": {
        "L": "Low (1-20%)",
        "M": "Medium (20-50%)",
        "H": "High (50-80%)",
        "VH": "Very High (80-100%)"
      },
      "impact_scale": {
        "L": "Low",
        "M": "Medium",
        "H": "High",
        "C": "Critical"
      },
      "matrix_rule": {
        "L_L": "Low",
        "L_M": "Low",
        "L_H": "Medium",
        "L_C": "Medium",
        "M_L": "Low",
        "M_M": "Medium",
        "M_H": "High",
        "M_C": "High",
        "H_L": "Medium",
        "H_M": "High",
        "H_H": "High",
        "H_C": "Critical",
        "VH_L": "High",
        "VH_M": "High",
        "VH_H": "Critical",
        "VH_C": "Critical"
      },
      "acceptance_thresholds": "Medium",
      "aggregation_logic": "Maximum inherent risk across all identified risks",
      "review_policy": "Annual review with ad-hoc updates",
      "effective_from": "2024-01-01",
      "effective_to": null,
      "owner_team": "Risk Management",
      "source_created_at": "2024-01-01",
      "organization_id": 1,
      "created_at": "2024-12-09T10:00:00Z",
      "updated_at": "2024-12-09T10:00:00Z"
    }
  ],
  "message": "Risk Methodologies retrieved successfully.",
  "error": false
}
```

---

#### 2. Create Risk Methodology
**Endpoint:** `POST /api/risk-methodologies`

**Description:** Create a new risk methodology.

**Request Body:**
```json
{
  "name": "ISO 31010 Risk Matrix",
  "likelihood_scale": {
    "L": "Low (1-20%)",
    "M": "Medium (20-50%)",
    "H": "High (50-80%)",
    "VH": "Very High (80-100%)"
  },
  "impact_scale": {
    "L": "Low",
    "M": "Medium",
    "H": "High",
    "C": "Critical"
  },
  "matrix_rule": {
    "L_L": "Low",
    "L_M": "Low",
    "L_H": "Medium",
    "M_M": "Medium",
    "H_H": "High"
  },
  "acceptance_thresholds": "Medium",
  "aggregation_logic": "Maximum inherent risk across all identified risks",
  "review_policy": "Annual review with ad-hoc updates",
  "effective_from": "2024-01-01",
  "effective_to": null,
  "owner_team": "Risk Management",
  "source_created_at": "2024-01-01"
}
```

**Validation Rules:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | Max 255 characters |
| `likelihood_scale` | array | Yes | JSON array object |
| `impact_scale` | array | Yes | JSON array object |
| `matrix_rule` | array | Yes | JSON array object |
| `acceptance_thresholds` | string | Yes | Any text content |
| `aggregation_logic` | string | No | Any text content |
| `review_policy` | string | Yes | Any text content |
| `effective_from` | date | No | Valid date format (YYYY-MM-DD) |
| `effective_to` | date | No | Must be after or equal to effective_from |
| `owner_team` | string | Yes | Max 255 characters |
| `source_created_at` | date | Yes | Valid date format (YYYY-MM-DD) |

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "name": "ISO 31010 Risk Matrix",
    // ... full object
  },
  "message": "Risk Methodology created successfully.",
  "error": false
}
```

---

#### 3. Show Risk Methodology
**Endpoint:** `GET /api/risk-methodologies/{riskMethodology}`

**Description:** Retrieve a specific risk methodology by ID.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `riskMethodology` | integer | Risk Methodology ID |

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "ISO 31010 Risk Matrix",
    // ... full object
  },
  "message": "Risk Methodology retrieved successfully.",
  "error": false
}
```

---

#### 4. Update Risk Methodology
**Endpoint:** `POST /api/risk-methodologies/{riskMethodology}`

**Description:** Update an existing risk methodology (partial update supported).

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `riskMethodology` | integer | Risk Methodology ID |

**Request Body:**
```json
{
  "name": "Updated ISO 31010 Risk Matrix",
  "acceptance_thresholds": "High",
  "effective_to": "2025-12-31"
}
```

**Validation Rules:** Same as Create, but all fields are optional (use `sometimes` rule)

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Updated ISO 31010 Risk Matrix",
    // ... updated object
  },
  "message": "Risk Methodology updated successfully.",
  "error": false
}
```

---

#### 5. Delete Risk Methodology
**Endpoint:** `DELETE /api/risk-methodologies/{riskMethodology}`

**Description:** Delete a risk methodology.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `riskMethodology` | integer | Risk Methodology ID |

**Response (200):**
```json
{
  "message": "Risk Methodology deleted successfully.",
  "error": false
}
```

---

## AI Risk Treatments

### Overview
Manage treatment plans for identified AI risks including mitigation strategies, timelines, and verification methods.

### Base URL
```
/api/ai-risk-treatments
```

### Endpoints

#### 1. List AI Risk Treatments
**Endpoint:** `GET /api/ai-risk-treatments`

**Description:** Retrieve a filtered and paginated list of AI risk treatments.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `treatment_type` | string | No | Filter by treatment type: `corrective`, `preventive`, `detective`, `transfer_insurance`, `transfer_vendor`, `avoid_change`, `other` |
| `status` | string | No | Filter by status: `new`, `in_progress`, `blocked`, `pending_verification`, `closed`, `cancelled` |
| `per_page` | integer | No | Items per page (min: 1, max: 100) |

**Example Request:**
```
GET /api/ai-risk-treatments?treatment_type=mitigation&status=in_progress&per_page=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "ai_risk_register_id": 1,
      "treatment_type": "corrective",
      "plan_summary": "Implement fairness checks in model training",
      "owner_stakeholder_id": 2,
      "assignee": ["john@example.com", "jane@example.com"],
      "due_date": "2025-03-09",
      "status": "in_progress",
      "expected_residual_level": "medium",
      "result_verification": "passed",
      "evidence_link": "https://example.com/mitigation-evidence",
      "linked_capa_id": "CAPA-001",
      "closed_at": null,
      "organization_id": 1,
      "created_at": "2024-12-09T10:00:00Z",
      "updated_at": "2024-12-09T10:00:00Z"
    }
  ],
  "message": "AI Risk Treatments retrieved successfully.",
  "error": false
}
```

---

#### 2. Create AI Risk Treatment
**Endpoint:** `POST /api/ai-risk-treatments`

**Description:** Create a new AI risk treatment plan.

**Request Body:**
```json
{
  "ai_risk_register_id": 1,
  "treatment_type": "corrective",
  "plan_summary": "Implement fairness checks in model training",
  "owner_stakeholder_id": 2,
  "assignee": ["john@example.com", "jane@example.com"],
  "due_date": "2025-03-09",
  "status": "new",
  "expected_residual_level": "medium",
  "result_verification": "passed",
  "evidence_link": "https://example.com/mitigation-evidence",
  "linked_capa_id": "CAPA-001",
  "closed_at": null
}
```

**Validation Rules:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `ai_risk_register_id` | integer | Yes | Must exist in ai_risk_registers table |
| `treatment_type` | enum | Yes | Valid TreatmentType enum value: `corrective`, `preventive`, `detective`, `transfer_insurance`, `transfer_vendor`, `avoid_change`, `other` |
| `plan_summary` | string | Yes | Max 255 characters |
| `owner_stakeholder_id` | integer | Yes | Must exist in stakeholders table |
| `assignee` | array | No | Array of email addresses or names |
| `assignee.*` | string | No | Max 255 characters each |
| `due_date` | date | Yes | Valid date format (YYYY-MM-DD) |
| `status` | enum | Yes | Valid Status enum value: `new`, `in_progress`, `blocked`, `pending_verification`, `closed`, `cancelled` |
| `expected_residual_level` | string | No | Max 255 characters |
| `result_verification` | enum | No | Valid ResultVerification enum value: `pending`, `passed`, `failed`, `not_applicable` |
| `evidence_link` | string | No | Max 255 characters |
| `linked_capa_id` | string | No | Max 255 characters |
| `closed_at` | date | No | Valid date format (YYYY-MM-DD) |

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "ai_risk_register_id": 1,
    // ... full object
  },
  "message": "AI Risk Treatment created successfully.",
  "error": false
}
```

---

#### 3. Show AI Risk Treatment
**Endpoint:** `GET /api/ai-risk-treatments/{aiRiskTreatment}`

**Description:** Retrieve a specific AI risk treatment by ID.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `aiRiskTreatment` | integer | AI Risk Treatment ID |

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "ai_risk_register_id": 1,
    // ... full object
  },
  "message": "AI Risk Treatment retrieved successfully.",
  "error": false
}
```

---

#### 4. Update AI Risk Treatment
**Endpoint:** `POST /api/ai-risk-treatments/{aiRiskTreatment}`

**Description:** Update an existing AI risk treatment (partial update supported).

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `aiRiskTreatment` | integer | AI Risk Treatment ID |

**Request Body:**
```json
{
  "status": "in_progress",
  "expected_residual_level": "low",
  "result_verification": "manual_review"
}
```

**Validation Rules:** Same as Create, all fields are optional (use `sometimes` rule)

**Response (200):**
```json
{
  "data": null,
  "message": "AI Risk Treatment updated successfully.",
  "error": false
}
```

---

#### 5. Delete AI Risk Treatment
**Endpoint:** `DELETE /api/ai-risk-treatments/{aiRiskTreatment}`

**Description:** Delete an AI risk treatment.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `aiRiskTreatment` | integer | AI Risk Treatment ID |

**Response (200):**
```json
{
  "data": null,
  "message": "AI Risk Treatment deleted successfully.",
  "error": false
}
```

---

## KRI Indicators

### Overview
Manage Key Risk Indicators (KRIs) for monitoring AI model performance and risk metrics.

### Base URL
```
/api/kri-indicators
```

### Endpoints

#### 1. List KRI Indicators
**Endpoint:** `GET /api/kri-indicators`

**Description:** Retrieve a filtered and paginated list of KRI indicators.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Filter by indicator name |
| `status` | string | No | Filter by status: `draft`, `active`, `paused`, `retired` |
| `frequency` | string | No | Filter by monitoring frequency: `quarter_hourly`, `hourly`, `daily`, `weekly` |
| `directionality` | string | No | Filter by directionality: `higher_is_riskier`, `lower_is_riskier` |
| `collection_method` | string | No | Filter by collection method: `scheduled_query`, `stream_aggregation`, `batch_import`, `manual_entry` |
| `action_on_breach` | string | No | Filter by action on breach: `notify_only`, `open_incident`, `escalate_committee`, `trigger_assessment`, `auto_kill_switch` |
| `per_page` | integer | No | Items per page (min: 1, max: 100) |

**Example Request:**
```
GET /api/kri-indicators?status=active&frequency=monthly&per_page=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "ai_risk_register_id": 1,
      "name": "Model Accuracy Degradation",
      "definition": "Tracks percentage decrease in model accuracy compared to baseline",
      "directionality": "lower_is_riskier",
      "unit": "%",
      "sample_window": "Monthly",
      "threshold_warning": 5,
      "threshold_critical": 10,
      "data_source": "Model Performance Dashboard",
      "collection_method": "scheduled_query",
      "frequency": "daily",
      "alert_routing": "risk_team",
      "action_on_breach": "notify_only",
      "status": "active",
      "owner_team": "Data Science",
      "notes": "Track model performance across all demographic groups",
      "organization_id": 1,
      "created_at": "2024-12-09T10:00:00Z",
      "updated_at": "2024-12-09T10:00:00Z"
    }
  ],
  "message": "KRI Indicators retrieved successfully",
  "error": false
}
```

---

#### 2. Create KRI Indicator
**Endpoint:** `POST /api/kri-indicators`

**Description:** Create a new KRI indicator.

**Request Body:**
```json
{
  "ai_risk_register_id": 1,
  "name": "Model Accuracy Degradation",
  "definition": "Tracks percentage decrease in model accuracy compared to baseline",
  "directionality": "lower_is_riskier",
  "unit": "%",
  "sample_window": "Monthly",
  "threshold_warning": 5,
  "threshold_critical": 10,
  "data_source": "Model Performance Dashboard",
  "collection_method": "scheduled_query",
  "frequency": "daily",
  "alert_routing": "risk_team",
  "action_on_breach": "notify_only",
  "status": "active",
  "owner_team": "Data Science",
  "notes": "Track model performance across all demographic groups"
}
```

**Validation Rules:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `ai_risk_register_id` | integer | Yes | Must exist in ai_risk_registers table |
| `name` | string | Yes | Max 255 characters |
| `definition` | string | Yes | Any length text |
| `directionality` | enum | Yes | Valid Directionality enum value: `higher_is_riskier`, `lower_is_riskier` |
| `unit` | string | No | Max 100 characters |
| `sample_window` | string | Yes | Max 100 characters |
| `threshold_warning` | numeric | Yes | Numeric value |
| `threshold_critical` | numeric | Yes | Numeric value |
| `data_source` | string | Yes | Max 255 characters |
| `collection_method` | enum | Yes | Valid CollectionMethod enum value: `scheduled_query`, `stream_aggregation`, `batch_import`, `manual_entry` |
| `frequency` | enum | Yes | Valid Frequency enum value: `quarter_hourly`, `hourly`, `daily`, `weekly` |
| `alert_routing` | enum | Yes | Valid AlertRouting enum value: `risk_team`, `product_ops`, `security_ir`, `privacy_office`, `model_owner`, `on_call` |
| `action_on_breach` | enum | Yes | Valid ActionOnBreach enum value: `notify_only`, `open_incident`, `escalate_committee`, `trigger_assessment`, `auto_kill_switch` |
| `status` | enum | Yes | Valid Status enum value: `draft`, `active`, `paused`, `retired` |
| `owner_team` | string | Yes | Max 255 characters |
| `notes` | string | No | Any length text |

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "ai_risk_register_id": 1,
    // ... full object
  },
  "message": "KRI Indicator created successfully",
  "error": false
}
```

---

#### 3. Show KRI Indicator
**Endpoint:** `GET /api/kri-indicators/{kriIndicator}`

**Description:** Retrieve a specific KRI indicator by ID with related data.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `kriIndicator` | integer | KRI Indicator ID |

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "ai_risk_register_id": 1,
    "name": "Model Accuracy Degradation",
    "definition": "Tracks percentage decrease in model accuracy compared to baseline",
    "directionality": "lower_is_better",
    "unit": "%",
    "sample_window": "Monthly",
    "threshold_warning": 5,
    "threshold_critical": 10,
    "data_source": "Model Performance Dashboard",
    "collection_method": "automated",
    "frequency": "monthly",
    "alert_routing": "risk_team",
    "action_on_breach": "escalate",
    "status": "active",
    "owner_team": "Data Science",
    "notes": "Track model performance across all demographic groups",
    "organization": {
      "id": 1,
      "name": "Organization Name"
    },
    "aiRiskRegister": {
      "id": 1,
      "title": "Model Bias Risk"
    },
    "createdBy": {
      "id": 1,
      "email": "user@example.com"
    },
    "created_at": "2024-12-09T10:00:00Z",
    "updated_at": "2024-12-09T10:00:00Z"
  },
  "message": "KRI Indicator retrieved successfully",
  "error": false
}
```

---

#### 4. Update KRI Indicator
**Endpoint:** `POST /api/kri-indicators/{kriIndicator}`

**Description:** Update an existing KRI indicator (partial update supported).

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `kriIndicator` | integer | KRI Indicator ID |

**Request Body:**
```json
{
  "threshold_warning": 7,
  "threshold_critical": 12,
  "status": "inactive"
}
```

**Validation Rules:** Same as Create, all fields are optional (use `sometimes` rule)

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "ai_risk_register_id": 1,
    // ... updated object
  },
  "message": "KRI Indicator updated successfully",
  "error": false
}
```

---

#### 5. Delete KRI Indicator
**Endpoint:** `DELETE /api/kri-indicators/{kriIndicator}`

**Description:** Delete a KRI indicator.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `kriIndicator` | integer | KRI Indicator ID |

**Response (200):**
```json
{
  "data": null,
  "message": "KRI Indicator deleted successfully",
  "error": false
}
```

---

## Common Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "error": false,
  "message": "Action completed successfully",
  "data": {
    // Response data object or array
  }
}
```

### Error Response
```json
{
  "error": true,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message for field"]
  }
}
```

---

## Error Handling

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Resource created successfully |
| `400` | Bad Request (validation errors) |
| `401` | Unauthorized (missing/invalid authentication) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `422` | Unprocessable Entity (validation failed) |
| `500` | Internal Server Error |

### Validation Error Example
```json
{
  "error": true,
  "message": "Validation failed",
  "errors": {
    "title": ["The title field is required"],
    "risk_level": ["The risk level must be a valid enum value"],
    "ai_model_id": ["The selected ai model id is invalid"]
  }
}
```

### Common Validation Errors
- **Required field missing:** "The [field] field is required"
- **Invalid enum value:** "The [field] must be a valid enum value"
- **Invalid ID reference:** "The selected [field] is invalid"
- **Date format:** "The [field] must be a valid date"
- **String length:** "The [field] may not be greater than [max] characters"
- **Date comparison:** "The [field] date must be after or equal to [comparison_field]"

---

## Authentication

All endpoints require the following header:
```
Authorization: Bearer {supabase_token}
```

Obtain the token after successful Supabase authentication.

---

## Implementation Tips for Frontend

### 1. State Management
Consider storing the following state:
- Current list filters and pagination
- Selected record for detail view
- Form state during create/update operations
- Loading and error states

### 2. Request Interceptor
Attach the authentication token to all requests using an interceptor.

### 3. Error Boundary
Implement error boundaries to catch and display API errors gracefully.

### 4. Form Validation
Validate enum values against the backend:
- **RiskCategory**: `safety`, `privacy`, `bias_fairness`, `security`, `robustness`, `explainability`, `legal_compliance`, `ethics`, `availability`, `resilience`, `vendor`, `cost`, `reputation`, `other`
- **RiskLevel**: `low`, `medium`, `high`, `critical`
- **RiskDecision**: `treat`, `accept`, `transfer`, `avoid`
- **ReviewCadence**: `monthly`, `quarterly`, `semi_annual`, `annual`
- **RiskStatus**: `identified`, `assessed`, `in_treatment`, `accepted`, `transferred`, `closed`
- **TreatmentType**: `corrective`, `preventive`, `detective`, `transfer_insurance`, `transfer_vendor`, `avoid_change`, `other`
- **Treatment Status**: `new`, `in_progress`, `blocked`, `pending_verification`, `closed`, `cancelled`
- **ResultVerification**: `pending`, `passed`, `failed`, `not_applicable`
- **Directionality**: `higher_is_riskier`, `lower_is_riskier`
- **CollectionMethod**: `scheduled_query`, `stream_aggregation`, `batch_import`, `manual_entry`
- **Frequency**: `quarter_hourly`, `hourly`, `daily`, `weekly`
- **AlertRouting**: `risk_team`, `product_ops`, `security_ir`, `privacy_office`, `model_owner`, `on_call`
- **ActionOnBreach**: `notify_only`, `open_incident`, `escalate_committee`, `trigger_assessment`, `auto_kill_switch`
- **KRI Status**: `draft`, `active`, `paused`, `retired`

### 5. Date Handling
- Use ISO 8601 format (YYYY-MM-DD) for all date fields
- Consider timezone handling for date comparisons

### 6. Pagination
- Default `per_page` is 15 for AI Risk Register
- Maximum `per_page` is 100 for filtered endpoints
- Implement cursor or offset-based pagination in your UI

### 7. Relationships
When displaying related data, load relationships:
- AI Risk Register → AI Model, Use Case, Risk Owner
- Risk Methodology → Organization
- AI Risk Treatment → AI Risk Register, Owner Stakeholder
- KRI Indicator → AI Risk Register, Organization, Created By

---

## Example Frontend Implementation Flow

### Creating an AI Risk Register Entry
1. Display form with all required fields
2. Populate dropdown/select fields with enum values
3. Validate form locally before submission
4. POST to `/api/ai-risk-register` with validated data
5. Handle response (success: redirect to list, error: display validation errors)
6. Show toast notification for success/failure

### Listing with Filters
1. Initialize filters state with defaults
2. Fetch list with current filters and pagination
3. Display table with data
4. On filter change: reset pagination to page 1 and refetch
5. On pagination change: fetch with current filters

### Updating a Record
1. Load record detail using GET endpoint
2. Populate form with existing data
3. Allow partial updates (only changed fields)
4. POST with partial data
5. Handle response and update UI

---

## Notes

- All endpoints are behind `auth:supabase` middleware
- Organization ID is automatically set from authenticated user
- Timestamps are returned in ISO 8601 format
- Soft deletes may be implemented (check with backend team)
- Rate limiting may apply (check with backend team)

