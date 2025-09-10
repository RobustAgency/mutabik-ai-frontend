import { api, apiUtils, type ApiResponse } from '@/lib/api';
import {
    Requirement,
    RequirementFilters,
    RequirementsApiResponse,
    RequirementApiResponse,
    CreateRequirementRequest,
    UpdateRequirementRequest
} from '@/interfaces/Requirement';

export class RequirementService {
    private baseUrl = '/admin/requirements';

    async getRequirements(filters: RequirementFilters = {}): Promise<RequirementsApiResponse> {
        const queryString = apiUtils.createQueryString(filters);
        const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
        const response = await api.get<RequirementsApiResponse['data']>(url);
        return response;
    }

    async getRequirement(id: string | number): Promise<RequirementApiResponse> {
        const response = await api.get<Requirement>(`${this.baseUrl}/${id}`);
        return response;
    }

    async createRequirement(data: CreateRequirementRequest): Promise<ApiResponse> {
        const response = await api.post<null>(this.baseUrl, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response;
    }

    async updateRequirement(id: string | number, data: UpdateRequirementRequest): Promise<ApiResponse> {
        const response = await api.post<null>(`${this.baseUrl}/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response;
    }
}

export const requirementService = new RequirementService();
