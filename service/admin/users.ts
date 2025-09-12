import { api, apiUtils, type ApiResponse } from '@/lib/api';
import { UserFilters, UsersApiResponse } from '@/interfaces/User';
import { User } from '@/interfaces/User';

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    role?: string;
}

export class UsersService {
    private baseUrl = '/admin/users';

    async getUsers(filters: UserFilters = {}): Promise<UsersApiResponse> {
        const queryString = apiUtils.createQueryString(filters);
        const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
        const response = await api.get<UsersApiResponse['data']>(url);
        return response;
    }

    async getUser(userId: number): Promise<User> {
        try {
            const response = await api.get<User>(`${this.baseUrl}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user from API:', error);
            throw error;
        }
    }

    async updateUser(userId: number, updateData: UpdateUserRequest): Promise<boolean> {
        try {
            const response = await api.post<{ error: boolean, message: string, data: any }>(`${this.baseUrl}/${userId}`, updateData);
            if (response.error === false) {
                return true;
            } else {
                console.error('API returned error:', response.message);
                throw new Error(response.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user via API:', error);
            throw error;
        }
    }

    async deleteUser(userId: number): Promise<boolean> {
        try {
            const response = await api.delete<{ error: boolean, message: string }>(`${this.baseUrl}/${userId}`);
            if (response.error === false) {
                return true;
            } else {
                console.error('API returned error:', response.message);
                throw new Error(response.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user via API:', error);
            throw error;
        }
    }

    async approveUser(userId: string): Promise<ApiResponse<User>> {
        return await api.post<User>(`${this.baseUrl}/${userId}/approve`);
    }

    async rejectUser(userId: string): Promise<ApiResponse<User>> {
        return await api.post<User>(`${this.baseUrl}/${userId}/revoke-approval`);
    }

}

export const usersService = new UsersService();
