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
  dataType: [
    { value: "string", label: "String" },
    { value: "integer", label: "Integer" },
    { value: "decimal", label: "Decimal" },
    { value: "boolean", label: "Boolean" },
    { value: "date", label: "Date" },
    { value: "datetime", label: "DateTime" },
    { value: "timestamp", label: "Timestamp" },
    { value: "json", label: "JSON" },
    { value: "binary", label: "Binary" },
    { value: "array", label: "Array" },
    { value: "other", label: "Other" },
  ],
  subjectRealm: [
    { value: "customer", label: "Customer" },
    { value: "prospect", label: "Prospect" },
    { value: "employee", label: "Employee" },
    { value: "vendor", label: "Vendor" },
    { value: "other", label: "Other" },
  ],
  jurisdiction: [
    { value: "AE", label: "AE" },
    { value: "EU", label: "EU" },
    { value: "KSA", label: "KSA" },
    { value: "US", label: "US" },
    { value: "UK", label: "UK" },
    { value: "QA", label: "QA" },
    { value: "JO", label: "JO" },
    { value: "MA", label: "MA" },
    { value: "BH", label: "BH" },
    { value: "Other", label: "Other" },
  ],
  incidentAlertSourceType: [
    { value: "kri", label: "KRI" },
    { value: "monitoring_rule", label: "Monitoring Rule" },
    { value: "human_report", label: "Human Report" },
    { value: "vendor_notice", label: "Vendor Notice" },
    { value: "security_tool", label: "Security Tool" },
    { value: "other", label: "Other" },
  ],
  incidentActionType: [
    { value: "kill_switch", label: "Kill Switch" },
    { value: "rollback_release", label: "Rollback Release" },
    { value: "key_rotation", label: "Key Rotation" },
    { value: "blocklist_update", label: "Blocklist Update" },
    { value: "traffic_throttle", label: "Traffic Throttle" },
    { value: "model_disable_tool", label: "Model Disable Tool" },
    { value: "policy_change", label: "Policy Change" },
    { value: "communication", label: "Communication" },
    { value: "data_purge", label: "Data Purge" },
    { value: "other", label: "Other" },
  ],
  rcaMethod: [
    { value: "5_whys", label: "5 Whys" },
    { value: "fishbone", label: "Fishbone" },
    { value: "timeline_analysis", label: "Timeline Analysis" },
    { value: "fault_tree", label: "Fault Tree" },
    { value: "other", label: "Other" },
  ],
  notificationAudienceType: [
    { value: "internal_exec", label: "Internal Exec" },
    { value: "internal_staff", label: "Internal Staff" },
    { value: "customers", label: "Customers" },
    { value: "regulator", label: "Regulator" },
    { value: "vendor", label: "Vendor" },
    { value: "media", label: "Media" },
    { value: "other", label: "Other" },
  ],
  notificationChannel: [
    { value: "email", label: "Email" },
    { value: "portal", label: "Portal" },
    { value: "status_page", label: "Status Page" },
    { value: "phone", label: "Phone" },
    { value: "meeting", label: "Meeting" },
    { value: "legal_letter", label: "Legal Letter" },
    { value: "other", label: "Other" },
  ],
  capaStatus: [
    { value: "new", label: "New" },
    { value: "in_progress", label: "In Progress" },
    { value: "blocked", label: "Blocked" },
    { value: "pending_verification", label: "Pending Verification" },
    { value: "closed", label: "Closed" },
  ],
  capaSourceType: [
    { value: "incident", label: "Incident" },
    { value: "risk", label: "Risk" },
    { value: "feedback", label: "Feedback" },
    { value: "override", label: "Override" },
    { value: "audit", label: "Audit" },
    { value: "assessment", label: "Assessment" },
    { value: "other", label: "Other" },
  ],
  capaPriority: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ],
  versionType: [
    { value: "major", label: "Major" },
    { value: "minor", label: "Minor" },
    { value: "patch", label: "Patch" },
    { value: "experimental", label: "Experimental" },
  ],
  lifecycleStage: [
    { value: "development", label: "Development" },
    { value: "testing", label: "Testing" },
    { value: "staging", label: "Staging" },
    { value: "production", label: "Production" },
    { value: "deprecated", label: "Deprecated" },
    { value: "retired", label: "Retired" },
  ],
  deploymentStatus: [
    { value: "not_deployed", label: "Not Deployed" },
    { value: "deploying", label: "Deploying" },
    { value: "deployed", label: "Deployed" },
    { value: "failed", label: "Failed" },
    { value: "rollback", label: "Rollback" },
  ],
  cardStatus: [
    { value: "draft", label: "Draft" },
    { value: "in_review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ],
  publicationStatus: [
    { value: "not_published", label: "Not Published" },
    { value: "published_internal", label: "Published Internal" },
    { value: "published_public", label: "Published Public" },
  ],
  creatorRole: [
    { value: "internal_team", label: "Internal Team" },
    { value: "vendor_provided", label: "Vendor Provided" },
    { value: "community_contributed", label: "Community Contributed" },
    { value: "auto_generated", label: "Auto Generated" },
  ],
  cardFormat: [
    { value: "standard", label: "Standard" },
    { value: "regulatory", label: "Regulatory" },
    { value: "industry_specific", label: "Industry Specific" },
    { value: "custom", label: "Custom" },
  ],
  datasetRole: [
    { value: "pretrain", label: "Pretrain" },
    { value: "train", label: "Train" },
    { value: "fine_tune", label: "Fine Tune" },
    { value: "align_rlhf", label: "Align RLHF" },
    { value: "validation", label: "Validation" },
    { value: "test", label: "Test" },
    { value: "eval_benchmark", label: "Eval Benchmark" },
    { value: "rag_corpus", label: "RAG Corpus" },
    { value: "drift_baseline", label: "Drift Baseline" },
    { value: "online_feedback", label: "Online Feedback" },
  ],
  artifactAccessAction: [
    { value: "read", label: "Read" },
    { value: "write", label: "Write" },
    { value: "delete", label: "Delete" },
  ],
  artifactAccessContext: [
    { value: "ci_cd", label: "CI/CD" },
    { value: "notebook", label: "Notebook" },
    { value: "console", label: "Console" },
    { value: "api", label: "API" },
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
  "data-elements": {
    name: {
      key: "name",
      label: "Name",
      type: "text",
      placeholder: "Search by name",
      maxLength: 255,
    },
    data_type: {
      key: "data_type",
      label: "Data Type",
      type: "select",
      options: ENUM_VALUES.dataType,
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
  "dataset-subject-populations": {
    subject_realm: {
      key: "subject_realm",
      label: "Subject Realm",
      type: "select",
      options: ENUM_VALUES.subjectRealm,
    },
    jurisdiction: {
      key: "jurisdiction",
      label: "Jurisdiction",
      type: "select",
      options: ENUM_VALUES.jurisdiction,
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
  "user-consents": {
    consent_status: {
      key: "consent_status",
      label: "Consent Status",
      type: "text",
      placeholder: "Enter consent status",
      maxLength: 255,
    },
    legal_basis: {
      key: "legal_basis",
      label: "Legal Basis",
      type: "text",
      placeholder: "Enter legal basis",
      maxLength: 255,
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
  "incident-alerts": {
    source_type: {
      key: "source_type",
      label: "Source Type",
      type: "select",
      options: ENUM_VALUES.incidentAlertSourceType,
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
  "incident-actions": {
    action_type: {
      key: "action_type",
      label: "Action Type",
      type: "select",
      options: ENUM_VALUES.incidentActionType,
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
  "incident-root-cause-analyses": {
    rca_method: {
      key: "rca_method",
      label: "RCA Method",
      type: "select",
      options: ENUM_VALUES.rcaMethod,
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
  "incident-notifications": {
    audience_type: {
      key: "audience_type",
      label: "Audience Type",
      type: "select",
      options: ENUM_VALUES.notificationAudienceType,
    },
    channel: {
      key: "channel",
      label: "Channel",
      type: "select",
      options: ENUM_VALUES.notificationChannel,
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
  "corrective-preventive-actions": {
    status: {
      key: "status",
      label: "Status",
      type: "select",
      options: ENUM_VALUES.capaStatus,
    },
    source_type: {
      key: "source_type",
      label: "Source Type",
      type: "select",
      options: ENUM_VALUES.capaSourceType,
    },
    priority: {
      key: "priority",
      label: "Priority",
      type: "select",
      options: ENUM_VALUES.capaPriority,
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
  "ai-model-versions": {
    version_type: {
      key: "version_type",
      label: "Version Type",
      type: "select",
      options: ENUM_VALUES.versionType,
    },
    lifecycle_stage: {
      key: "lifecycle_stage",
      label: "Lifecycle Stage",
      type: "select",
      options: ENUM_VALUES.lifecycleStage,
    },
    deployment_status: {
      key: "deployment_status",
      label: "Deployment Status",
      type: "select",
      options: ENUM_VALUES.deploymentStatus,
    },
    version_source: {
      key: "version_source",
      label: "Version Source",
      type: "text",
      placeholder: "Enter version source",
      maxLength: 100,
    },
    version_role: {
      key: "version_role",
      label: "Version Role",
      type: "text",
      placeholder: "Enter version role",
      maxLength: 50,
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
  "ai-model-cards": {
    status: {
      key: "status",
      label: "Status",
      type: "select",
      options: ENUM_VALUES.cardStatus,
    },
    publication_status: {
      key: "publication_status",
      label: "Publication Status",
      type: "select",
      options: ENUM_VALUES.publicationStatus,
    },
    owner: {
      key: "owner",
      label: "Owner",
      type: "text",
      placeholder: "Enter owner name",
    },
    creator_role: {
      key: "creator_role",
      label: "Creator Role",
      type: "select",
      options: ENUM_VALUES.creatorRole,
    },
    format: {
      key: "format",
      label: "Format",
      type: "select",
      options: ENUM_VALUES.cardFormat,
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
  "ai-model-use-cases": {
    // Only ai_model_id filter - this is typically used in detail views, not in the main list
    // We'll skip this as it's not a typical filter for the list view
  },
  "dataset-snapshots": {
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
  "ai-model-datasets": {
    role: {
      key: "role",
      label: "Role",
      type: "select",
      options: ENUM_VALUES.datasetRole,
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
  "artifact-access-logs": {
    action: {
      key: "action",
      label: "Action",
      type: "select",
      options: ENUM_VALUES.artifactAccessAction,
    },
    context: {
      key: "context",
      label: "Context",
      type: "select",
      options: ENUM_VALUES.artifactAccessContext,
    },
  },
};
