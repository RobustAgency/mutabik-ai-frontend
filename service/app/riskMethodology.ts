/**
 * Risk Methodology Service
 * Handles API calls for risk methodology management
 */

import { api, ApiResponse } from "@/lib/api";
import {
  RiskMethodology,
  CreateRiskMethodologyData,
  UpdateRiskMethodologyData,
  RiskMethodologyFilters,
} from "@/interfaces/RiskMethodology";

/**
 * Get all risk methodologies with optional filters
 */
export const getRiskMethodologies = async (
  filters?: RiskMethodologyFilters
): Promise<ApiResponse<RiskMethodology[]>> => {
  return api.get("/risk-methodologies", { params: filters });
};

/**
 * Get a single risk methodology by ID
 */
export const getRiskMethodologyById = async (
  id: number
): Promise<ApiResponse<RiskMethodology>> => {
  return api.get(`/risk-methodologies/${id}`);
};

/**
 * Create a new risk methodology
 */
export const createRiskMethodology = async (
  data: CreateRiskMethodologyData
): Promise<ApiResponse<RiskMethodology>> => {
  return api.post("/risk-methodologies", data);
};

/**
 * Update an existing risk methodology
 */
export const updateRiskMethodology = async (
  id: number,
  data: UpdateRiskMethodologyData
): Promise<ApiResponse<RiskMethodology>> => {
  return api.post(`/risk-methodologies/${id}`, data);
};

/**
 * Delete a risk methodology
 */
export const deleteRiskMethodology = async (
  id: number
): Promise<ApiResponse<null>> => {
  return api.delete(`/risk-methodologies/${id}`);
};

