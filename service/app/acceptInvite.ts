import { api, type ApiResponse } from '@/lib/api';

export interface AcceptInviteRequest {
    token: string;
    full_name: string;
    password: string;
}

export interface AcceptInviteResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const acceptInvite = async (payload: AcceptInviteRequest): Promise<AcceptInviteResponse> => {
    try {
        const response: ApiResponse<any> = await api.post('/accept-invite', payload);
        
        if (response.error) {
            return {
                success: false,
                message: response.message || 'Failed to accept invitation'
            };
        }

        return {
            success: true,
            message: response.message || 'Invitation accepted successfully',
            data: response.data
        };
    } catch (error: any) {
        console.error('Accept invite error:', error);
        
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'An error occurred while accepting the invitation'
        };
    }
};