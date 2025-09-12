import { api } from '@/lib/api'
import type { CreateTagRequest, TagsListResponse } from '@/interfaces/Tag'
import type { ApiResponse } from '@/lib/api'

export interface GetTagsParams {
    page?: number
    per_page?: number
    search?: string
}

export class TagsService {
    private baseUrl = '/admin/tags'

    async getTags(params: GetTagsParams = {}): Promise<TagsListResponse> {
        const queryParams = new URLSearchParams()

        if (params.page) queryParams.append('page', params.page.toString())
        if (params.per_page) queryParams.append('per_page', params.per_page.toString())
        if (params.search) queryParams.append('term', params.search)

        const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl
        const response = await api.get<TagsListResponse>(url)
        return response.data
    }

    async createTags(data: CreateTagRequest): Promise<void> {
        await api.post<ApiResponse<null>>(this.baseUrl, data)
    }
}

export const tagsService = new TagsService()