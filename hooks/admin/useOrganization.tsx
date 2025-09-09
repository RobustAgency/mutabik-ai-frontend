import { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/interfaces/Organization';
import { organizationsService, UpdateOrganizationRequest } from '@/service/admin/organizations';
import { toast } from 'react-toastify';

export const useOrganization = (organizationId: number) => {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const fetchOrganization = useCallback(async () => {
        if (!organizationId) return;

        try {
            setLoading(true);
            const response = await organizationsService.getOrganization(organizationId);
            console.log("Fetched organization:", response);
            setOrganization(response);
        } catch (error) {
            console.error('Error fetching organization:', error);
            toast.error('Failed to fetch organization details');
            setOrganization(null);
        } finally {
            setLoading(false);
        }
    }, [organizationId]);

    const updateOrganization = useCallback(async (updateData: UpdateOrganizationRequest): Promise<boolean> => {
        if (!organizationId) return false;

        try {
            setUpdating(true);
            const success = await organizationsService.updateOrganization(organizationId, updateData);
            if (success) {
                setOrganization(prevOrg => {
                    if (!prevOrg) return prevOrg;
                    return { ...prevOrg, ...updateData };
                });
                toast.success('Organization updated successfully');
                return true;
            } else {
                toast.error('Failed to update organization');
                return false;
            }
        } catch (error: any) {
            console.error('Error updating organization:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to update organization';
            toast.error(errorMessage);
            return false;
        } finally {
            setUpdating(false);
        }
    }, [organizationId]);

    // Initialize data only once
    useEffect(() => {
        if (!initialized && organizationId) {
            fetchOrganization();
            setInitialized(true);
        }
    }, [initialized, organizationId, fetchOrganization]);

    return {
        organization,
        loading,
        updating,
        fetchOrganization,
        updateOrganization,
        refetch: fetchOrganization
    };
};
