"use client";
import React, { useState, useEffect } from 'react';
import { User } from '@/interfaces/User';
import { Role } from '@/interfaces/Roles';
import { UpdateUserRequest } from '@/service/admin/users';
import { getRoleDisplayName } from '@/utils/formatRole';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Roles that can be assigned to users (excluding SUPER_ADMIN and ADMIN)
const ASSIGNABLE_ROLES = [Role.OWNER, Role.PROJECT_LEAD, Role.REVIEWER, Role.CONTRIBUTOR, Role.AUDITOR] as const;

interface UserEditDialogProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updateData: UpdateUserRequest) => Promise<boolean>;
    loading?: boolean;
    saving?: boolean;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
    user,
    isOpen,
    onClose,
    onSave,
    loading = false,
    saving = false
}) => {
    const [formData, setFormData] = useState<UpdateUserRequest>({
        name: '',
        email: '',
        role: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            // If user has super_admin or admin role, default to OWNER instead
            const userRole = ASSIGNABLE_ROLES.find(role => role === user.role) || Role.OWNER;
            
            setFormData({
                name: user.name,
                email: user.email,
                role: userRole
            });
            setErrors({});
        }
    }, [user]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.role?.trim()) {
            newErrors.role = 'Role is required';
        } else if (!ASSIGNABLE_ROLES.some(role => role === formData.role)) {
            newErrors.role = 'Please select a valid role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        const success = await onSave(formData);
        if (success) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
        setErrors({});
        onClose();
    };

    const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    if (loading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">Loading user details...</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!user) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">User not found</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Enter full name"
                            disabled={saving}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter email address"
                            disabled={true}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <div className="mt-1">
                            <Select
                                value={formData.role || ''}
                                onValueChange={(value) => handleInputChange('role', value)}
                                disabled={saving}
                            >
                                <SelectTrigger className={`w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.role ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASSIGNABLE_ROLES.map(role => (
                                        <SelectItem key={role} value={role}>
                                            {getRoleDisplayName(role)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserEditDialog;
