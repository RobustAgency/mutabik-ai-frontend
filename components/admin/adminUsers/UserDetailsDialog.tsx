"use client";
import React from 'react';
import { User } from '@/interfaces/User';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { formatRole } from '@/utils/formatRole';

interface UserDetailsDialogProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    loading?: boolean;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
    user,
    isOpen,
    onClose,
    loading = false
}) => {
    if (loading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
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
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                        <div className="mt-1 text-gray-900 border border-gray-200 rounded-md py-2 px-3 bg-gray-50">
                            {user.name}
                        </div>
                    </div>
                    
                    <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <div className="mt-1 text-gray-900 border border-gray-200 rounded-md py-2 px-3 bg-gray-50">
                            {user.email}
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <div className="mt-1">
                            <Badge variant="light" color="info">
                                {formatRole(user.role)}
                            </Badge>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsDialog;
