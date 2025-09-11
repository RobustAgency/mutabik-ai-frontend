import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { profileService, type Profile } from '@/service/app/profile';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Role } from '@/interfaces/Roles';

interface UseProfileReturn {
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useProfile = (user: User | null, initialProfile: Profile | null): UseProfileReturn => {
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const fetchProfile = useCallback(async () => {
        if (!user?.id) {
            setProfile(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data: supabaseData, error: supabaseError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (supabaseError) {
                toast.error(supabaseError.message);
                setError(supabaseError.message);
                return;
            }

            if (user?.user_metadata?.role !== Role.ADMIN && user?.user_metadata?.role !== Role.SUPER_ADMIN) {
                const profileResult = await profileService.getProfile();

                if (profileResult.success && profileResult.data) {
                    setProfile({
                        ...supabaseData,
                        ...profileResult.data,
                        id: String(profileResult.data.id),
                        full_name: profileResult.data.name
                    });

                    if (!profileResult.data.organization_id) {
                        router.push('/onboarding?mode=organization-setup');
                    }
                } else if (profileResult.error) {
                    if (profileResult.errorCode === 403) {
                        router.push('/onboarding?mode=unapproved-account');
                    } else {
                        toast.error(profileResult.message || "An error occurred");
                        setError(profileResult.message || "An error occurred");
                    }
                }
            } else {
                setProfile(supabaseData);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user?.id, user?.user_metadata?.role, supabase, router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        setProfile,
        loading,
        error,
        refetch: fetchProfile
    };
};
