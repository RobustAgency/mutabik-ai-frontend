"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { acceptInvite, type AcceptInviteRequest } from '@/service/app/invite';
import { login } from '@/lib/auth-actions';

const AcceptInviteForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirm_password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        password: '',
        confirm_password: ''
    });

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            toast.error('Invalid invitation link');
            router.push('/login');
        }
    }, [token, router]);

    const validateForm = (): boolean => {
        const newErrors = {
            name: '',
            password: '',
            confirm_password: ''
        };

        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Validate confirm password
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Please confirm your password';
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid invitation link');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload: AcceptInviteRequest = {
                token,
                name: formData.name.trim(),
                password: formData.password
            };

            const response = await acceptInvite(payload);

            if (response.success) {
                if (response.data?.email) {
                    const loginFormData = new FormData();
                    loginFormData.append('email', response.data.email);
                    loginFormData.append('password', formData.password);

                    const loginResponse = await login(loginFormData);

                    if (loginResponse.success) {
                        toast.success('Thanks for accepting the invite.');
                        router.push('/dashboard');
                    } else {
                        toast.error('Invitation accepted but auto-login failed. Please log in manually.');
                        router.push('/login');
                    }
                } else {
                    toast.success('Invitation accepted! Please log in with your credentials.');
                    router.push('/login');
                }
            } else {
                toast.error(response.message || 'Failed to accept invitation');
            }
        } catch (error: unknown) {
            console.error('Accept invite error:', error);
            toast.error((error as Error)?.message || 'An error occurred while accepting the invitation');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="w-full">
            <div className="space-y-6 max-w-md">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Accept Invitation</h1>
                    <p className="mt-2 text-gray-600">Enter your full name and password to accept invitation!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                            Name<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            className="mt-1 border-gray-300"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password<span className="text-red-500">*</span>
                        </Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="mt-1 border-gray-300"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="confirm_password" className="text-gray-700 font-medium">
                            Confirm Password<span className="text-red-500">*</span>
                        </Label>
                        <PasswordInput
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="Confirm your password"
                            className="mt-1 border-gray-300"
                            value={formData.confirm_password}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.confirm_password && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Accept Invitation"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AcceptInviteForm;