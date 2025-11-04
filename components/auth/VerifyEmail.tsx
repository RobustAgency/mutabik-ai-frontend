"use client";

import React, { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { resendVerificationEmail } from '@/lib/auth-actions';

const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isResent, setIsResent] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Get email from URL parameters
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setUserEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    const handleResendEmail = () => {
        startTransition(async () => {
            try {
                // Use the email from URL params if available, otherwise let the function try to get it from session
                const result = await resendVerificationEmail(userEmail || undefined);

                if (result.success) {
                    toast.success(result.message || "Verification email sent successfully!");
                    setIsResent(true);
                } else {
                    toast.error(result.message || "Failed to send verification email");
                }
            } catch (error) {
                toast.error("An unexpected error occurred. Please try again.");
                console.error("Resend verification error:", error);
            }
        });
    };

    return (
        <div className="w-full">
            {/* Left side - Verify Email Form */}
            <div className="space-y-6 w-full h-svh flex flex-col justify-center max-w-md relative">

                {/* Back to sign up link */}
                <Link
                    href="/signup"
                    className="inline-flex items-center text-sm text-[#344054] hover:text-gray-900 transition-colors absolute top-10"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign up
                </Link>

                {/* Main content */}
                <div className="text-left space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Verify your email
                    </h1>
                    <p className="text-gray-600 mt-4">
                        {userEmail ? (
                            <>
                                We've sent a verification email to <strong>{userEmail}</strong>.
                                Please check your inbox and spam folder. You can also click the resend button below.
                            </>
                        ) : (
                            "Verify your email address to get started. Do check your spam folder if you don't see the email in your inbox. You can also click the resend button."
                        )}
                    </p>

                    {isResent && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                ✓ Verification email sent{userEmail ? ` to ${userEmail}` : ''}! Please check your inbox and spam folder.
                            </p>
                        </div>
                    )}
                </div>

                {/* Resend verification button */}
                <Button
                    size={'lg'}
                    onClick={handleResendEmail}
                    disabled={isPending}
                    className="w-full mt-7 bg-primary hover:bg-primary/90 text-white font-medium !py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Sending...
                        </>
                    ) : (
                        "Resend Verification Email"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default VerifyEmail;