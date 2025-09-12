import { useState, useEffect, useCallback } from 'react';
import { User } from '@/interfaces/User';
import { usersService, UpdateUserRequest } from '@/service/admin/users';
import { toast } from 'react-toastify';

export const useUser = (userId?: number) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const fetchUser = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await usersService.getUser(userId);
            setUser(response);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to fetch user details');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const updateUser = useCallback(async (updateData: UpdateUserRequest): Promise<boolean> => {
        if (!userId) return false;

        try {
            setUpdating(true);
            const success = await usersService.updateUser(userId, updateData);
            if (success) {
                setUser(prevUser => {
                    if (!prevUser) return prevUser;
                    return { ...prevUser, ...updateData };
                });
                toast.success('User updated successfully');
                return true;
            } else {
                toast.error('Failed to update user');
                return false;
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to update user';
            toast.error(errorMessage);
            return false;
        } finally {
            setUpdating(false);
        }
    }, [userId]);

    const deleteUser = useCallback(async (): Promise<boolean> => {
        if (!userId) return false;

        try {
            setDeleting(true);
            const success = await usersService.deleteUser(userId);
            if (success) {
                toast.success('User deleted successfully');
                setUser(null);
                return true;
            } else {
                toast.error('Failed to delete user');
                return false;
            }
        } catch (error: any) {
            console.error('Error deleting user:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to delete user';
            toast.error(errorMessage);
            return false;
        } finally {
            setDeleting(false);
        }
    }, [userId]);

    // Initialize data only once
    useEffect(() => {
        if (!initialized && userId) {
            fetchUser();
            setInitialized(true);
        }
    }, [initialized, userId, fetchUser]);

    return {
        user,
        loading,
        updating,
        deleting,
        fetchUser,
        updateUser,
        deleteUser,
        refetch: fetchUser
    };
};
