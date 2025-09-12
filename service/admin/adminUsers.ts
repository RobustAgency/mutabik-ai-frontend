import { api, ApiResponse } from '@/lib/api';
import { User, UsersApiResponse } from '@/interfaces/User';
import { PaginatedResponse } from '@/interfaces/Pagination';

export interface CreateAdminUserRequest {
    name: string;
    email: string;
    role: string;
    password?: string; // Will be set to default "password"
}

export interface SearchUsersParams {
    term?: string;
    page?: number;
    per_page?: number;
}

export interface GetUsersParams {
    page?: number;
    per_page?: number;
}

export class AdminUsersService {
    private basePath = '/admin/users';

    async getUsers(params: GetUsersParams = {}): Promise<PaginatedResponse<User>> {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.per_page) queryParams.append('per_page', params.per_page.toString());

            const response = await api.get<PaginatedResponse<User>>(
                `${this.basePath}${queryParams.toString() ? `?role=admin&${queryParams.toString()}` : ''}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching users from API:', error);
            throw error;
        }
    }

    async searchUsers(params: SearchUsersParams): Promise<User[]> {
        try {
            const queryParams = new URLSearchParams();
            if (params.term) queryParams.append('term', params.term);
            if (params.term) queryParams.append('role', "admin");
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.per_page) queryParams.append('per_page', params.per_page.toString());

            const response = await api.get<User[]>(
                `${this.basePath}/search?${queryParams.toString()}`
            );

            return response.data;
        } catch (error) {
            console.error('Error searching users from API:', error);
            throw error;
        }
    }

    async createAdminUser(userData: CreateAdminUserRequest): Promise<User> {
        try {
            const payload = {
                ...userData,
                password: 'password' // Default password as requested
            };

            const response = await api.post<User>(this.basePath, payload);

            return response.data;
        } catch (error) {
            console.error('Error creating user via API:', error);
            throw error;
        }
    }

    async getUser(userId: number): Promise<User> {
        try {
            const response = await api.get<User>(`${this.basePath}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
}

export const adminUsersService = new AdminUsersService();
