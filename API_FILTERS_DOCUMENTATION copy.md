# API Filters Documentation

This document provides comprehensive information about all available filters for index (list) API endpoints. Use this guide to understand what properties and values each filter accepts.

---

## Table of Contents

1. [AI Models](#1-ai-models)
2. [AI Model Versions](#2-ai-model-versions)
3. [AI Model Cards](#3-ai-model-cards)
4. [Use Cases](#4-use-cases)
5. [AI Model Use Cases](#5-ai-model-use-cases)
6. [Stakeholders](#6-stakeholders)
7. [Data Sources](#7-data-sources)
8. [Datasets](#8-datasets)
9. [Data Elements](#9-data-elements)
10. [Dataset Snapshots](#10-dataset-snapshots)
11. [AI Model Datasets](#11-ai-model-datasets)
12. [User Consents](#12-user-consents)
13. [Consent Scopes](#13-consent-scopes)
14. [Consent Coverages](#14-consent-coverages)
15. [Dataset Subject Populations](#15-dataset-subject-populations)
16. [PDP Processing Registers](#16-pdp-processing-registers)
17. [Vendors](#17-vendors)
18. [Agreements](#18-agreements)
19. [AI Assets](#19-ai-assets)
20. [AI Incidents](#20-ai-incidents)
21. [Incident Alerts](#21-incident-alerts)
22. [Incident Actions](#22-incident-actions)
23. [Incident Root Cause Analyses](#23-incident-root-cause-analyses)
24. [Incident Notifications](#24-incident-notifications)
25. [Corrective Preventive Actions](#25-corrective-preventive-actions)
26. [AI Model Artifacts](#26-ai-model-artifacts)
27. [Artifact Access Logs](#27-artifact-access-logs)
28. [AI Risk Register](#28-ai-risk-register)

---

## 1. AI Models

**Endpoint:** `GET /api/ai-models`

### Available Filters

| Filter                           | Type    | Required | Description                        | Valid Values / Constraints                                               |
| -------------------------------- | ------- | -------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `status`                         | string  | No       | Operational status of the AI model | Enum: `not_deployed`, `development`, `testing`, `production`             |
| `ownership_type`                 | string  | No       | Type of ownership                  | Enum: `internal`, `external`, `joint`, `licensed`, `open_source`, `saas` |
| `regulatory_risk_classification` | string  | No       | Regulatory risk classification     | String (max 255 characters)                                              |
| `owner`                          | string  | No       | Owner name or identifier           | String (max 255 characters)                                              |
| `from`                           | date    | No       | Start date filter                  | Date format: `YYYY-MM-DD` (must be before or equal to today)             |
| `to`                             | date    | No       | End date filter                    | Date format: `YYYY-MM-DD` (must be after or equal to `from`)             |
| `per_page`                       | integer | No       | Number of results per page         | Integer (min: 1, max: 100)                                               |

### Example Request

```json
{
    "status": "production",
    "ownership_type": "internal",
    "from": "2024-01-01",
    "to": "2024-12-31",
    "per_page": 20
}
```

---

## 2. AI Model Versions

**Endpoint:** `GET /api/ai-model-versions`

### Available Filters

| Filter              | Type    | Required | Description                    | Valid Values / Constraints                                                                                    |
| ------------------- | ------- | -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `ai_model_id`       | integer | No       | Filter by specific AI model ID | Integer (must exist in `ai_models` table)                                                                     |
| `version_type`      | string  | No       | Type of version                | String (max 50 characters) - e.g., `major`, `minor`, `patch`, `experimental`                                  |
| `from`              | date    | No       | Start date filter              | Date format: `YYYY-MM-DD`                                                                                     |
| `to`                | date    | No       | End date filter                | Date format: `YYYY-MM-DD` (must be after or equal to `from`)                                                  |
| `version_source`    | string  | No       | Source of the version          | String (max 100 characters)                                                                                   |
| `lifecycle_stage`   | string  | No       | Lifecycle stage                | String (max 50 characters) - e.g., `development`, `testing`, `staging`, `production`, `deprecated`, `retired` |
| `version_role`      | string  | No       | Role of the version            | String (max 50 characters)                                                                                    |
| `deployment_status` | string  | No       | Deployment status              | String (max 50 characters) - e.g., `not_deployed`, `deploying`, `deployed`, `failed`, `rollback`              |
| `per_page`          | integer | No       | Number of results per page     | Integer (min: 1, max: 100)                                                                                    |

### Example Request

```json
{
    "ai_model_id": 123,
    "version_type": "major",
    "lifecycle_stage": "production",
    "deployment_status": "deployed",
    "per_page": 25
}
```

---

## 3. AI Model Cards

**Endpoint:** `GET /api/ai-model-cards`

### Available Filters

| Filter               | Type    | Required | Description                | Valid Values / Constraints                                                                   |
| -------------------- | ------- | -------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| `status`             | string  | No       | Card status                | String - e.g., `draft`, `in_review`, `approved`, `published`, `archived`                     |
| `publication_status` | string  | No       | Publication status         | String - e.g., `not_published`, `published_internal`, `published_public`                     |
| `owner`              | string  | No       | Owner name or identifier   | String                                                                                       |
| `from`               | date    | No       | Start date filter          | Date format: `YYYY-MM-DD`                                                                    |
| `to`                 | date    | No       | End date filter            | Date format: `YYYY-MM-DD`                                                                    |
| `creator_role`       | string  | No       | Creator role               | String - e.g., `internal_team`, `vendor_provided`, `community_contributed`, `auto_generated` |
| `format`             | string  | No       | Card format                | String - e.g., `standard`, `regulatory`, `industry_specific`, `custom`                       |
| `per_page`           | integer | No       | Number of results per page | Integer (min: 1, max: 100)                                                                   |

### Example Request

```json
{
    "status": "approved",
    "publication_status": "published_internal",
    "creator_role": "internal_team",
    "per_page": 15
}
```

---

## 4. Use Cases

**Endpoint:** `GET /api/use-cases`

### Available Filters

| Filter            | Type    | Required | Description                | Valid Values / Constraints                                                                                                                                          |
| ----------------- | ------- | -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `risk_level`      | string  | No       | Risk level classification  | String - e.g., `low`, `medium`, `high`, `critical`                                                                                                                  |
| `business_domain` | string  | No       | Business domain            | String - e.g., `customer_service`, `fraud_detection`, `marketing`, `operations`, `risk_management`, `hr`, `finance`, `legal`, `product_development`, `supply_chain` |
| `owner`           | string  | No       | Owner name or identifier   | String                                                                                                                                                              |
| `roi_assessment`  | string  | No       | ROI assessment level       | String - e.g., `High`, `Medium`, `Low`                                                                                                                              |
| `risk_assessment` | string  | No       | Risk assessment level      | String                                                                                                                                                              |
| `data_assessment` | string  | No       | Data assessment status     | String - e.g., `available`, `partially available`, `not available`                                                                                                  |
| `to`              | date    | No       | End date filter            | Date format: `YYYY-MM-DD`                                                                                                                                           |
| `from`            | date    | No       | Start date filter          | Date format: `YYYY-MM-DD` (must be before or equal to `to`)                                                                                                         |
| `status`          | string  | No       | Use case status            | Enum: `draft`, `under_review`, `approved`, `in_development`, `testing`, `staging`, `active`, `suspended`, `deprecated`                                              |
| `per_page`        | integer | No       | Number of results per page | Integer (min: 1, max: 100)                                                                                                                                          |

### Example Request

```json
{
    "risk_level": "high",
    "business_domain": "fraud_detection",
    "status": "active",
    "roi_assessment": "High",
    "per_page": 20
}
```

---

## 5. AI Model Use Cases

**Endpoint:** `GET /api/ai-model-use-cases`

### Available Filters

| Filter        | Type    | Required | Description                    | Valid Values / Constraints                |
| ------------- | ------- | -------- | ------------------------------ | ----------------------------------------- |
| `ai_model_id` | integer | No       | Filter by specific AI model ID | Integer (must exist in `ai_models` table) |
| `per_page`    | integer | No       | Number of results per page     | Integer (min: 1)                          |

### Example Request

```json
{
    "ai_model_id": 123,
    "per_page": 50
}
```

---

## 6. Stakeholders

**Endpoint:** `GET /api/stakeholders`

### Available Filters

| Filter     | Type    | Required | Description                      | Valid Values / Constraints                                                                   |
| ---------- | ------- | -------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| `type`     | string  | No       | Stakeholder type                 | Enum: `person`, `team`, `vendor_org`, `regulator`, `customer_group`, `committee_secretariat` |
| `name`     | string  | No       | Stakeholder name (partial match) | String (max 255 characters)                                                                  |
| `per_page` | integer | No       | Number of results per page       | Integer (min: 1, max: 100)                                                                   |

### Example Request

```json
{
    "type": "person",
    "name": "John",
    "per_page": 30
}
```

---

## 7. Data Sources

**Endpoint:** `GET /api/data-sources`

### Available Filters

| Filter           | Type    | Required | Description                      | Valid Values / Constraints                                                                                                     |
| ---------------- | ------- | -------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `per_page`       | integer | No       | Number of results per page       | Integer (min: 1, max: 100)                                                                                                     |
| `from`           | date    | No       | Start date filter                | Date format: `YYYY-MM-DD`                                                                                                      |
| `to`             | date    | No       | End date filter                  | Date format: `YYYY-MM-DD`                                                                                                      |
| `name`           | string  | No       | Data source name (partial match) | String (max 255 characters)                                                                                                    |
| `system_type`    | string  | No       | System type                      | Enum: `Application DB`, `Data Lake`, `Data Warehouse`, `Operational API`, `Files/Buckets`, `3rd-Party SaaS`, `Streaming/Kafka` |
| `access_method`  | string  | No       | Access method                    | Enum: `JDBC`, `ODBC`, `S3`, `GCS`, `API`, `FTP/SFTP`, `Kafka`, `Other`                                                         |
| `classification` | string  | No       | Data classification              | Enum: `Public`, `Internal`, `Confidential`, `Restricted`                                                                       |

### Example Request

```json
{
    "system_type": "Data Lake",
    "access_method": "S3",
    "classification": "Confidential",
    "per_page": 25
}
```

---

## 8. Datasets

**Endpoint:** `GET /api/datasets`

### Available Filters

| Filter            | Type    | Required | Description                  | Valid Values / Constraints                               |
| ----------------- | ------- | -------- | ---------------------------- | -------------------------------------------------------- |
| `name`            | string  | No       | Dataset name (partial match) | String (max 255 characters)                              |
| `sensitivity`     | string  | No       | Data sensitivity level       | Enum: `Public`, `Internal`, `Confidential`, `Restricted` |
| `contains_pii`    | boolean | No       | Whether dataset contains PII | Boolean: `true` or `false`                               |
| `controller_role` | string  | No       | GDPR controller role         | Enum: `Controller`, `Joint Controller`, `Processor`      |
| `per_page`        | integer | No       | Number of results per page   | Integer (min: 1, max: 100)                               |

### Example Request

```json
{
    "name": "customer",
    "sensitivity": "Confidential",
    "contains_pii": true,
    "controller_role": "Controller",
    "per_page": 20
}
```

---

## 9. Data Elements

**Endpoint:** `GET /api/data-elements`

### Available Filters

| Filter      | Type    | Required | Description                       | Valid Values / Constraints                                                                                                                         |
| ----------- | ------- | -------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `per_page`  | integer | No       | Number of results per page        | Integer (min: 1, max: 100)                                                                                                                         |
| `from`      | date    | No       | Start date filter                 | Date format: `YYYY-MM-DD`                                                                                                                          |
| `to`        | date    | No       | End date filter                   | Date format: `YYYY-MM-DD`                                                                                                                          |
| `name`      | string  | No       | Data element name (partial match) | String (max 255 characters)                                                                                                                        |
| `data_type` | string  | No       | Data type                         | String (max 255 characters) - e.g., `string`, `integer`, `decimal`, `boolean`, `date`, `datetime`, `timestamp`, `json`, `binary`, `array`, `other` |

### Example Request

```json
{
    "name": "email",
    "data_type": "string",
    "from": "2024-01-01",
    "to": "2024-12-31",
    "per_page": 50
}
```

---

## 10. Dataset Snapshots

**Endpoint:** `GET /api/dataset-snapshots`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints                                   |
| ---------- | ------- | -------- | -------------------------- | ------------------------------------------------------------ |
| `per_page` | integer | No       | Number of results per page | Integer (min: 1, max: 100)                                   |
| `from`     | date    | No       | Start date filter          | Date format: `YYYY-MM-DD`                                    |
| `to`       | date    | No       | End date filter            | Date format: `YYYY-MM-DD` (must be after or equal to `from`) |

### Example Request

```json
{
    "from": "2024-01-01",
    "to": "2024-12-31",
    "per_page": 30
}
```

---

## 11. AI Model Datasets

**Endpoint:** `GET /api/ai-model-datasets`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints                                                                                                                      |
| ---------- | ------- | -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `role`     | string  | No       | Dataset role in model      | Enum: `pretrain`, `train`, `fine_tune`, `align_rlhf`, `validation`, `test`, `eval_benchmark`, `rag_corpus`, `drift_baseline`, `online_feedback` |
| `from`     | date    | No       | Start date filter          | Date format: `YYYY-MM-DD` (must be before or equal to today)                                                                                    |
| `to`       | date    | No       | End date filter            | Date format: `YYYY-MM-DD` (must be before or equal to today, and after or equal to `from`)                                                      |
| `per_page` | integer | No       | Number of results per page | Integer (min: 1, max: 100)                                                                                                                      |

### Example Request

```json
{
    "role": "train",
    "from": "2024-01-01",
    "to": "2024-12-31",
    "per_page": 25
}
```

---

## 12. User Consents

**Endpoint:** `GET /api/user-consents`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (min: 1, max: 100) |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 13. Consent Scopes

**Endpoint:** `GET /api/consent-scopes`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (min: 1, max: 100) |

### Example Request

```json
{
    "per_page": 15
}
```

---

## 14. Consent Coverages

**Endpoint:** `GET /api/consent-coverages`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (min: 1, max: 100) |

### Example Request

```json
{
    "per_page": 15
}
```

---

## 15. Dataset Subject Populations

**Endpoint:** `GET /api/dataset-subject-populations`

### Available Filters

| Filter          | Type    | Required | Description                | Valid Values / Constraints                                                                         |
| --------------- | ------- | -------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| `subject_realm` | string  | No       | Subject realm type         | String (max 255 characters) - e.g., `customer`, `prospect`, `employee`, `vendor`, `other`          |
| `jurisdiction`  | string  | No       | Jurisdiction code          | String (max 255 characters) - e.g., `AE`, `EU`, `KSA`, `US`, `UK`, `QA`, `JO`, `MA`, `BH`, `Other` |
| `from`          | date    | No       | Start date filter          | Date format: `YYYY-MM-DD` (must be before or equal to today)                                       |
| `to`            | date    | No       | End date filter            | Date format: `YYYY-MM-DD` (must be before or equal to today, and after or equal to `from`)         |
| `per_page`      | integer | No       | Number of results per page | Integer (min: 1, max: 100)                                                                         |

### Example Request

```json
{
    "subject_realm": "customer",
    "jurisdiction": "EU",
    "from": "2024-01-01",
    "to": "2024-12-31",
    "per_page": 25
}
```

---

## 16. PDP Processing Registers

**Endpoint:** `GET /api/pdp-processing-registers`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 17. Vendors

**Endpoint:** `GET /api/vendors`

### Available Filters

| Filter      | Type    | Required | Description                | Valid Values / Constraints                                                                        |
| ----------- | ------- | -------- | -------------------------- | ------------------------------------------------------------------------------------------------- |
| `risk_tier` | string  | No       | Vendor risk tier           | Enum: `tier_1`, `tier_2`, `tier_3`, `tier_4`                                                      |
| `status`    | string  | No       | Vendor status              | Enum: `evaluating`, `approved`, `conditionally_approved`, `restricted`, `suspended`, `terminated` |
| `owner`     | string  | No       | Owner name or identifier   | String (max 255 characters)                                                                       |
| `from`      | date    | No       | Start date filter          | Date format: `YYYY-MM-DD` (must be before or equal to today)                                      |
| `to`        | date    | No       | End date filter            | Date format: `YYYY-MM-DD` (must be after or equal to `from`)                                      |
| `per_page`  | integer | No       | Number of results per page | Integer (min: 1, max: 100)                                                                        |

### Example Request

```json
{
    "risk_tier": "tier_1",
    "status": "approved",
    "from": "2024-01-01",
    "to": "2024-12-31",
    "per_page": 30
}
```

---

## 18. Agreements

**Endpoint:** `GET /api/agreements`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 19. AI Assets

**Endpoint:** `GET /api/ai-assets`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 20. AI Incidents

**Endpoint:** `GET /api/ai-incidents`

### Available Filters

| Filter     | Type    | Required | Description                    | Valid Values / Constraints                                                                                                   |
| ---------- | ------- | -------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `title`    | string  | No       | Incident title (partial match) | String (max 255 characters)                                                                                                  |
| `status`   | string  | No       | Incident status                | Enum: `open`, `contained`, `monitoring`, `resolved`, `closed`                                                                |
| `severity` | string  | No       | Incident severity              | Enum: `sev1_critical`, `sev2_high`, `sev3_medium`, `sev4_low`, `near_miss`                                                   |
| `stage`    | string  | No       | Incident stage                 | Enum: `ideation`, `conception`, `dev`, `test`, `staging`, `prod`, `retirement`                                               |
| `category` | string  | No       | Incident category              | Enum: `safety`, `privacy`, `security`, `bias_fairness`, `reliability`, `availability`, `legal_compliance`, `vendor`, `other` |
| `from`     | date    | No       | Start date filter              | Date format: `YYYY-MM-DD` (must be before or equal to today)                                                                 |
| `to`       | date    | No       | End date filter                | Date format: `YYYY-MM-DD` (must be before or equal to today, and after or equal to `from`)                                   |
| `per_page` | integer | No       | Number of results per page     | Integer (min: 1, max: 100)                                                                                                   |

### Example Request

```json
{
    "status": "open",
    "severity": "sev1_critical",
    "category": "privacy",
    "from": "2024-01-01",
    "to": "2024-12-31",
    "per_page": 25
}
```

---

## 21. Incident Alerts

**Endpoint:** `GET /api/incident-alerts`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 22. Incident Actions

**Endpoint:** `GET /api/incident-actions`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 23. Incident Root Cause Analyses

**Endpoint:** `GET /api/incident-root-cause-analyses`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 24. Incident Notifications

**Endpoint:** `GET /api/incident-notifications`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 25. Corrective Preventive Actions

**Endpoint:** `GET /api/corrective-preventive-actions`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## 26. AI Model Artifacts

**Endpoint:** `GET /api/ai-model-artifacts`

### Available Filters

| Filter          | Type    | Required | Description                   | Valid Values / Constraints                                                                                          |
| --------------- | ------- | -------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `artifact_type` | string  | No       | Type of artifact              | Enum: `model_binary`, `tokenizer`, `prompt_pack`, `index`, `feature_store_export`, `config`, `docker_image`, `sbom` |
| `name`          | string  | No       | Artifact name (partial match) | String (max 255 characters)                                                                                         |
| `per_page`      | integer | No       | Number of results per page    | Integer (min: 1, max: 100)                                                                                          |

### Example Request

```json
{
    "artifact_type": "model_binary",
    "name": "v1.0",
    "per_page": 30
}
```

---

## 27. Artifact Access Logs

**Endpoint:** `GET /api/artifact-access-logs`

### Available Filters

| Filter                    | Type    | Required | Description                | Valid Values / Constraints                         |
| ------------------------- | ------- | -------- | -------------------------- | -------------------------------------------------- |
| `artifact_id`             | integer | No       | Filter by artifact ID      | Integer (must exist in `ai_model_artifacts` table) |
| `accessor_stakeholder_id` | integer | No       | Filter by stakeholder ID   | Integer (must exist in `stakeholders` table)       |
| `action`                  | string  | No       | Access action type         | Enum: `read`, `write`, `delete`                    |
| `context`                 | string  | No       | Access context             | Enum: `ci_cd`, `notebook`, `console`, `api`        |
| `per_page`                | integer | No       | Number of results per page | Integer (min: 1, max: 100)                         |

### Example Request

```json
{
    "artifact_id": 123,
    "accessor_stakeholder_id": 456,
    "action": "read",
    "context": "api",
    "per_page": 50
}
```

---

## 28. AI Risk Register

**Endpoint:** `GET /api/ai-risk-register`

### Available Filters

| Filter     | Type    | Required | Description                | Valid Values / Constraints |
| ---------- | ------- | -------- | -------------------------- | -------------------------- |
| `per_page` | integer | No       | Number of results per page | Integer (default: 15)      |

### Example Request

```json
{
    "per_page": 20
}
```

---

## General Notes

### Date Format

All date filters use the format: `YYYY-MM-DD` (e.g., `2024-01-15`)

### Pagination

-   Most endpoints support `per_page` parameter
-   Default `per_page` is usually 15 (unless specified otherwise)
-   Minimum value: 1
-   Maximum value: 100 (for most endpoints)

### Filter Behavior

-   All filters are **optional** unless marked as required
-   String filters typically support partial matching (e.g., `name` filters)
-   Date range filters (`from` and `to`) are inclusive
-   When using date ranges, `to` must be greater than or equal to `from`

### Query String Format

Filters should be sent as query parameters in the URL:

```
GET /api/ai-models?status=production&ownership_type=internal&per_page=20
```

### JSON Body Format

Some endpoints may accept filters in the request body (check endpoint-specific documentation), but typically filters are sent as query parameters.

---

## Quick Reference: Enum Values

### Operational Status

-   `not_deployed`
-   `development`
-   `testing`
-   `production`

### Ownership Type

-   `internal`
-   `external`
-   `joint`
-   `licensed`
-   `open_source`
-   `saas`

### Use Case Status

-   `draft`
-   `under_review`
-   `approved`
-   `in_development`
-   `testing`
-   `staging`
-   `active`
-   `suspended`
-   `deprecated`

### AI Model Dataset Role

-   `pretrain`
-   `train`
-   `fine_tune`
-   `align_rlhf`
-   `validation`
-   `test`
-   `eval_benchmark`
-   `rag_corpus`
-   `drift_baseline`
-   `online_feedback`

### Stakeholder Type

-   `person`
-   `team`
-   `vendor_org`
-   `regulator`
-   `customer_group`
-   `committee_secretariat`

### Data Source System Type

-   `Application DB`
-   `Data Lake`
-   `Data Warehouse`
-   `Operational API`
-   `Files/Buckets`
-   `3rd-Party SaaS`
-   `Streaming/Kafka`

### Data Source Access Method

-   `JDBC`
-   `ODBC`
-   `S3`
-   `GCS`
-   `API`
-   `FTP/SFTP`
-   `Kafka`
-   `Other`

### Data Classification / Sensitivity

-   `Public`
-   `Internal`
-   `Confidential`
-   `Restricted`

### Dataset Controller Role

-   `Controller`
-   `Joint Controller`
-   `Processor`

### Vendor Risk Tier

-   `tier_1`
-   `tier_2`
-   `tier_3`
-   `tier_4`

### Vendor Status

-   `evaluating`
-   `approved`
-   `conditionally_approved`
-   `restricted`
-   `suspended`
-   `terminated`

### AI Incident Status

-   `open`
-   `contained`
-   `monitoring`
-   `resolved`
-   `closed`

### AI Incident Severity

-   `sev1_critical`
-   `sev2_high`
-   `sev3_medium`
-   `sev4_low`
-   `near_miss`

### AI Incident Stage

-   `ideation`
-   `conception`
-   `dev`
-   `test`
-   `staging`
-   `prod`
-   `retirement`

### AI Incident Category

-   `safety`
-   `privacy`
-   `security`
-   `bias_fairness`
-   `reliability`
-   `availability`
-   `legal_compliance`
-   `vendor`
-   `other`

### Artifact Type

-   `model_binary`
-   `tokenizer`
-   `prompt_pack`
-   `index`
-   `feature_store_export`
-   `config`
-   `docker_image`
-   `sbom`

### Artifact Access Action

-   `read`
-   `write`
-   `delete`

### Artifact Access Context

-   `ci_cd`
-   `notebook`
-   `console`
-   `api`

---

## Support

For questions or clarifications about API filters, please refer to:

-   API endpoint documentation
-   Postman collection: `postman_collection.json`
-   Contact the backend development team

---

**Last Updated:** 2025-01-XX
**API Version:** Compatible with current Laravel API
