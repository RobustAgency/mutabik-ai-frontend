'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Timer state
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })
            if (error) throw error
            setSuccess(true)
            setTimer(60) // reset countdown on success
            setCanResend(false)
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    // Timer effect
    useEffect(() => {
        if (!success || canResend) return

        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)

            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer, success, canResend])

    const handleResendEmail = async () => {
        if (!email) return
        const supabase = createClient()
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })
            if (error) throw error
            setTimer(60)
            setCanResend(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className={cn('w-full', className)} {...props}>
            {success ? (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Verify your email</h1>
                        <p className="mt-2 text-gray-600">
                            Verify your email address to get started. <br />
                            If you didn’t receive the email, click the resend button.
                        </p>
                    </div>

                    <div>
                        {!canResend && (
                            <p className="text-sm text-gray-500 mb-2">
                                You can resend in {timer}s
                            </p>
                        )}
                        <Button
                            onClick={handleResendEmail}
                            className="min-h-[44px] w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
                            disabled={!canResend}
                        >
                            Resend Verification Email
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>
                        <p className="mt-2 text-gray-600">No worries, we&apos;ll send you reset instructions.</p>
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
                                className="mt-1 border-gray-300"
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
                </div>
            )}
        </div>
    )
}
