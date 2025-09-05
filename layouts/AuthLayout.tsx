'use client'
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    if (pathname === '/admin/login') {
        return <>{children}</>
    }
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

            <div className=" hidden lg:flex items-center justify-center bg-[#041D2D] relative">
                <Image
                    src="/auth/shape.png"
                    alt="mutabiq.ai logo"
                    width={450}
                    height={250}
                    className='absolute top-0 right-0'
                />
                <Image
                    src="/auth/shape.png"
                    alt="mutabiq.ai logo"
                    width={450}
                    height={250}
                    className='absolute bottom-0 left-0 rotate-180'
                />
                <div className="text-center text-white">
                    <div className="flex items-center justify-center mb-6">
                        <Image
                            src="/auth/logo.svg"
                            alt="mutabiq.ai logo"
                            width={200}
                            height={48}
                        />
                    </div>
                    <p className="text-lg text-slate-300 max-w-sm">
                        Governing Data, Privacy, and AI with Confidence.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default AuthLayout