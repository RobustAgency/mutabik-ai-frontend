"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/auth-actions';
import { Role } from '@/interfaces/Roles';

function SubmitButton({ isProcessing }: { isProcessing: boolean }) {
    const { pending } = useFormStatus();
    const isLoading = pending || isProcessing;

    return (
        <Button
            type="submit"
            className="min-h-10 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md transition-colors"
            disabled={isLoading}
        >
            {isLoading ? "Signing in..." : "Admin Sign In"}
        </Button>
    );
}

const AdminLoginForm = () => {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [state, formAction] = useActionState(
        async (_prev: null | { success: false; message: string } | { success: true; data: User | null }, formData: FormData) => {
            const result = await login(formData);
            return result;
        },
        null as null | { success: false; message: string } | { success: true; data: User | null }
    );

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            setIsProcessing(true);
            formRef.current?.reset();

            const userRole = state.data?.user_metadata?.role;

            // Check if user is super admin - only super admins can access admin panel
            if (userRole === Role.SUPER_ADMIN) {
                toast.success("Admin login successful");
                window.location.href = "/admin/dashboard";
                return;
            } else {
                // If not super admin, redirect to logout
                toast.error("Access denied. Only super administrators can access the admin panel.");
                setTimeout(() => {
                    window.location.href = "/logout";
                }, 1500);
                setIsProcessing(false);
                return;
            }
        } else if (state.message) {
            toast.error(state.message);
            setIsProcessing(false);
        }
    }, [state]);

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <Image src="/auth/logo-dark.svg" alt="mutabiq.ai logo" width={150} height={36} />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Admin Sign In</h2>
                </div>

                <form ref={formRef} action={formAction} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email address<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@mutabiq.com"
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
                            placeholder="Enter your password"
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
                                Remember me
                            </label>
                        </div>
                    </div>

                    <SubmitButton isProcessing={isProcessing} />
                </form>

            </div>
        </div>
    );
};

export default AdminLoginForm;