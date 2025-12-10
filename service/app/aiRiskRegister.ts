/**
 * AI Risk Register Service
 * Handles API calls for AI risk register management
 */

import { api, ApiResponse } from "@/lib/api";
import {
  AiRiskRegister,
  CreateAiRiskRegisterData,
  UpdateAiRiskRegisterData,
  AiRiskRegisterFilters,
} from "@/interfaces/AiRiskRegister";

/**
 * Get all AI risk registers with optional filters
 */
export const getAiRiskRegisters = async (
  filters?: AiRiskRegisterFilters
): Promise<
  ApiResponse<{
    data: AiRiskRegister[];
    meta: { current_page: number; per_page: number; total: number };
  }>
> => {
  return api.get("/ai-risk-register", { params: filters });
};

/**
 * Get a single AI risk register by ID
 */
export const getAiRiskRegisterById = async (
  id: number
): Promise<ApiResponse<AiRiskRegister>> => {
  return api.get(`/ai-risk-register/${id}`);
};

/**
 * Create a new AI risk register
 */
export const createAiRiskRegister = async (
  data: CreateAiRiskRegisterData
): Promise<ApiResponse<AiRiskRegister>> => {
  return api.post("/ai-risk-register", data);
};

/**
 * Update an existing AI risk register
 */
export const updateAiRiskRegister = async (
  id: number,
  data: UpdateAiRiskRegisterData
): Promise<ApiResponse<AiRiskRegister>> => {
  return api.post(`/ai-risk-register/${id}`, data);
};

/**
 * Delete an AI risk register
 */
export const deleteAiRiskRegister = async (
  id: number
): Promise<ApiResponse<null>> => {
  return api.delete(`/ai-risk-register/${id}`);
};

