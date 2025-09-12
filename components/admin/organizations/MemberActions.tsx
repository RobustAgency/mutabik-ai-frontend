"use client";
import React, { useState } from 'react';
import { OrganizationMember } from '@/interfaces/Organization';
import { useUser } from '@/hooks/admin/useUser';
import { UpdateUserRequest } from '@/service/admin/users';
import ConfirmationDialog from '@/components/custom/ConfirmationDialog';
import UserDetailsDialog from '@/components/admin/adminUsers/UserDetailsDialog';
import UserEditDialog from '@/components/admin/adminUsers/UserEditDialog';
import { Edit3, Eye, Trash2 } from 'lucide-react';

interface MemberActionsProps {
    member: OrganizationMember;
    onMemberUpdated?: () => void | Promise<void>;
    onMemberDeleted?: () => void | Promise<void>;
}

const MemberActions: React.FC<MemberActionsProps> = ({
    member,
    onMemberUpdated,
    onMemberDeleted
}) => {
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showUserEdit, setShowUserEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        user: selectedUser,
        loading: userLoading,
        updating: userUpdating,
        deleting: userDeleting,
        updateUser,
        deleteUser
    } = useUser(member.id);

    const handleViewUser = () => {
        setShowUserDetails(true);
    };

    const handleEditUser = () => {
        setShowUserEdit(true);
    };

    const handleDeleteUser = () => {
        setShowDeleteConfirm(true);
    };

    const handleSaveUser = async (updateData: UpdateUserRequest): Promise<boolean> => {
        const success = await updateUser(updateData);
        if (success) {
            await onMemberUpdated?.();
            setShowUserEdit(false);
        }
        return success;
    };

    const handleConfirmDeleteUser = async () => {
        const success = await deleteUser();
        if (success) {
            setShowDeleteConfirm(false);
            await onMemberDeleted?.();
        }
    };

    const handleCloseDialogs = () => {
        if (!userUpdating && !userDeleting) {
            setShowUserDetails(false);
            setShowUserEdit(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-5">
                <button
                    onClick={handleViewUser}
                    className='flex items-center gap-2 text-[#525252] hover:text-[#333] cursor-pointer transition-colors duration-200'
                    disabled={userLoading}
                >
                    <Eye className="w-4 h-4" />
                    View
                </button>
                <button
                    onClick={handleEditUser}
                    className='flex items-center gap-2 text-[#4FD58F] hover:text-[#3eb574] cursor-pointer transition-colors duration-200'
                    disabled={userLoading}
                >
                    <Edit3 className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={handleDeleteUser}
                    className='flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200'
                    disabled={userLoading || userDeleting}
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>

            {/* User Details Dialog */}
            <UserDetailsDialog
                user={selectedUser}
                isOpen={showUserDetails}
                onClose={handleCloseDialogs}
                loading={userLoading}
            />

            {/* User Edit Dialog */}
            <UserEditDialog
                user={selectedUser}
                isOpen={showUserEdit}
                onClose={handleCloseDialogs}
                onSave={handleSaveUser}
                loading={userLoading}
                saving={userUpdating}
            />

            {/* Delete User Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                onClose={handleCloseDialogs}
                onConfirm={handleConfirmDeleteUser}
                title="Delete User"
                description={`Are you sure you want to delete "${member.name}"? This action cannot be undone and will remove the user from the system permanently.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={userDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default MemberActions;
