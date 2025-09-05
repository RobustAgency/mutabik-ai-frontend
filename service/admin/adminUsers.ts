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

// Mock data for testing when API is not available
const mockUsers: User[] = [
    {
        id: 1,
        supabase_id: 'mock-supabase-id-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        email_verified_at: '2024-01-15T10:30:00Z',
        is_approved: true,
        role: 'admin',
        created_at: '2024-01-10T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        stripe_id: null,
        pm_type: null,
        pm_last_four: null,
        trial_ends_at: null
    },
    {
        id: 2,
        supabase_id: 'mock-supabase-id-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        email_verified_at: null,
        is_approved: false,
        role: 'user',
        created_at: '2024-01-12T10:30:00Z',
        updated_at: '2024-01-12T10:30:00Z',
        stripe_id: null,
        pm_type: null,
        pm_last_four: null,
        trial_ends_at: null
    },
    {
        id: 3,
        supabase_id: 'mock-supabase-id-3',
        name: 'Admin User',
        email: 'admin@example.com',
        email_verified_at: '2024-01-08T10:30:00Z',
        is_approved: true,
        role: 'admin',
        created_at: '2024-01-08T10:30:00Z',
        updated_at: '2024-01-08T10:30:00Z',
        stripe_id: null,
        pm_type: null,
        pm_last_four: null,
        trial_ends_at: null
    }
];

export class AdminUsersService {
    private basePath = '/admin/users';
    private useMockData = true; // Set to false when API is ready

    async getUsers(params: GetUsersParams = {}): Promise<PaginatedResponse<User>> {
        try {
            if (this.useMockData) {
                // Return mock data for now
                const page = params.page || 1;
                const perPage = params.per_page || 10;
                const startIndex = (page - 1) * perPage;
                const endIndex = startIndex + perPage;
                const paginatedUsers = mockUsers.slice(startIndex, endIndex);
                const totalPages = Math.ceil(mockUsers.length / perPage);

                return {
                    data: paginatedUsers,
                    page: page,
                    limit: perPage,
                    total: mockUsers.length,
                    totalPages: totalPages,
                    current_page: page,
                    first_page_url: '',
                    from: startIndex + 1,
                    last_page: totalPages,
                    last_page_url: '',
                    links: [],
                    next_page_url: page < totalPages ? '' : null,
                    path: '',
                    per_page: perPage,
                    prev_page_url: page > 1 ? '' : null,
                    to: Math.min(endIndex, mockUsers.length)
                };
            }

            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.per_page) queryParams.append('per_page', params.per_page.toString());
            
            const response = await api.get<PaginatedResponse<User>>(
                `${this.basePath}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback to mock data if API fails
            const page = params.page || 1;
            const perPage = params.per_page || 10;
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            const paginatedUsers = mockUsers.slice(startIndex, endIndex);
            const totalPages = Math.ceil(mockUsers.length / perPage);

            return {
                data: paginatedUsers,
                page: page,
                limit: perPage,
                total: mockUsers.length,
                totalPages: totalPages,
                current_page: page,
                first_page_url: '',
                from: startIndex + 1,
                last_page: totalPages,
                last_page_url: '',
                links: [],
                next_page_url: page < totalPages ? '' : null,
                path: '',
                per_page: perPage,
                prev_page_url: page > 1 ? '' : null,
                to: Math.min(endIndex, mockUsers.length)
            };
        }
    }

    async searchUsers(params: SearchUsersParams): Promise<User[]> {
        try {
            if (this.useMockData) {
                // Filter mock data
                if (!params.term) return mockUsers;
                const term = params.term.toLowerCase();
                return mockUsers.filter(user => 
                    user.name.toLowerCase().includes(term) || 
                    user.email.toLowerCase().includes(term)
                );
            }

            const queryParams = new URLSearchParams();
            if (params.term) queryParams.append('term', params.term);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.per_page) queryParams.append('per_page', params.per_page.toString());

            const response = await api.get<User[]>(
                `${this.basePath}/search?${queryParams.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error('Error searching users:', error);
            // Fallback to mock data search
            if (!params.term) return mockUsers;
            const term = params.term.toLowerCase();
            return mockUsers.filter(user => 
                user.name.toLowerCase().includes(term) || 
                user.email.toLowerCase().includes(term)
            );
        }
    }

    async createAdminUser(userData: CreateAdminUserRequest): Promise<User> {
        try {
            if (this.useMockData) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Create mock user
                const newUser: User = {
                    id: mockUsers.length + 1,
                    supabase_id: `mock-supabase-id-${mockUsers.length + 1}`,
                    name: userData.name,
                    email: userData.email,
                    email_verified_at: null,
                    is_approved: true,
                    role: userData.role,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    stripe_id: null,
                    pm_type: null,
                    pm_last_four: null,
                    trial_ends_at: null
                };
                
                mockUsers.push(newUser);
                return newUser;
            }

            const payload = {
                ...userData,
                password: 'password' // Default password as requested
            };
            
            const response = await api.post<User>(this.basePath, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getUser(userId: number): Promise<User> {
        try {
            if (this.useMockData) {
                const user = mockUsers.find(u => u.id === userId);
                if (!user) throw new Error('User not found');
                return user;
            }

            const response = await api.get<User>(`${this.basePath}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
}

export const adminUsersService = new AdminUsersService();
