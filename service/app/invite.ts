import { api, type ApiResponse } from '@/lib/api';
import { Role } from '@/interfaces/Roles';

export interface AcceptInviteRequest {
    token: string;
    name: string;
    password: string;
}

export interface AcceptInviteResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface TeamMember {
    email: string;
    role: Role;
}

export interface InviteTeamRequest {
    members: TeamMember[];
}

export interface InviteTeamResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export class InviteService {
    private baseUrl = '';

    /**
     * Send team invitations
     */
    async inviteTeamMembers(payload: InviteTeamRequest): Promise<InviteTeamResponse> {
        try {
            const response: ApiResponse<any> = await api.post('/invite-members', payload);

            if (response.error) {
                return {
                    success: false,
                    message: response.message || 'Failed to send invitations'
                };
            }

            return {
                success: true,
                message: response.message || 'Invitations sent successfully',
                data: response.data
            };
        } catch (error: any) {
            console.error('Invite team members error:', error);

            return {
                success: false,
                message: error.response?.data?.message || error.message || 'An error occurred while sending invitations'
            };
        }
    }

    /**
     * Accept invitation
     */
    async acceptInvitation(payload: AcceptInviteRequest): Promise<AcceptInviteResponse> {
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
    }
}

export const inviteService = new InviteService();

// Backward compatibility
export const acceptInvite = async (payload: AcceptInviteRequest): Promise<AcceptInviteResponse> => {
    return inviteService.acceptInvitation(payload);
};