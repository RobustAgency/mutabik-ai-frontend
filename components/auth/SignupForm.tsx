"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin mr-2" />
                    Creating account...
                </>
            ) : (
                "Sign Up"
            )}
        </Button>
    );
}

export function SignUpForm() {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [state, formAction] = useActionState(
        async (_prevState: unknown, formData: FormData) => {
            const result = await signup(formData);
            console.log("signup result", result)
            return result;
        },
        null as null | { success: boolean; message?: string }
    );

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success("A verification email has been sent.");
            formRef.current?.reset();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="w-full">
            {/* Form */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
                    <p className="mt-2 text-gray-600">Enter your email and password to sign up!</p>
                </div>

                <form ref={formRef} action={formAction} className="space-y-4">
                    {/* First name and Last name in a row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="first-name" className="text-gray-700 font-medium">
                                First name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="first-name"
                                name="first-name"
                                type="text"
                                placeholder="John"
                                className="mt-1 border-gray-300 focus:border-primary focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="last-name" className="text-gray-700 font-medium">
                                Last name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="last-name"
                                name="last-name"
                                type="text"
                                placeholder="Doe"
                                className="mt-1 border-gray-300 focus:border-primary focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

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

                    <div className="flex items-start space-x-2">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                            By creating an account, you agree to the{" "}
                            <Link href="/terms" className="text-primary hover:text-primary/80">
                                terms and conditions
                            </Link>
                            {" "}and our{" "}
                            <Link href="/privacy" className="text-primary hover:text-primary/80">
                                privacy policy
                            </Link>
                        </label>
                    </div>

                    <SubmitButton />
                </form>

                <div className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
