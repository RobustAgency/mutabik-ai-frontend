'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })
            if (error) throw error
            setSuccess(true)
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('w-full', className)} {...props}>
            {success ? (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Verify your email</h1>
                        <p className="mt-2 text-gray-600">Verify your email address to get started.
                            If you didn’t receive the email, click the resend button.</p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to login
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>
                        <p className="mt-2 text-gray-600">No worries, we'll send you reset instructions.</p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-700 font-medium">
                                Email<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="mt-1 border-gray-300 focus:border-primary focus:ring-primary"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Reset password'}
                        </Button>
                    </form>

                    <div className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                            Sign In
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}