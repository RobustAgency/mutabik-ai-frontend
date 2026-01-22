/**
 * Shared RTK Query Base Query and Types
 * 
 * This file contains the common base query and types used across all RTK Query API slices.
 * It eliminates duplication of axiosBaseQuery and error handling logic.
 */

import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosRequestConfig, AxiosError } from "axios";
import { apiClient, ApiError } from "@/lib/api";

/**
 * Custom Axios-based base query for RTK Query
 * Wraps the existing apiClient with proper error handling
 */
export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      // Handle ApiError (from our custom interceptor)
      if (axiosError instanceof ApiError) {
        const error = {
          status: axiosError.status,
          data: axiosError.data || {
            message: axiosError.message,
            error: true,
          },
        };
        return { error };
      }

      // Handle AxiosError (standard axios errors)
      const err = axiosError as AxiosError<{
        data?: unknown;
        message?: string;
        error?: boolean;
        errors?: Record<string, string[]>;
      }>;

      const error = {
        status: err.response?.status || 500,
        data: err.response?.data || {
          message: err.message || "An error occurred",
          error: true,
        },
      };

      return {
        error,
      };
    }
  };

/**
 * Type for RTK Query mutation errors
 * Provides type safety when handling errors in onQueryStarted
 */
export interface MutationError {
  error?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

/**
 * Standard pagination metadata structure
 */
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

/**
 * Extract error message from mutation error
 * @param error - The error from RTK Query mutation
 * @param defaultMessage - Default message if none found
 * @returns Extracted error message
 */
export const extractErrorMessage = (
  error: any,
  defaultMessage: string = "An error occurred"
): string => {
  return error?.error?.data?.message || error?.data?.message || defaultMessage;
};

/**
 * Check if error contains validation errors
 * @param error - The error from RTK Query mutation
 * @returns True if validation errors exist
 */
export const hasValidationErrors = (error: any): boolean => {
  return Boolean(error?.error?.data?.errors || error?.data?.errors);
};

/**
 * Extract validation errors from mutation error
 * @param error - The error from RTK Query mutation
 * @returns Validation errors object or null
 */
export const extractValidationErrors = (
  error: any
): Record<string, string[]> | null => {
  return error?.error?.data?.errors || error?.data?.errors || null;
};

