import { api, apiUtils, type ApiResponse } from '@/lib/api';
import type {
    Control,
    ControlFilters,
    CreateControlRequest,
    UpdateControlRequest,
    ControlListResponse,
    ControlSingleResponse
} from '@/interfaces/Control';

export class ControlsService {
    private baseUrl = '/admin/controls';

    async getControls(filters: ControlFilters = {}): Promise<ControlListResponse> {
        try {
            const queryString = apiUtils.createQueryString(filters);
            const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
            const response = await api.get<ControlListResponse['data']>(url);
            return response;
        } catch (error: any) {
            console.error('Error fetching controls:', error);
            return {
                data: {
                    data: [],
                    meta: {
                        current_page: 1,
                        per_page: 10,
                        total: 0,
                        last_page: 1
                    }
                },
                message: error?.response?.data?.message || 'Failed to fetch controls',
                error: true
            };
        }
    }

    async getControl(id: string | number): Promise<ControlSingleResponse> {
        try {
            const response = await api.get<Control>(`${this.baseUrl}/${id}`);
            return response;
        } catch (error: any) {
            console.error('Error fetching control:', error);
            return {
                data: {} as Control,
                message: error?.response?.data?.message || 'Failed to fetch control',
                error: true
            };
        }
    }

    async createControl(data: CreateControlRequest): Promise<ControlSingleResponse> {
        try {
            const response = await api.post<Control>(this.baseUrl, data);
            return response;
        } catch (error: any) {
            console.error('Error creating control:', error);
            return {
                data: {} as Control,
                message: error?.response?.data?.message || 'Failed to create control',
                error: true
            };
        }
    }

    async updateControl(id: string | number, data: UpdateControlRequest): Promise<ControlSingleResponse> {
        try {
            const response = await api.post<Control>(`${this.baseUrl}/${id}`, data);
            return response;
        } catch (error: any) {
            console.error('Error updating control:', error);
            return {
                data: {} as Control,
                message: error?.response?.data?.message || 'Failed to update control',
                error: true
            };
        }
    }
}

export const controlsService = new ControlsService();

export type GetControlsParams = ControlFilters;
