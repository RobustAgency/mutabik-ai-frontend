/**
 * Filter Configuration System
 * Defines filter configurations for all API endpoints
 */

export type FilterType =
  | "select" // Single select dropdown
  | "multiselect" // Multiple selection (array)
  | "text" // Text input
  | "date" // Date picker
  | "daterange" // Date range (from/to)
  | "boolean"; // Boolean checkbox

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[]; // For select/multiselect
  placeholder?: string;
  maxLength?: number; // For text inputs
  dateConstraints?: {
    maxDate?: Date;
    minDate?: Date;
    disableFuture?: boolean;
    disablePast?: boolean;
  };
}

export interface FilterConfig {
  [key: string]: FilterFieldConfig;
}

// Enum values from API documentation
export const ENUM_VALUES = {
  operationalStatus: [
    { value: "not_deployed", label: "Not Deployed" },
    { value: "development", label: "Development" },
    { value: "testing", label: "Testing" },
    { value: "production", label: "Production" },
  ],
  ownershipType: [
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },
    { value: "joint", label: "Joint" },
    { value: "licensed", label: "Licensed" },
    { value: "open_source", label: "Open Source" },
    { value: "saas", label: "SaaS" },
  ],
  regulatoryRiskClassification: [
    { value: "minimal_risk", label: "Minimal Risk" },
    { value: "limited_risk", label: "Limited Risk" },
    { value: "high_risk", label: "High Risk" },
    { value: "unacceptable_risk", label: "Unacceptable Risk" },
    { value: "sector_specific", label: "Sector Specific" },
  ],
  useCaseStatus: [
    { value: "draft", label: "Draft" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "in_development", label: "In Development" },
    { value: "testing", label: "Testing" },
    { value: "staging", label: "Staging" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "deprecated", label: "Deprecated" },
  ],
  riskLevel: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ],
  businessDomain: [
    { value: "customer_service", label: "Customer Service" },
    { value: "fraud_detection", label: "Fraud Detection" },
    { value: "marketing", label: "Marketing" },
    { value: "operations", label: "Operations" },
    { value: "risk_management", label: "Risk Management" },
    { value: "hr", label: "HR" },
    { value: "finance", label: "Finance" },
    { value: "legal", label: "Legal" },
    { value: "product_development", label: "Product Development" },
    { value: "supply_chain", label: "Supply Chain" },
  ],
  dataSensitivity: [
    { value: "Public", label: "Public" },
    { value: "Internal", label: "Internal" },
    { value: "Confidential", label: "Confidential" },
    { value: "Restricted", label: "Restricted" },
  ],
  controllerRole: [
    { value: "Controller", label: "Controller" },
    { value: "Joint Controller", label: "Joint Controller" },
    { value: "Processor", label: "Processor" },
  ],
  stakeholderType: [
    { value: "person", label: "Person" },
    { value: "team", label: "Team" },
    { value: "vendor_org", label: "Vendor Org" },
    { value: "regulator", label: "Regulator" },
    { value: "customer_group", label: "Customer Group" },
    { value: "committee_secretariat", label: "Committee Secretariat" },
  ],
  systemType: [
    { value: "Application DB", label: "Application DB" },
    { value: "Data Lake", label: "Data Lake" },
    { value: "Data Warehouse", label: "Data Warehouse" },
    { value: "Operational API", label: "Operational API" },
    { value: "Files/Buckets", label: "Files/Buckets" },
    { value: "3rd-Party SaaS", label: "3rd-Party SaaS" },
    { value: "Streaming/Kafka", label: "Streaming/Kafka" },
  ],
  accessMethod: [
    { value: "JDBC", label: "JDBC" },
    { value: "ODBC", label: "ODBC" },
    { value: "S3", label: "S3" },
    { value: "GCS", label: "GCS" },
    { value: "API", label: "API" },
    { value: "FTP/SFTP", label: "FTP/SFTP" },
    { value: "Kafka", label: "Kafka" },
    { value: "Other", label: "Other" },
  ],
  vendorRiskTier: [
    { value: "tier_1", label: "Tier 1" },
    { value: "tier_2", label: "Tier 2" },
    { value: "tier_3", label: "Tier 3" },
    { value: "tier_4", label: "Tier 4" },
  ],
  vendorStatus: [
    { value: "evaluating", label: "Evaluating" },
    { value: "approved", label: "Approved" },
    { value: "conditionally_approved", label: "Conditionally Approved" },
    { value: "restricted", label: "Restricted" },
    { value: "suspended", label: "Suspended" },
    { value: "terminated", label: "Terminated" },
  ],
  incidentStatus: [
    { value: "open", label: "Open" },
    { value: "contained", label: "Contained" },
    { value: "monitoring", label: "Monitoring" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ],
  incidentSeverity: [
    { value: "sev1_critical", label: "SEV1 Critical" },
    { value: "sev2_high", label: "SEV2 High" },
    { value: "sev3_medium", label: "SEV3 Medium" },
    { value: "sev4_low", label: "SEV4 Low" },
    { value: "near_miss", label: "Near Miss" },
  ],
  incidentStage: [
    { value: "ideation", label: "Ideation" },
    { value: "conception", label: "Conception" },
    { value: "dev", label: "Dev" },
    { value: "test", label: "Test" },
    { value: "staging", label: "Staging" },
    { value: "prod", label: "Prod" },
    { value: "retirement", label: "Retirement" },
  ],
  incidentCategory: [
    { value: "safety", label: "Safety" },
    { value: "privacy", label: "Privacy" },
    { value: "security", label: "Security" },
    { value: "bias_fairness", label: "Bias & Fairness" },
    { value: "reliability", label: "Reliability" },
    { value: "availability", label: "Availability" },
    { value: "legal_compliance", label: "Legal Compliance" },
    { value: "vendor", label: "Vendor" },
    { value: "other", label: "Other" },
  ],
  artifactType: [
    { value: "model_binary", label: "Model Binary" },
    { value: "tokenizer", label: "Tokenizer" },
    { value: "prompt_pack", label: "Prompt Pack" },
    { value: "index", label: "Index" },
    { value: "feature_store_export", label: "Feature Store Export" },
    { value: "config", label: "Config" },
    { value: "docker_image", label: "Docker Image" },
    { value: "sbom", label: "SBOM" },
  ],
};

// Filter configurations for each API
export const FILTER_CONFIGS: Record<string, FilterConfig> = {
  "ai-models": {
    status: {
      key: "status",
      label: "Status",
      type: "select",
      options: ENUM_VALUES.operationalStatus,
    },
    ownership_type: {
      key: "ownership_type",
      label: "Ownership Type",
      type: "select",
      options: ENUM_VALUES.ownershipType,
    },
    regulatory_risk_classification: {
      key: "regulatory_risk_classification",
      label: "Regulatory Risk Classification",
      type: "text",
      placeholder: "Enter classification",
      maxLength: 255,
    },
    owner: {
      key: "owner",
      label: "Owner",
      type: "text",
      placeholder: "Enter owner name",
      maxLength: 255,
    },
    from: {
      key: "from",
      label: "From Date",
      type: "date",
      dateConstraints: {
        disableFuture: true,
      },
    },
    to: {
      key: "to",
      label: "To Date",
      type: "date",
      dateConstraints: {
        disableFuture: true,
      },
    },
  },
  "use-cases": {
    risk_level: {
      key: "risk_level",
      label: "Risk Level",
      type: "multiselect",
      options: ENUM_VALUES.riskLevel,
    },
    status: {
      key: "status",
      label: "Status",
      type: "multiselect",
      options: ENUM_VALUES.useCaseStatus,
    },
    business_domain: {
      key: "business_domain",
      label: "Business Domain",
      type: "multiselect",
      options: ENUM_VALUES.businessDomain,
    },
    owner: {
      key: "owner",
      label: "Owner",
      type: "text",
      placeholder: "Enter owner name",
    },
    roi_assessment: {
      key: "roi_assessment",
      label: "ROI Assessment",
      type: "text",
      placeholder: "Enter ROI assessment",
    },
    risk_assessment: {
      key: "risk_assessment",
      label: "Risk Assessment",
      type: "text",
      placeholder: "Enter risk assessment",
    },
    data_assessment: {
      key: "data_assessment",
      label: "Data Assessment",
      type: "text",
      placeholder: "Enter data assessment",
    },
    from: {
      key: "from",
      label: "From Date",
      type: "date",
    },
    to: {
      key: "to",
      label: "To Date",
      type: "date",
    },
  },
  datasets: {
    name: {
      key: "name",
      label: "Name",
      type: "text",
      placeholder: "Search by name",
      maxLength: 255,
    },
    sensitivity: {
      key: "sensitivity",
      label: "Sensitivity",
      type: "select",
      options: ENUM_VALUES.dataSensitivity,
    },
    contains_pii: {
      key: "contains_pii",
      label: "Contains PII",
      type: "boolean",
    },
    controller_role: {
      key: "controller_role",
      label: "Controller Role",
      type: "select",
      options: ENUM_VALUES.controllerRole,
    },
  },
  "data-sources": {
    name: {
      key: "name",
      label: "Name",
      type: "text",
      placeholder: "Search by name",
      maxLength: 255,
    },
    system_type: {
      key: "system_type",
      label: "System Type",
      type: "select",
      options: ENUM_VALUES.systemType,
    },
    access_method: {
      key: "access_method",
      label: "Access Method",
      type: "select",
      options: ENUM_VALUES.accessMethod,
    },
    classification: {
      key: "classification",
      label: "Classification",
      type: "select",
      options: ENUM_VALUES.dataSensitivity,
    },
    from: {
      key: "from",
      label: "From Date",
      type: "date",
    },
    to: {
      key: "to",
      label: "To Date",
      type: "date",
    },
  },
  stakeholders: {
    type: {
      key: "type",
      label: "Type",
      type: "select",
      options: ENUM_VALUES.stakeholderType,
    },
    name: {
      key: "name",
      label: "Name",
      type: "text",
      placeholder: "Search by name",
      maxLength: 255,
    },
  },
  vendors: {
    risk_tier: {
      key: "risk_tier",
      label: "Risk Tier",
      type: "select",
      options: ENUM_VALUES.vendorRiskTier,
    },
    status: {
      key: "status",
      label: "Status",
      type: "select",
      options: ENUM_VALUES.vendorStatus,
    },
    owner: {
      key: "owner",
      label: "Owner",
      type: "text",
      placeholder: "Enter owner name",
      maxLength: 255,
    },
    from: {
      key: "from",
      label: "From Date",
      type: "date",
      dateConstraints: {
        disableFuture: true,
      },
    },
    to: {
      key: "to",
      label: "To Date",
      type: "date",
      dateConstraints: {
        disableFuture: true,
      },
    },
  },
  "ai-incidents": {
    title: {
      key: "title",
      label: "Title",
      type: "text",
      placeholder: "Search by title",
      maxLength: 255,
    },
    status: {
      key: "status",
      label: "Status",
      type: "select",
      options: ENUM_VALUES.incidentStatus,
    },
    severity: {
      key: "severity",
      label: "Severity",
      type: "select",
      options: ENUM_VALUES.incidentSeverity,
    },
    stage: {
      key: "stage",
      label: "Stage",
      type: "select",
      options: ENUM_VALUES.incidentStage,
    },
    category: {
      key: "category",
      label: "Category",
      type: "select",
      options: ENUM_VALUES.incidentCategory,
    },
    from: {
      key: "from",
      label: "From Date",
      type: "date",
      dateConstraints: {
        disableFuture: true,
      },
    },
    to: {
      key: "to",
      label: "To Date",
      type: "date",
      dateConstraints: {
        disableFuture: true,
      },
    },
  },
  "ai-model-artifacts": {
    artifact_type: {
      key: "artifact_type",
      label: "Artifact Type",
      type: "select",
      options: ENUM_VALUES.artifactType,
    },
    name: {
      key: "name",
      label: "Name",
      type: "text",
      placeholder: "Search by name",
      maxLength: 255,
    },
  },
};
