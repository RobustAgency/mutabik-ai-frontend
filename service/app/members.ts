import { api, ApiResponse } from '@/lib/api';
import { User } from '@/interfaces/User';

export interface Member extends User {
  organization_id: number;
  is_organization_active: boolean;
}

export interface UpdateMemberData {
  name?: string;
  role?: string;
}

export class MemberService {
  async getMembers(): Promise<ApiResponse<Member[]>> {
    return api.get('/members');
  }

  async updateMember(userId: number, data: UpdateMemberData): Promise<ApiResponse<Member>> {
    return api.put(`/members/${userId}`, data);
  }

  async deleteMember(userId: number): Promise<ApiResponse<null>> {
    return api.delete(`/members/${userId}`);
  }
}

export const memberService = new MemberService();