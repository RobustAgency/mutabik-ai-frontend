import { useState, useEffect, useCallback } from 'react';
import { User } from '@/interfaces/User';
import { PaginatedResponse } from '@/interfaces/Pagination';
import { adminUsersService, CreateAdminUserRequest, GetUsersParams, SearchUsersParams } from '@/service/admin/adminUsers';
import { toast } from 'react-toastify';

export const useAdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
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

    const fetchUsers = useCallback(async (params: GetUsersParams = {}) => {
        try {
            setLoading(true);
            const response = await adminUsersService.getUsers({
                page: params.page || pagination.page,
                per_page: params.per_page || pagination.limit,
                ...params
            });

            setUsers(response.data);
            setPagination({
                page: response.current_page,
                limit: response.per_page,
                total: response.total,
                totalPages: response.last_page
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');

            setUsers([]);
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

    const searchUsers = useCallback(async (term: string) => {
        if (!term.trim()) {
            setIsSearching(false);
            await fetchUsers();
            return;
        }

        try {
            setLoading(true);
            setIsSearching(true);
            const searchResults = await adminUsersService.searchUsers({ term });
            setUsers(searchResults);
            // Reset pagination for search results
            setPagination(prev => ({
                ...prev,
                page: 1,
                total: searchResults.length,
                totalPages: 1
            }));
        } catch (error) {
            console.error('Error searching users:', error);
            toast.error('Failed to search users');

            // Set empty state if search fails
            setUsers([]);
            setPagination(prev => ({
                ...prev,
                page: 1,
                total: 0,
                totalPages: 1
            }));
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const createUser = useCallback(async (userData: CreateAdminUserRequest): Promise<boolean> => {
        try {
            setLoading(true);
            await adminUsersService.createAdminUser(userData);
            toast.success('Admin user created successfully');

            // Refresh the users list
            if (isSearching) {
                await searchUsers(searchTerm);
            } else {
                await fetchUsers();
            }

            return true;
        } catch (error: any) {
            console.error('Error creating user:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to create admin user';
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isSearching, searchTerm, searchUsers, fetchUsers]);

    const deleteUser = useCallback(async (userId: number): Promise<boolean> => {
        try {
            const success = await adminUsersService.deleteUser(userId);
            if (success) {
                toast.success('Admin user deleted successfully');

                // Refresh the users list
                if (isSearching) {
                    await searchUsers(searchTerm);
                } else {
                    await fetchUsers();
                }

                return true;
            } else {
                toast.error('Failed to delete admin user');
                return false;
            }
        } catch (error: any) {
            console.error('Error deleting user:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to delete admin user';
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isSearching, searchTerm, searchUsers, fetchUsers]);

    const handlePageChange = useCallback(async (page: number) => {
        setPagination(prev => ({ ...prev, page }));

        if (isSearching) {
            // For search, we typically don't paginate on frontend
            return;
        } else {
            await fetchUsers({ page });
        }
    }, [isSearching, fetchUsers]);

    const handleSearch = useCallback(async (term: string) => {
        setSearchTerm(term);
        await searchUsers(term);
    }, [searchUsers]);

    // Initialize data only once
    useEffect(() => {
        if (!initialized) {
            fetchUsers();
            setInitialized(true);
        }
    }, [initialized, fetchUsers]);

    return {
        users,
        pagination,
        loading,
        searchTerm,
        isSearching,
        fetchUsers,
        searchUsers,
        createUser,
        deleteUser,
        handlePageChange,
        handleSearch,
        refetch: fetchUsers
    };
};
