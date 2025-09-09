import { api, ApiError } from '@/lib/api';
import { Organization } from '@/interfaces/Organization';
import { toast } from "react-toastify"

// ✅ Function to create a new organization
export async function createOrganization(orgData: Organization) {
  try {
    const response = await api.post<Organization>('/organizations', orgData);
    console.log("response", response)
    toast.success(response.message)
    // toast.success()
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