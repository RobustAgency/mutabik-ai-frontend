import { api } from '@/lib/api';
import { Organization, OrganizationsApiResponse, OrganizationApiResponse } from '@/interfaces/Organization';
import { PaginatedResponse } from '@/interfaces/Pagination';

export interface SearchOrganizationsParams {
    term?: string;
    page?: number;
    per_page?: number;
    is_active?: boolean;
}

export interface GetOrganizationsParams {
    page?: number;
    per_page?: number;
}

export interface UpdateOrganizationRequest {
    is_active?: boolean;
    name?: string;
    website?: string;
    phone?: string;
    country?: string;
}

export class OrganizationsService {
    private basePath = '/admin/organizations';

    async getOrganizations(params: GetOrganizationsParams = {}): Promise<PaginatedResponse<Organization>> {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.per_page) queryParams.append('per_page', params.per_page.toString());

            const response = await api.get<OrganizationsApiResponse>(
                `${this.basePath}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
            );

            console.log('API response received:', response);

            // The organizations array is directly in response.data.data
            const apiData = response.data.data;

            console.log('apiData:', apiData);

            // apiData is the organizations array itself, not a pagination object
            const safeData = Array.isArray(apiData) ? apiData : [];
            const currentPage = params.page || 1;
            const perPage = params.per_page || 10;
            const total = safeData.length;

            const result = {
                data: safeData,
                page: currentPage,
                limit: perPage,
                total: total,
                totalPages: Math.ceil(total / perPage),
                current_page: currentPage,
                first_page_url: '',
                from: (currentPage - 1) * perPage + 1,
                last_page: Math.ceil(total / perPage),
                last_page_url: '',
                links: [],
                next_page_url: null,
                path: '',
                per_page: perPage,
                prev_page_url: null,
                to: Math.min(currentPage * perPage, total)
            };

            console.log('Service returning:', result);
            return result;
        } catch (error) {
            console.error('Error fetching organizations from API:', error);

            // Return safe fallback data structure instead of throwing
            return {
                data: [],
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
                current_page: 1,
                first_page_url: '',
                from: 0,
                last_page: 1,
                last_page_url: '',
                links: [],
                next_page_url: null,
                path: '',
                per_page: 10,
                prev_page_url: null,
                to: 0
            };
        }
    }

    async searchOrganizations(params: SearchOrganizationsParams): Promise<Organization[]> {
        try {
            const queryParams = new URLSearchParams();
            if (params.term) queryParams.append('term', params.term);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.per_page) queryParams.append('per_page', params.per_page.toString());
            if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

            console.log('Making API search request to:', `${this.basePath}?${queryParams.toString()}`);

            const response = await api.get<OrganizationsApiResponse>(
                `${this.basePath}?${queryParams.toString()}`
            );

            console.log('API search response received:', response);

            // Validate response structure
            if (!response?.data?.data?.data || !Array.isArray(response.data.data.data)) {
                console.error('Invalid search API response structure:', response);
                return [];
            }

            return response.data.data.data;
        } catch (error) {
            console.error('Error searching organizations from API:', error);
            // Return empty array instead of throwing
            return [];
        }
    }

    async getOrganization(organizationId: number): Promise<Organization> {
        try {

            const response = await api.get<Organization>(`${this.basePath}/${organizationId}`);
            console.log('API get organization response received:', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching organization from API:', error);
            throw error;
        }
    }

    async updateOrganization(organizationId: number, updateData: UpdateOrganizationRequest): Promise<boolean> {
        try {
            console.log('Making API request to update organization:', `${this.basePath}/${organizationId}`);
            console.log('Update data:', updateData);

            const response = await api.post<{error: boolean, message: string, data: any}>(`${this.basePath}/${organizationId}`, updateData);

            console.log('API update organization response received:', response);
            
            // Check if the operation was successful based on error flag
            if (response.data.error === false) {
                console.log('Organization updated successfully');
                return true;
            } else {
                console.error('API returned error:', response.data.message);
                throw new Error(response.data.message || 'Failed to update organization');
            }
        } catch (error) {
            console.error('Error updating organization via API:', error);
            throw error;
        }
    }
}

export const organizationsService = new OrganizationsService();
