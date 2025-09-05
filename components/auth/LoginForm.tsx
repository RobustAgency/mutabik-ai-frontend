"use client"
import Link from "next/link"
import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "react-toastify"
import type { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-actions"

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            className="min-h-10 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md transition-colors"
            disabled={pending}
        >
            {pending ? "Signing in..." : "Sign In"}
        </Button>
    );
}

export function LoginForm() {
    const formRef = useRef<HTMLFormElement | null>(null);
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
            toast.success("Logged in successfully");
            formRef.current?.reset();
            if (state.data?.user_metadata?.role === "admin") {
                window.location.href = "/admin/dashboard";
            } else {
                window.location.href = "/plans";
            }
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

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
                            className="mt-1 border-gray-300 focus:border-primary focus:ring-primary"
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
                            className="mt-1 border-gray-300 focus:border-primary focus:ring-primary"
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
                    <SubmitButton />
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
