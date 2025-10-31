"use client"
import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-actions"
import { Role } from "@/interfaces/Roles"
import { profileService } from "@/service/app/profile"

function SubmitButton({ isProcessing }: { isProcessing: boolean }) {
    const { pending } = useFormStatus();
    const isLoading = pending || isProcessing;

    return (
        <Button
            type="submit"
            className="min-h-10 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md transition-colors"
            disabled={isLoading}
        >
            {isLoading ? "Signing in..." : "Sign In"}
        </Button>
    );
}

type LoginState =
    | null
    | { success: false; message: string; requiresEmailVerification?: boolean; email?: string }
    | { success: true; data: User | null };

export function LoginForm() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [state, formAction] = useActionState(
        async (_prev: LoginState, formData: FormData) => {
            const result = await login(formData);
            return result;
        },
        null as LoginState
    );

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            setIsProcessing(true);
            formRef.current?.reset();

            const userRole = state.data?.user_metadata?.role;

            // Check if user is super admin or admin - they can proceed directly
            if (userRole === Role.SUPER_ADMIN || userRole === Role.ADMIN) {
                toast.success("Logged in successfully");
                if (userRole === Role.SUPER_ADMIN) {
                    window.location.href = "/admin/dashboard";
                } else {
                    window.location.href = "/dashboard";
                }
                return;
            }

            // For all other roles, check organization status
            const checkOrganizationStatus = async () => {
                try {
                    const profileResult = await profileService.getProfile();

                    if (profileResult.success && profileResult.data) {
                        const profile = profileResult.data;
                        const { organization_id, is_organization_active, role } = profile;

                        // If role is owner and organization is not active and no organization_id
                        if (role === Role.OWNER && !is_organization_active && !organization_id) {
                            toast.success("Logged in successfully");
                            window.location.href = "/onboarding?mode=organization-setup";
                            return;
                        }

                        // For any user, if organization is not active
                        if (!is_organization_active) {
                            toast.error("Your organization is inactive. Please contact administration.");
                            setTimeout(() => {
                                window.location.href = "/logout";
                            }, 1500);
                            setIsProcessing(false);
                            return;
                        }

                        // If everything is fine, redirect to dashboard
                        toast.success("Logged in successfully");
                        window.location.href = "/dashboard";
                    } else {
                        // Handle profile fetch error
                        if (profileResult.errorCode === 403) {
                            toast.success("Logged in successfully");
                            window.location.href = "/onboarding?mode=unapproved-account";
                        } else {
                            toast.error(profileResult.message || "An error occurred");
                            setIsProcessing(false);
                        }
                    }
                } catch (error) {
                    console.error("Error checking organization status:", error);
                    toast.error("An error occurred while checking organization status");
                    setIsProcessing(false);
                }
            };

            checkOrganizationStatus();
        } else if (!state.success) {
            // Check if this is an email verification error
            if (state.requiresEmailVerification && state.email) {
                // Redirect to verify-email page with the email parameter
                router.push(`/verify-email?email=${encodeURIComponent(state.email)}`);
                return;
            }

            // For all other errors, show toast
            if (state.message) {
                toast.error(state.message);
            }
            setIsProcessing(false);
        }
    }, [state, router]);

    return (
        <div className="w-full">
            {/* Form */}
            <div className="space-y-6 max-w-md">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
                    <p className="mt-2 text-gray-600">Enter your email and password to sign in!</p>
                </div>

                <form ref={formRef} action={formAction} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 border-gray-300"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password<span className="text-red-500">*</span>
                        </Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="hello123"
                            className="mt-1 border-gray-300"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Keep me logged in
                            </label>
                        </div>
                        <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                            Forgot password?
                        </Link>
                    </div>
                    <SubmitButton isProcessing={isProcessing} />
                </form>

                <div className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
