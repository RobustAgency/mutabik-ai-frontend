"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginAdmin, AdminLoginResponse } from '../../../service/admin/auth';
import { Button } from '@/components/ui/button';

const AdminLoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res: AdminLoginResponse = await loginAdmin(email, password);
            if (res.success) {
                router.push('/admin/dashboard');
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err: unknown) {
            console.error('Login error:', err);
            setError((err as Error)?.message || 'An error occurred during login');
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <form
                className="bg-white rounded-xl shadow-md p-8 w-full max-w-md flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col items-center mb-2">
                    <Image src="/auth/logo-dark.svg" alt="mutabiq.ai logo" width={150} height={36} />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Admin Sign in</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-medium text-gray-700">
                        Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="admin@mutabiq.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type="password"
                            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        {/* Eye icon for show/hide password can be added here if needed */}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        id="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="accent-primary"
                    />
                    <label htmlFor="rememberMe" className="text-gray-700">Remember me</label>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button
                    type="submit"
                    className="min-h-10 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </div>
    );
};

export default AdminLoginForm;