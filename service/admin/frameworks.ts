import { api, apiUtils, type ApiResponse } from '@/lib/api';
import {
    Framework,
    FrameworkFilters,
    FrameworksApiResponse,
    FrameworkApiResponse,
    CreateFrameworkRequest,
    UpdateFrameworkRequest
} from '@/interfaces/Framework';

export class FrameworkService {
    private baseUrl = '/admin/frameworks';

    async getFrameworks(filters: FrameworkFilters = {}): Promise<FrameworksApiResponse> {
        const queryString = apiUtils.createQueryString(filters);
        const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
        const response = await api.get<FrameworksApiResponse['data']>(url);
        return response;
    }

    async getFramework(id: string | number): Promise<FrameworkApiResponse> {
        const response = await api.get<Framework>(`${this.baseUrl}/${id}`);
        return response;
    }

    async createFramework(data: CreateFrameworkRequest): Promise<ApiResponse> {
        const response = await api.post<null>(this.baseUrl, data);
        return response;
    }

    async updateFramework(id: string | number, data: UpdateFrameworkRequest): Promise<ApiResponse> {
        const response = await api.post<null>(`${this.baseUrl}/${id}`, data);
        return response;
    }
}

export const frameworkService = new FrameworkService();
