import { api, ApiResponse } from "@/lib/api";
import type { Vendor, CreateVendorData, VendorFilters } from "@/interfaces/Vendor";

export interface VendorsApiResponse {
  data: {
    data: Vendor[];
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

export interface VendorApiResponse {
  data: Vendor;
  status: number;
  message: string;
  error: boolean;
}

// Vendor Service
export class VendorService {
  async getVendors(filters?: VendorFilters): Promise<ApiResponse<VendorsApiResponse["data"]>> {
    return api.get("/vendors", { params: filters });
  }

  async getVendor(id: number): Promise<ApiResponse<Vendor>> {
    return api.get(`/vendors/${id}`);
  }

  async createVendor(data: CreateVendorData): Promise<ApiResponse<Vendor>> {
    return api.post("/vendors", data);
  }

  async updateVendor(id: number, data: Partial<CreateVendorData>): Promise<ApiResponse<Vendor>> {
    return api.post(`/vendors/${id}`, data);
  }

  async deleteVendor(id: number): Promise<ApiResponse<null>> {
    return api.delete(`/vendors/${id}`);
  }
}

export const vendorService = new VendorService();

