/**
 * AI Risk Treatment Service
 * Handles API calls for AI risk treatment management
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AiRiskTreatment,
  CreateAiRiskTreatmentData,
  UpdateAiRiskTreatmentData,
  AiRiskTreatmentFilters,
} from "@/interfaces/AiRiskTreatment";

/**
 * Get all AI risk treatments with optional filters
 */
export const getAiRiskTreatments = async (
  filters?: AiRiskTreatmentFilters
): Promise<ApiResponse<AiRiskTreatment[]>> => {
  return api.get("/ai-risk-treatments", { params: filters });
};

/**
 * Get a single AI risk treatment by ID
 */
export const getAiRiskTreatmentById = async (
  id: number
): Promise<ApiResponse<AiRiskTreatment>> => {
  return api.get(`/ai-risk-treatments/${id}`);
};

/**
 * Create a new AI risk treatment
 */
export const createAiRiskTreatment = async (
  data: CreateAiRiskTreatmentData
): Promise<ApiResponse<AiRiskTreatment>> => {
  return api.post("/ai-risk-treatments", data);
};

/**
 * Update an existing AI risk treatment
 */
export const updateAiRiskTreatment = async (
  id: number,
  data: UpdateAiRiskTreatmentData
): Promise<ApiResponse<AiRiskTreatment>> => {
  return api.post(`/ai-risk-treatments/${id}`, data);
};

/**
 * Delete an AI risk treatment
 */
export const deleteAiRiskTreatment = async (
  id: number
): Promise<ApiResponse<null>> => {
  return api.delete(`/ai-risk-treatments/${id}`);
};

