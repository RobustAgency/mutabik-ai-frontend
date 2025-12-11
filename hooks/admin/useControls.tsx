"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useGetControlsQuery,
  useGetControlQuery,
  useCreateControlMutation,
  useUpdateControlMutation,
} from "@/app/lib/features/controlsApi";
import {
  Control,
  ControlFilters,
  CreateControlRequest,
  UpdateControlRequest,
} from "@/interfaces/Control";

export interface UseControlsResult {
  controls: Control[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refresh: () => Promise<any>;
  handlePageChange: (page: number) => void;
  handleSearch: (search: string) => void;
}

export function useControls(initialFilters?: ControlFilters): UseControlsResult {
  const [filters, setFilters] = useState<ControlFilters>(initialFilters || { page: 1, per_page: 10 });
  const { data, isLoading, error, refetch } = useGetControlsQuery(filters);

  return {
    controls: data?.data || [],
    loading: isLoading,
    error: error ? (error as any)?.data?.message || "Failed to fetch controls" : null,
    pagination: {
      page: data?.meta?.current_page ?? 1,
      limit: data?.meta?.per_page ?? filters?.per_page ?? 10,
      total: data?.meta?.total ?? 0,
      totalPages: data?.meta?.last_page ?? data?.meta?.current_page ?? 1,
    },
    refresh: async () => refetch(),
    handlePageChange: (page: number) => setFilters((prev) => ({ ...(prev || {}), page })),
    handleSearch: (search: string) => setFilters((prev) => ({ ...(prev || {}), search, page: 1 })),
  };
}

export const useControl = (id?: string | number) => {
  const { data, isLoading, error, refetch } = useGetControlQuery(id as string, {
    skip: !id,
  });

  return {
    control: data ?? null,
    loading: isLoading,
    error: error ? (error as any)?.data?.message || "Failed to fetch control" : null,
    refetch,
  };
};

export const useControlMutations = () => {
  const router = useRouter();
  const [createControlMutation, { isLoading: creating }] = useCreateControlMutation();
  const [updateControlMutation, { isLoading: updating }] = useUpdateControlMutation();

  const createControl = async (data: CreateControlRequest): Promise<boolean> => {
    try {
      await createControlMutation(data).unwrap();
      toast.success("Control created successfully");
      router.push("/admin/compliance-library/controls");
      return true;
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to create control";
      toast.error(msg);
      throw err;
    }
  };

  const updateControl = async (id: string | number, data: UpdateControlRequest): Promise<boolean> => {
    try {
      await updateControlMutation({ id, data }).unwrap();
      toast.success("Control updated successfully");
      router.push("/admin/compliance-library/controls");
      return true;
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to update control";
      toast.error(msg);
      throw err;
    }
  };

  return { creating, updating, createControl, updateControl };
};
