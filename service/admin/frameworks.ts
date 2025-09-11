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
        const formData = new FormData();

        // Add all text fields
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'framework_logo' && value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    // Handle array fields by sending each value separately or as JSON
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, String(item));
                    });
                } else if (key === 'is_published') {
                    // Keep is_published as integer (0 or 1)
                    formData.append(key, value.toString());
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Add file if present
        if (data.framework_logo) {
            formData.append('framework_logo', data.framework_logo);
        }

        const response = await api.post<null>(this.baseUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    }

    async updateFramework(id: string | number, data: UpdateFrameworkRequest): Promise<ApiResponse> {
        const formData = new FormData();

        formData.append('_method', 'POST');

        // Add all text fields
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'framework_logo' && value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    // Handle array fields by sending each value separately or as JSON
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, String(item));
                    });
                } else if (key === 'is_published') {
                    // Keep is_published as integer (0 or 1)
                    formData.append(key, value.toString());
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Add file if present
        if (data.framework_logo) {
            formData.append('framework_logo', data.framework_logo);
        }

        const response = await api.post<null>(`${this.baseUrl}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    }
}

export const frameworkService = new FrameworkService();
