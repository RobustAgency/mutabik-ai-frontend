"use client";

import { useEffect, useState } from "react";
import { tagsService, Tag } from "@/service/admin/tags";
import { toast } from "react-toastify";
import { ApiResponse } from "@/lib/api";

interface TagsApiResponse {
  data: Tag[];
  message: string;
  error: boolean;
}

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(""); // 👈 add search state

  const fetchTags = async (query: string = ""): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // ✅ backend ko query send karo
      const response: ApiResponse<TagsApiResponse> = await tagsService.getTags(query);
      console.log("response", response);

      if (Array.isArray(response?.data?.data)) {
        setTags(response.data.data);
      } else {
        setTags([]);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch tags. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // search change hone par backend fetch
  useEffect(() => {
    fetchTags(search);
  }, [search]);

  return { tags, loading, error, refetch: fetchTags, setSearch };
};
