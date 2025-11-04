export interface Vendor {
  id: number;
  organization_id: number;
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4";
  status: "active" | "inactive" | "pending" | "suspended";
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
  }>;
  metadata: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorFilters {
  search?: string;
  risk_tier?: "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4";
  status?: "active" | "inactive" | "pending" | "suspended";
  page?: number;
  per_page?: number;
}

export interface CreateVendorData {
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4";
  status: "active" | "inactive" | "pending" | "suspended";
  stakeholder_id: number | null;
  primary_contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role?: string;
  }>;
  metadata?: Record<string, unknown>;
  notes?: string | null;
}

