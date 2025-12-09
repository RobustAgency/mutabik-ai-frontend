/**
 * KRI Indicator Service
 * Handles API calls for KRI indicator management
 */

import { api, ApiResponse } from "@/lib/api";
import {
  KriIndicator,
  CreateKriIndicatorData,
  UpdateKriIndicatorData,
  KriIndicatorFilters,
} from "@/interfaces/KriIndicator";

/**
 * Get all KRI indicators with optional filters
 */
export const getKriIndicators = async (
  filters?: KriIndicatorFilters
): Promise<ApiResponse<KriIndicator[]>> => {
  return api.get("/kri-indicators", { params: filters });
};

/**
 * Get a single KRI indicator by ID
 */
export const getKriIndicatorById = async (
  id: number
): Promise<ApiResponse<KriIndicator>> => {
  return api.get(`/kri-indicators/${id}`);
};

/**
 * Create a new KRI indicator
 */
export const createKriIndicator = async (
  data: CreateKriIndicatorData
): Promise<ApiResponse<KriIndicator>> => {
  return api.post("/kri-indicators", data);
};

/**
 * Update an existing KRI indicator
 */
export const updateKriIndicator = async (
  id: number,
  data: UpdateKriIndicatorData
): Promise<ApiResponse<KriIndicator>> => {
  return api.post(`/kri-indicators/${id}`, data);
};

/**
 * Delete a KRI indicator
 */
export const deleteKriIndicator = async (
  id: number
): Promise<ApiResponse<null>> => {
  return api.delete(`/kri-indicators/${id}`);
};

