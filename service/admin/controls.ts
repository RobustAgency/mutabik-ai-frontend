import { api, apiUtils, type ApiResponse } from '@/lib/api';
import type {
    Control,
    ControlFilters,
    CreateControlRequest,
    UpdateControlRequest,
    ControlsApiResponse,
    ControlApiResponse
} from '@/interfaces/Control';

export class ControlsService {
    private baseUrl = '/admin/controls';

    async getControls(filters: ControlFilters = {}): Promise<ControlsApiResponse> {
        try {
            const queryString = apiUtils.createQueryString(filters);
            const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
            const response = await api.get<ControlsApiResponse['data']>(url);
            return response;
        } catch (error: any) {
            console.error('Error fetching controls:', error);
            return {
                data: {
                    data: [],
                    current_page: 1,
                    page: 1,
                    limit: 10,
                    last_page: 1,
                    totalPages: 1,
                    per_page: 10,
                    total: 0,
                    from: 0,
                    to: 0,
                    first_page_url: '',
                    last_page_url: '',
                    next_page_url: null,
                    prev_page_url: null,
                    path: '',
                    links: []
                },
                status: error?.response?.status || 500,
                message: error?.response?.data?.message || 'Failed to fetch controls',
                error: true
            };
        }
    }

    async getControl(id: string | number): Promise<ControlApiResponse> {
        try {
            const response = await api.get<Control>(`${this.baseUrl}/${id}`);
            return response;
        } catch (error: any) {
            console.error('Error fetching control:', error);
            return {
                data: {} as Control,
                status: error?.response?.status || 500,
                message: error?.response?.data?.message || 'Failed to fetch control',
                error: true
            };
        }
    }

    async createControl(data: CreateControlRequest): Promise<ControlApiResponse> {
        try {
            const response = await api.post<Control>(this.baseUrl, data);
            return response;
        } catch (error: any) {
            console.error('Error creating control:', error);
            return {
                data: {} as Control,
                status: error?.response?.status || 500,
                message: error?.response?.data?.message || 'Failed to create control',
                error: true
            };
        }
    }

    async updateControl(id: string | number, data: UpdateControlRequest): Promise<ControlApiResponse> {
        try {
            const response = await api.post<Control>(`${this.baseUrl}/${id}`, data);
            return response;
        } catch (error: any) {
            console.error('Error updating control:', error);
            return {
                data: {} as Control,
                status: error?.response?.status || 500,
                message: error?.response?.data?.message || 'Failed to update control',
                error: true
            };
        }
    }
}

export const controlsService = new ControlsService();

export type GetControlsParams = ControlFilters;
