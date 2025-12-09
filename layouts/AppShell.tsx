"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "./AuthLayout";
import OnboardingLayout from "./OnboardingLayout";

type AppShellProps = {
    children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const isAuthRoute = useMemo(() => {
        const authRoutes = [
            "/login",
            "/accept-invite",
            "/admin/login",
            "/signup",
            "/forgot-password",
            "/reset-password",
            "/update-password",
            "/auth/confirm",
            "/logout",
            "/error",
            "/verify-email",
        ];
        return authRoutes.some(
            (route) => pathname === route || pathname.startsWith(`${route}/`)
        );
    }, [pathname]);

    const isOnboardingRoute = useMemo(() => {
        return pathname === "/onboarding" || pathname.startsWith("/onboarding");
    }, [pathname]);

    if (isAuthRoute) return <AuthLayout>{children}</AuthLayout>;
    if (isOnboardingRoute) return <OnboardingLayout>{children}</OnboardingLayout>;

    return <MainLayout>{children}</MainLayout>;
}


