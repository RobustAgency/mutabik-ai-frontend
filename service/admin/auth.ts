
import { api, ApiError } from '@/lib/api';

export interface AdminLoginResponse {
    success: boolean;
    message?: string;
    data?: {
        token?: string;
        user?: {
            id: string;
            email: string;
            role: string;
        };
    };
}

export async function loginAdmin(email: string, password: string): Promise<AdminLoginResponse> {
    try {
        const response = await api.post<{
            token: string;
            user: {
                id: string;
                email: string;
                role: string;
            };
        }>('/auth/login', {
            email,
            password
        });

        if (response.error) {
            return {
                success: false,
                message: response.message || 'Login failed'
            };
        }

        if (response.data?.token) {
            localStorage.setItem('adminToken', response.data.token);
        }

        return {
            success: true,
            message: response.message || 'Login successful',
            data: response.data
        };
    } catch (error) {
        console.error('Admin login error:', error);

        if (error instanceof ApiError) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }

        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}
