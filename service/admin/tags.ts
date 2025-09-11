import { api, ApiResponse } from "@/lib/api";
import { TagsApiRequest } from "@/interfaces/Tags";

// Data type interface
export interface Tag {
  id: string;
  group: string;
  name: string; // ✅ string hai (aapke API response se match karta hai)
  created_at: string;
  updated_at: string;
  user_id?: number;
}

export interface TagsApiResponse {
  data: Tag[];
  message: string;
  error: boolean;
}

// Service class
export class TagsService {
  private baseUrl = "/admin/tags";

  async createTag(tags: TagsApiRequest): Promise<ApiResponse<Tag>> {
    const response = await api.post<Tag>(`${this.baseUrl}`, tags);
    return response;}
  async getTags(search?: string): Promise<ApiResponse<TagsApiResponse>> {
  const query = search ? `?term=${encodeURIComponent(search)}` : "";
  const response = await api.get<TagsApiResponse>(`${this.baseUrl}${query}`);
  return response;
}
}

// export single instance
export const tagsService = new TagsService();
