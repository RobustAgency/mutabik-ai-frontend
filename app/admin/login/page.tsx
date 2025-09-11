export const runtime = 'edge';

import React from 'react'
import AdminLoginForm from '@/components/admin/auth/AdminLoginForm'

const LoginPage = () => {
    return (
        <React.Fragment>
            <AdminLoginForm />
        </React.Fragment>
    )
}

export default LoginPage