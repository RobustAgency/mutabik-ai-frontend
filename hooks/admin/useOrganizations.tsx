import { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/interfaces/Organization';
import { organizationsService, GetOrganizationsParams, UpdateOrganizationRequest } from '@/service/admin/organizations';
import { toast } from 'react-toastify';

export const useOrganizations = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [pagination, setPagination] = useState<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const fetchOrganizations = useCallback(async (params: GetOrganizationsParams = {}) => {
        try {
            setLoading(true);
            const response = await organizationsService.getOrganizations({
                page: params.page || pagination.page,
                per_page: params.per_page || pagination.limit,
                ...params
            });

            // Validate response data
            const organizations = Array.isArray(response.data) ? response.data : [];
            setOrganizations(organizations);

            // Validate pagination data with safe defaults
            const safePage = typeof response.current_page === 'number' && response.current_page > 0 ? response.current_page : 1;
            const safeLimit = typeof response.per_page === 'number' && response.per_page > 0 ? response.per_page : 10;
            const safeTotal = typeof response.total === 'number' && response.total >= 0 ? response.total : 0;
            const safeTotalPages = typeof response.last_page === 'number' && response.last_page > 0 ? response.last_page : 1;

            setPagination({
                page: safePage,
                limit: safeLimit,
                total: safeTotal,
                totalPages: safeTotalPages
            });

        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('Failed to fetch organizations. Please check your connection and try again.');

            // Set safe empty state for pagination if API fails
            setOrganizations([]);
            setPagination({
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const searchOrganizations = useCallback(async (term: string) => {
        if (!term.trim()) {
            setIsSearching(false);
            await fetchOrganizations();
            return;
        }

        try {
            setLoading(true);
            setIsSearching(true);
            const searchResults = await organizationsService.searchOrganizations({ term });

            // Validate search results
            const safeResults = Array.isArray(searchResults) ? searchResults : [];
            setOrganizations(safeResults);

            // Reset pagination for search results with safe values
            setPagination(prev => ({
                page: 1,
                limit: prev.limit || 10,
                total: safeResults.length,
                totalPages: 1
            }));

        } catch (error) {
            console.error('Error searching organizations:', error);
            toast.error('Failed to search organizations. Please check your connection and try again.');

            // Set safe empty state if search fails
            setOrganizations([]);
            setPagination(prev => ({
                page: 1,
                limit: prev.limit || 10,
                total: 0,
                totalPages: 1
            }));
        } finally {
            setLoading(false);
        }
    }, [fetchOrganizations]);

    const updateOrganization = useCallback(async (organizationId: number, updateData: UpdateOrganizationRequest): Promise<boolean> => {
        // Validate input parameters
        if (!organizationId || typeof organizationId !== 'number') {
            toast.error('Invalid organization ID');
            return false;
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            toast.error('No update data provided');
            return false;
        }

        try {
            setLoading(true);
            await organizationsService.updateOrganization(organizationId, updateData);
            toast.success('Organization updated successfully');

            // Refresh the organizations list with error handling
            try {
                if (isSearching && searchTerm) {
                    await searchOrganizations(searchTerm);
                } else {
                    await fetchOrganizations();
                }
            } catch (refreshError) {
                console.error('Error refreshing data after update:', refreshError);
                toast.warn('Organization updated but failed to refresh list. Please reload the page.');
            }

            return true;
        } catch (error: any) {
            console.error('Error updating organization:', error);

            // More detailed error handling
            let errorMessage = 'Failed to update organization';

            if (error?.response?.status === 404) {
                errorMessage = 'Organization not found';
            } else if (error?.response?.status === 403) {
                errorMessage = 'You do not have permission to update this organization';
            } else if (error?.response?.status === 422) {
                errorMessage = error?.response?.data?.message || 'Invalid data provided';
            } else if (error?.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isSearching, searchTerm, searchOrganizations, fetchOrganizations]);

    const handlePageChange = useCallback(async (page: number) => {
        setPagination(prev => ({ ...prev, page }));

        if (isSearching) {
            // For search, we typically don't paginate on frontend
            return;
        } else {
            await fetchOrganizations({ page });
        }
    }, [isSearching, fetchOrganizations]);

    const handleSearch = useCallback(async (term: string) => {
        setSearchTerm(term);
        await searchOrganizations(term);
    }, [searchOrganizations]);

    // Initialize data only once
    useEffect(() => {
        if (!initialized) {
            fetchOrganizations();
            setInitialized(true);
        }
    }, [initialized, fetchOrganizations]);

    return {
        organizations,
        pagination,
        loading,
        searchTerm,
        isSearching,
        fetchOrganizations,
        searchOrganizations,
        updateOrganization,
        handlePageChange,
        handleSearch,
        refetch: fetchOrganizations
    };
};
