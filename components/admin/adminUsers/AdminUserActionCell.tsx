"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2 } from "lucide-react"
import { User } from "@/interfaces/User"
import ConfirmationDialog from "@/components/custom/ConfirmationDialog"

interface AdminUserActionCellProps {
    user: User
    onDelete: (userId: number) => Promise<boolean>
}

const AdminUserActionCell = ({ user, onDelete }: AdminUserActionCellProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = () => {
        setShowDeleteDialog(true)
    }

    const handleCloseDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false)
        }
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            await onDelete(user.id)
            setShowDeleteDialog(false)
        } catch (error) {
            console.error('Error deleting user:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <button className="cursor-pointer text-red-500 hover:text-red-600 flex items-center duration-200 active:scale-95"
                onClick={handleDeleteClick}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
            </button>
            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
                title="Delete Admin User"
                description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    )
}

export default AdminUserActionCell
