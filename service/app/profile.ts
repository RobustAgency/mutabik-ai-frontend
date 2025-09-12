import { api, type ApiResponse } from '@/lib/api';

export interface Profile {
    id: number;
    name?: string | null;
    email: string;
    organization_id?: number | null;
    is_organization_active?: boolean | null;
    full_name?: string | null;
    role?: string | null;
    avatar_url?: string | null;
    plan_id?: number | null;
    has_payment_method?: boolean | null;
    created_at?: string;
    updated_at?: string;
}

export interface ProfileResponse {
    error: boolean;
    message: string;
    data: Profile;
}

export interface ProfileResult {
    success: boolean;
    data: Profile | null;
    error: boolean;
    errorCode?: number;
    message?: string;
}

export class ProfileService {
    private baseUrl = '/profile';

    async getProfile(): Promise<ProfileResult> {
        try {
            const response: ApiResponse<Profile> = await api.get(this.baseUrl);
            console.log("Profile API response:", response);

            if (response.error) {
                return {
                    success: false,
                    data: null,
                    error: true,
                    errorCode: 400,
                    message: response.message
                };
            }
            
            return {
                success: true,
                data: response.data,
                error: false
            };
        } catch (error: any) {
            if (error?.status === 403) {
                return {
                    success: false,
                    data: null,
                    error: true,
                    errorCode: 403,
                    message: error.message || 'Account not approved'
                };
            }

            return {
                success: false,
                data: null,
                error: true,
                errorCode: error?.status || 500,
                message: error?.message || 'An unexpected error occurred'
            };
        }
    }

}

export const profileService = new ProfileService();

export async function fetchProfile(): Promise<ProfileResult> {
    return profileService.getProfile();
}
