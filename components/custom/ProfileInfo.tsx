import { useAuth } from '@/providers/AuthProvider'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

const ProfileInfo = () => {
    const { profile, fetchProfile,
        //  user 
        } = useAuth()
    // const avatarUrl = profile?.avatar_url
    // const displayName = profile?.full_name ?? "User"
    // const role = user?.user_metadata?.role ?? "user"
    const avatarUrl = '/profile/Profile.png';

    useEffect(() => {
        if (!profile) {
            fetchProfile()
        }
    }, [profile, fetchProfile])

    const router = useRouter();
    return (
        <div className="flex items-center gap-3 justify-end px-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="relative h-10 w-10 overflow-hidden rounded-full bg-muted focus:outline-none "
                        aria-label="Open profile menu"
                    >
                        {avatarUrl && (
                            <Image src={avatarUrl} alt="Profile" fill sizes="40px" className="object-cover cursor-pointer" unoptimized />
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 ">
                    <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/settings')}>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/logout')}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default ProfileInfo