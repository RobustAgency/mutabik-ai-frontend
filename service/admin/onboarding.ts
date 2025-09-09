import { api, ApiError } from '@/lib/api';
import { Organization, CreateOrganizationRequest } from '@/interfaces/Organization';
import { toast } from "react-toastify"

export async function createOrganization(orgData: CreateOrganizationRequest) {
  try {
    const response = await api.post<Organization>('/organizations', orgData);
    toast.success(response.message)
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API Error:', error.message);
      toast.error(error.message)
      throw new Error(error.message);
    }
    console.error('Unexpected Error:', error);
    throw new Error('Something went wrong while creating the organization.');
  }
}