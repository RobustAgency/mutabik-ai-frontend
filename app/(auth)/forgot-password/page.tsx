import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import Link from 'next/link';



export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Link
                href="/login"
                className="absolute left-[16%] -translate-x-1/2 top-10 inline-flex items-center text-sm"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to login
            </Link>
            <div className="w-full max-w-md">
                <ForgotPasswordForm />
            </div>
        </div>
    )
}