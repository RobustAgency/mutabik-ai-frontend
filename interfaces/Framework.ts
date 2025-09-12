import { PaginatedResponse } from "./Pagination";

export enum FrameworkType {
  LAW_ACT = "Law/Act",
  REGULATION = "Regulation",
  STANDARD = "Standard",
  FRAMEWORK = "Framework",
  GUIDELINE = "Guideline",
  POLICY_INTERNAL = "Internal Policy",
  SUPERVISORY_NOTICE = "Supervisory Circular/Notice",
  INDUSTRY_CODE = "Industry Code of Conduct",
  CERT_SCHEME = "Certification/Accreditation Scheme",
  CONTRACTUAL = "Contractual/Procurement Rule",
  OTHER = "Other"
}

export enum FrameworkCategory {
  Mandatory = "mandatory",
  Voluntary = "voluntary"
}

export enum AuthorityPublisher {
  // International/standards
  ISO_IEC_JTC1_SC42 = "ISO/IEC JTC 1/SC 42",
  ISO_IEC = "ISO/IEC (general)",
  IEC = "International Electrotechnical Commission",
  IEEE = "IEEE",
  OECD = "OECD",
  UNESCO = "UNESCO",
  COUNCIL_OF_EUROPE = "Council of Europe",

  // EU
  EU_PARLIAMENT_COUNCIL = "EU Parliament & Council",
  EU_COMMISSION = "European Commission",
  EDPB = "European Data Protection Board",
  ENISA = "ENISA (EU Cybersecurity)",
  EBA = "European Banking Authority",
  ESMA = "ESMA",
  EIOPA = "EIOPA",
  ECB = "European Central Bank",

  // US
  NIST = "NIST",
  FTC = "Federal Trade Commission",
  SEC_US = "U.S. SEC",
  FRB = "Federal Reserve Board",
  OCC = "Office of the Comptroller of the Currency",
  FDIC = "FDIC",
  CFPB = "CFPB",
  NTIA = "NTIA",

  // UK
  UK_ICO = "UK ICO",
  UK_FCA = "UK FCA",
  PRA_BOE = "Prudential Regulation Authority (BoE)",
  UK_DSI_ASI = "UK Department for Science & AI Safety Institute",

  // GCC / Middle East
  UAE_DATA_OFFICE = "UAE Data Office",
  CBUAE = "Central Bank of the UAE",
  ADGM_FSRA = "ADGM FSRA",
  DFSA = "DFSA (DIFC)",
  SDAIA_NDMO = "KSA SDAIA / NDMO",
  SAMA = "Saudi Central Bank (SAMA)",
  NCA_KSA = "National Cybersecurity Authority (KSA)",
  CBJ = "Central Bank of Jordan",
  CBB = "Central Bank of Bahrain",
  QCB = "Qatar Central Bank",
  QFCRA = "Qatar Financial Centre Regulatory Authority",
  CBK = "Central Bank of Kuwait",
  CBO = "Central Bank of Oman",

  // APAC / Others
  MAS = "Monetary Authority of Singapore",
  HKMA = "Hong Kong Monetary Authority",
  OSFI = "OSFI (Canada)",
  OAIC_AU = "OAIC (Australia privacy)",
  APRA = "APRA (Australia)",
  OTHER = "Other"
}

export enum BindingLevel {
  BINDING = "Legally Binding",
  CERTIFIABLE = "Certifiable Standard",
  VOLUNTARY = "Voluntary / Best Practice",
  SUPERVISORY_EXPECTATION = "Supervisory Expectation",
  CONTRACTUAL = "Contractual",
  INTERNAL_MANDATORY = "Internal Mandatory",
  NA = "Not Applicable"
}

export enum SectorApplicability {
  CROSS_SECTOR = "Cross-sector",
  BANKING = "Banking",
  CAPITAL_MARKETS = "Capital Markets",
  PAYMENTS_FINTECH = "Payments/FinTech",
  INSURANCE = "Insurance",
  PUBLIC_SECTOR = "Government/Public Sector",
  HEALTHCARE = "Healthcare/Life Sciences",
  EDUCATION = "Education",
  TELECOM = "Telecom",
  RETAIL_ECOM = "Retail/eCommerce",
  ENERGY_UTILITIES = "Energy/Utilities",
  TRANSPORT_LOGISTICS = "Transport/Logistics",
  MANUFACTURING = "Manufacturing",
  DEFENSE_SECURITY = "Defense/Security",
  MEDIA_ADS = "Media/Advertising",
  TECH_PLATFORM = "Technology/Platforms",
  REAL_ESTATE_HOSPITALITY = "Real Estate/Hospitality",
  OTHER = "Other"
}

export enum RiskClassCoverage {
  PROHIBITED = "Prohibited use cases",
  HIGH_RISK = "High-risk",
  LIMITED_RISK = "Limited-risk",
  MINIMAL_RISK = "Minimal/low risk",
  GPAI = "General-Purpose AI (GPAI)",
  GPAI_SYSTEMIC = "GPAI with systemic risk",
  NA = "Not Applicable / Not defined"
}

export enum CertificationAttestation {
  NOTIFIED_BODY_CONFORMITY = "Notified Body Conformity Assessment",
  THIRD_PARTY_CERT = "Third-Party Certification",
  EXTERNAL_ATTEST_ISAE = "External Attestation (e.g., ISAE 3000/SOC-type)",
  INTERNAL_ATTEST = "Internal Attestation",
  SELF_ATTEST = "Self-Attestation",
  REGULATORY_REGISTRATION = "Regulatory Registration/Authorization",
  NONE_REQUIRED = "None required",
  OTHER = "Other"
}

export enum AssessmentMode {
  SELF_ASSESSMENT = "Self-Assessment",
  SECOND_LINE = "2nd Line Review (Risk/Compliance)",
  MODEL_VALIDATION_MRM = "Model Validation (MRM)",
  INTERNAL_AUDIT = "Internal Audit",
  EXTERNAL_AUDIT = "External Audit",
  EXTERNAL_ATTEST = "External Attestation/Assurance",
  THIRD_PARTY_CERT = "Third-Party Certification",
  NOTIFIED_BODY = "Notified Body Review",
  REGULATOR_SUPERVISION = "Regulator/Supervisory Review",
  PEER_REVIEW = "Peer Review",
  OTHER = "Other"
}

export interface Framework {
  id: number;
  name: string;
  code: string;
  type: FrameworkType;
  geography: string;
  category: FrameworkCategory;
  version: string;
  release_date: string;
  is_published: boolean; // Backend returns as boolean, we convert to 0|1 when sending
  description?: string;
  authority_publisher?: AuthorityPublisher;
  binding_level?: BindingLevel;
  sector_applicability?: string; // Backend returns as comma-separated string
  risk_class_coverage?: string; // Backend returns as comma-separated string
  certification_attestation?: string; // Backend returns as comma-separated string
  assessment_mode?: string; // Backend returns as comma-separated string
  user_id: number;
  created_at: string;
  updated_at: string;
  framework_logo_url?: string;
  media?: Array<{
    id: number;
    model_type: string;
    model_id: number;
    uuid: string;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    disk: string;
    conversions_disk: string;
    size: number;
    manipulations: any[];
    custom_properties: any[];
    generated_conversions: any[];
    responsive_images: any[];
    order_column: number;
    created_at: string;
    updated_at: string;
    original_url: string;
    preview_url: string;
  }>;
}

export interface FrameworkFilters extends Record<string, unknown> {
  search?: string;
  geography?: string;
  category?: FrameworkCategory;
  type?: FrameworkType;
  is_published?: 0 | 1;
  page?: number;
  per_page?: number;
}

export interface CreateFrameworkRequest {
  name: string;
  code: string;
  type: FrameworkType;
  geography: string;
  category: FrameworkCategory;
  version: string;
  release_date: string;
  is_published: 0 | 1;
  description?: string;
  authority_publisher?: AuthorityPublisher;
  binding_level?: BindingLevel;
  sector_applicability?: SectorApplicability[];
  risk_class_coverage?: RiskClassCoverage[];
  certification_attestation?: CertificationAttestation[];
  assessment_mode?: AssessmentMode[];
  framework_logo?: File;
}

export interface UpdateFrameworkRequest extends Partial<CreateFrameworkRequest> {
  framework_logo?: File;
}

export interface FrameworksApiResponse {
  data: PaginatedResponse<Framework>;
  status: number;
  message: string;
  error: boolean;
}

export interface FrameworkApiResponse {
  data: Framework;
  status: number;
  message: string;
  error: boolean;
}
