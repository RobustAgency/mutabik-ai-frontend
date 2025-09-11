export const runtime = 'edge';

import React from 'react'
import ProfileForm from '@/components/settings/ProfileForm'
import ChangePasswordForm from '@/components/settings/ChangePasswordForm'
import ProfilePhoto from '@/components/settings/ProfilePhoto'

const SettingsPage = () => {
    return (
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
            <div className='col-span-1 xl:col-span-2 order-2 xl:order-1 space-y-5'>
                <ProfileForm />
                <ChangePasswordForm />
            </div>
            <div className='col-span-1 xl:col-span-1 order-1 xl:order-2'>
                <ProfilePhoto />
            </div>
        </div>
    )
}

export default SettingsPage