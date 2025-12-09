import { api, ApiResponse } from "@/lib/api";

export type AgreementType =
  | "msa"
  | "dpa"
  | "order_form"
  | "addendum"
  | "sla"
  | "other";

export type AgreementStatus = "draft" | "active" | "lapsed" | "terminated";
export type TrainingOptOut = "yes" | "no" | "not_applicable";
export type AuditRights = "yes" | "no" | "limited";
export type TransferMechanism =
  | "adequacy"
  | "sccs"
  | "bcrs"
  | "dpa_addendum"
  | "derogation"
  | "none";

export interface SlaTerms {
  availability_target_pct?: number;
  latency_p95_ms?: number;
  support_tier?: "standard" | "premium" | "enterprise" | string;
  breach_definition?: string;
  credit_schedule_ref?: string;
  monitoring_ref?: string;
}

export interface Agreement {
  id: number;
  organization_id: number;
  vendor_id: number;
  agreement_type: AgreementType;
  status: AgreementStatus;
  effective_from: string;
  effective_to: string;
  training_opt_out?: TrainingOptOut | null;
  audit_rights?: AuditRights | null;
  transfer_mechanism?: TransferMechanism | null;
  sla_terms?: SlaTerms | null;
  doc_ref: string;
  created_at: string;
  updated_at: string;
}

export interface AgreementFilters {
  page?: number;
  per_page?: number;
  vendor_id?: number;
}

export interface CreateAgreementData {
  vendor_id: number;
  agreement_type: AgreementType;
  status: AgreementStatus;
  effective_from: string;
  effective_to: string;
  training_opt_out?: TrainingOptOut | null;
  audit_rights?: AuditRights | null;
  transfer_mechanism?: TransferMechanism | null;
  sla_terms?: SlaTerms | null;
  doc_ref: string;
}

export interface AgreementsApiResponse {
  data: {
    data: Agreement[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  status: number;
  message: string;
  error: boolean;
}

export interface AgreementApiResponse {
  data: Agreement;
  message: string;
  error: boolean;
}

export class AgreementService {
  async getAgreements(filters?: AgreementFilters): Promise<ApiResponse<AgreementsApiResponse["data"]>> {
    return api.get("/agreements", { params: filters });
  }

  async getAgreement(id: number): Promise<ApiResponse<Agreement>> {
    return api.get(`/agreements/${id}`);
  }

  async createAgreement(data: CreateAgreementData): Promise<ApiResponse<Agreement>> {
    return api.post("/agreements", data);
  }

  async updateAgreement(id: number, data: Partial<CreateAgreementData>): Promise<ApiResponse<Agreement>> {
    return api.post(`/agreements/${id}`, data);
  }

  async deleteAgreement(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/agreements/${id}`);
  }
}

export const agreementService = new AgreementService();


