export interface Vendor {
  id: number;
  organization_id: number;
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "tier_1" | "tier_2" | "tier_3" | "tier_4";
  status: "evaluating" | "approved" | "conditionally_approved" | "restricted" | "suspended" | "terminated";
  stakeholder_id: number | null;
  stakeholder?: {
    id: number;
    display_name: string;
    legal_name: string;
    email: string;
  };
  primary_contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role?: string;
    primary?: boolean;
  }>;
  metadata: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorFilters {
  search?: string;
  risk_tier?: "tier_1" | "tier_2" | "tier_3" | "tier_4";
  status?: "evaluating" | "approved" | "conditionally_approved" | "restricted" | "suspended" | "terminated";
  page?: number;
  per_page?: number;
}

export interface CreateVendorData {
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "tier_1" | "tier_2" | "tier_3" | "tier_4";
  status: "evaluating" | "approved" | "conditionally_approved" | "restricted" | "suspended" | "terminated";
  stakeholder_id: number | null;
  primary_contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role?: string;
    primary?: boolean;
  }>;
  metadata?: Record<string, unknown>;
  notes?: string | null;
}

