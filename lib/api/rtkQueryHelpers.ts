/**
 * RTK Query Helper Functions
 * 
 * Shared utilities to reduce duplication across API slices.
 * Provides common patterns for transforms, tags, and toast notifications.
 */

import { toast } from "react-toastify";
import { MutationError, PaginationMeta, hasValidationErrors } from "./rtkQueryBase";

/**
 * Pagination metadata structure for meta-based responses
 */
export interface ListMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
}

/**
 * Generic list response structure (meta-based pattern)
 */
export interface ListResponseWithMeta<T> {
  error?: boolean;
  message?: string;
  data?: {
    data?: T[];
    meta?: ListMeta;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
}

/**
 * Generic list response structure (pagination-based pattern)
 */
export interface ListResponseWithPagination<T> {
  error?: boolean;
  message?: string;
  data?: {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

/**
 * Generic single item response structure
 */
export interface SingleItemResponse<T> {
  error?: boolean;
  message?: string;
  data?: T;
}

/**
 * Normalizes pagination metadata from response
 * Handles both meta object and flat structure
 */
export function normaliseMeta<T extends ListMeta>(
  payload?: ListResponseWithMeta<unknown>["data"]
): T {
  if (!payload) {
    return {
      current_page: 1,
      per_page: 0,
      total: 0,
      last_page: 1,
    } as T;
  }

  if (payload.meta) {
    return {
      current_page: payload.meta.current_page ?? 1,
      per_page: payload.meta.per_page ?? 0,
      total: payload.meta.total ?? 0,
      last_page: payload.meta.last_page ?? payload.meta.current_page ?? 1,
    } as T;
  }

  return {
    current_page: payload.current_page ?? 1,
    per_page: payload.per_page ?? 0,
    total: payload.total ?? 0,
    last_page: payload.last_page ?? payload.current_page ?? 1,
  } as T;
}

/**
 * Transforms list response using meta-based pattern
 * Returns { data: T[], meta: ListMeta }
 */
export function transformListResponseWithMeta<T>(
  response: ListResponseWithMeta<T>
): { data: T[]; meta: ListMeta } {
  const list = response?.data?.data ?? [];
  const meta = normaliseMeta(response?.data);
  return { data: list, meta };
}

/**
 * Transforms list response using pagination-based pattern
 * Returns { data: T[], pagination: PaginationMeta }
 */
export function transformListResponseWithPagination<T>(
  response: ListResponseWithPagination<T>
): { data: T[]; pagination: PaginationMeta } {
  if (response.data?.data && Array.isArray(response.data.data)) {
    return {
      data: response.data.data,
      pagination: {
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total,
        last_page: response.data.last_page,
        from: response.data.from,
        to: response.data.to,
      },
    };
  }
  return {
    data: [],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0,
    },
  };
}

/**
 * Response structure for pagination pattern where from/to need to be calculated
 */
export interface ListResponseWithCalculatedPagination<T> {
  error?: boolean;
  message?: string;
  data?: {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

/**
 * Transforms list response using pagination pattern with calculated from/to
 * Returns { data: T[], pagination?: PaginationMeta }
 */
export function transformListResponseWithCalculatedPagination<T>(
  response: ListResponseWithCalculatedPagination<T>
): { data: T[]; pagination?: PaginationMeta } {
  if (response.data?.data && Array.isArray(response.data.data)) {
    const { current_page, per_page, total, last_page } = response.data;
    const from = (current_page - 1) * per_page + 1;
    const to = Math.min(current_page * per_page, total);
    return {
      data: response.data.data,
      pagination: {
        current_page,
        per_page,
        total,
        last_page,
        from,
        to,
      },
    };
  }
  return { data: [] };
}

/**
 * Transforms single item response
 */
export function transformSingleItemResponse<T>(
  response: SingleItemResponse<T>
): T {
  return (response?.data as T) ?? (response as unknown as T);
}

/**
 * Creates providesTags for list queries
 */
export function createListTags<T extends { id: string | number }>(
  result: { data: T[] } | undefined,
  tagType: string,
  listTagId: string = "LIST"
) {
  if (!result) {
    return [{ type: tagType as any, id: listTagId }];
  }
  return [
    ...result.data.map((item) => ({ type: tagType as any, id: item.id })),
    { type: tagType as any, id: listTagId },
  ];
}

/**
 * Creates providesTags for single item queries
 * Returns a function that matches RTK Query's providesTags signature
 */
export function createItemTags(tagType: string) {
  return (_result: unknown, _error: unknown, id: string | number) => {
    return [{ type: tagType as any, id: String(id) }];
  };
}

/**
 * Creates invalidatesTags for create mutations
 */
export function createInvalidateListTags(tagType: string, listTagId: string = "LIST") {
  return [{ type: tagType as any, id: listTagId }];
}

/**
 * Creates invalidatesTags for update/delete mutations
 * Returns a function that matches RTK Query's invalidatesTags signature
 */
export function createInvalidateItemAndListTags(
  tagType: string,
  listTagId: string = "LIST"
) {
  return (_result: unknown, _error: unknown, arg: { id: string | number } | string | number) => {
    const id = typeof arg === "object" && arg !== null && "id" in arg ? arg.id : arg;
    return [
      { type: tagType as any, id: String(id) },
      { type: tagType as any, id: listTagId },
    ];
  };
}

/**
 * Creates onQueryStarted handler for mutations with toast notifications
 * Note: toast is imported in this file and captured in the closure
 */
export function createMutationToastHandler(
  successMessage: string,
  errorMessage: string
) {
  return async (_arg: unknown, { queryFulfilled }: any) => {
    try {
      await queryFulfilled;
      toast.success(successMessage);
    } catch (error) {
      if (!hasValidationErrors(error)) {
        const mutationError = error as MutationError;
        const message =
          mutationError?.error?.data?.message || errorMessage;
        toast.error(message);
      }
    }
  };
}

/**
 * Creates onQueryStarted handler for delete mutations
 * Note: toast is imported in this file and captured in the closure
 */
export function createDeleteToastHandler(
  successMessage: string,
  errorMessage: string
) {
  return async (_arg: unknown, { queryFulfilled }: any) => {
    try {
      await queryFulfilled;
      toast.success(successMessage);
    } catch (error) {
      const mutationError = error as MutationError;
      const message =
        mutationError?.error?.data?.message || errorMessage;
      toast.error(message);
    }
  };
}

