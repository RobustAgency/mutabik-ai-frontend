"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/service/app/profile";
import { useGetProfileQuery } from "@/app/lib/features/profileApi";
import { Role } from "@/interfaces/Roles";
import { useRouter } from "next/navigation";

type AuthContextValue = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    profile: Profile | null;
    fetchProfile: () => Promise<void>;
    setProfile: (profile: Profile | null) => void;
};

const AuthContext = createContext<AuthContextValue>({
    user: null,
    session: null,
    isLoading: true,
    profile: null,
    fetchProfile: async () => { },
    setProfile: () => { },
});

type AuthProviderProps = {
    children: React.ReactNode;
    initialUser?: User | null;
    initialProfile?: Profile | null;
};

export function AuthProvider({ children, initialUser = null, initialProfile = null }: AuthProviderProps) {
    const supabase = useMemo(() => createClient(), []);
    const [user, setUser] = useState<User | null>(initialUser);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const previousUserIdRef = useRef<string | null>(initialUser?.id ?? null);
    const router = useRouter();

    // Only fetch from backend API for non-admin/non-super-admin users
    const userRole = user?.user_metadata?.role;
    const shouldFetchProfile = !!user?.id && userRole !== Role.ADMIN && userRole !== Role.SUPER_ADMIN;

    // const {
    //     data: apiProfile,
    //     refetch,
    //     isLoading: isProfileLoading,
    //     error: profileError,
    // } = useGetProfileQuery(undefined, {
    //     skip: !shouldFetchProfile,
    // });
     const {
        data: apiProfile,
        refetch,
        isLoading: isProfileLoading,
        error: profileError,
    } = useGetProfileQuery(undefined);

    // For super-admin / admin users we don't call the backend API,
    // so fall back to whatever initialProfile was provided (Supabase data).
    const [localProfile, setLocalProfile] = useState<Profile | null>(initialProfile);

    // Merge: prefer RTK Query data when available, fall back to local
    const profile: Profile | null = shouldFetchProfile
        ? apiProfile ?? localProfile
        : localProfile;

    // Handle redirects based on profile data (mirrors old useProfile logic)
    useEffect(() => {
        if (!shouldFetchProfile) return;

        // Handle 403 — account not approved
        if (profileError && typeof profileError === "object" && "status" in profileError) {
            const status = (profileError as { status: number }).status;
            if (status === 403) {
                router.push("/onboarding?mode=unapproved-account");
                return;
            }
        }

        if (apiProfile && !apiProfile.organization_id) {
            router.push("/onboarding?mode=organization-setup");
        }
    }, [apiProfile, profileError, shouldFetchProfile, router]);

    // fetchProfile: triggers RTK Query refetch (auto-invalidation is preferred,
    // but this is kept for backward-compat with ProfilePhoto / ProfileForm)
    const fetchProfile = useMemo(
        () => async () => {
            if (shouldFetchProfile) {
                await refetch();
            }
        },
        [shouldFetchProfile, refetch]
    );

    const setProfile = useMemo(
        () => (p: Profile | null) => setLocalProfile(p),
        []
    );

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (!isMounted) return;
                setSession(data.session);
                setUser(data.session?.user ?? initialUser);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            const newUserId = newSession?.user?.id ?? null;
            const previousUserId = previousUserIdRef.current;

            if (event === "SIGNED_OUT") {
                previousUserIdRef.current = null;
            } else if (event === "SIGNED_IN") {
                if (newUserId !== previousUserId) {
                    previousUserIdRef.current = newUserId;
                }
            }
        });

        void init();

        return () => {
            isMounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const combinedLoading = isLoading || (shouldFetchProfile && isProfileLoading);

    const value = useMemo<AuthContextValue>(
        () => ({ user, session, isLoading: combinedLoading, profile, fetchProfile, setProfile }),
        [user, session, combinedLoading, profile, fetchProfile, setProfile]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
