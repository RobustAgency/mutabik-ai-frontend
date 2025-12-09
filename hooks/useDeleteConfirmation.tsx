"use client";

import { useState, useCallback } from "react";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

/**
 * Delete confirmation hook
 * 
 * Manages delete confirmation dialog state and provides handlers for delete operations.
 * Reduces repetition across detail/list components that need delete functionality.
 */

export interface DeleteDialogState<T = string> {
  isOpen: boolean;
  entityId: T | null;
  entityName: string;
}

export interface UseDeleteConfirmationOptions<T = string> {
  /** The RTK Query delete mutation hook result */
  deleteMutation: (id: T) => Promise<any>;
  /** Loading state from the delete mutation */
  isDeleting?: boolean;
  /** Entity type name for dialog messages (e.g., "Data Source", "Dataset") */
  entityTypeName: string;
  /** Custom confirmation message (optional) */
  customMessage?: string;
  /** Callback after successful deletion */
  onSuccess?: () => void;
  /** Callback after failed deletion */
  onError?: (error: any) => void;
}

export interface UseDeleteConfirmationReturn<T = string> {
  /** Current dialog state */
  dialogState: DeleteDialogState<T>;
  /** Open the delete confirmation dialog */
  openDeleteDialog: (entityId: T, entityName: string) => void;
  /** Close the delete confirmation dialog */
  closeDeleteDialog: () => void;
  /** Handle delete confirmation */
  handleConfirmDelete: () => Promise<void>;
  /** ConfirmationDialog component with pre-configured props */
  DeleteConfirmationDialog: React.FC;
}

/**
 * Hook for managing delete confirmation dialogs
 * 
 * @example
 * ```tsx
 * const { dialogState, openDeleteDialog, closeDeleteDialog, handleConfirmDelete, DeleteConfirmationDialog } =
 *   useDeleteConfirmation({
 *     deleteMutation: deleteDataSource,
 *     isDeleting,
 *     entityTypeName: "Data Source",
 *     onSuccess: () => router.push("/core-assets/data/sources"),
 *   });
 * 
 * // In render:
 * <Button onClick={() => openDeleteDialog(source.id, source.name)}>Delete</Button>
 * <DeleteConfirmationDialog />
 * ```
 */
export function useDeleteConfirmation<T = string>({
  deleteMutation,
  isDeleting = false,
  entityTypeName,
  customMessage,
  onSuccess,
  onError,
}: UseDeleteConfirmationOptions<T>): UseDeleteConfirmationReturn<T> {
  const [dialogState, setDialogState] = useState<DeleteDialogState<T>>({
    isOpen: false,
    entityId: null,
    entityName: "",
  });

  const openDeleteDialog = useCallback((entityId: T, entityName: string) => {
    setDialogState({
      isOpen: true,
      entityId,
      entityName,
    });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDialogState({
      isOpen: false,
      entityId: null,
      entityName: "",
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!dialogState.entityId) return;

    try {
      await deleteMutation(dialogState.entityId);
      closeDeleteDialog();
      onSuccess?.();
    } catch (error) {
      console.error(`Failed to delete ${entityTypeName}:`, error);
      onError?.(error);
      closeDeleteDialog();
    }
  }, [dialogState.entityId, deleteMutation, entityTypeName, onSuccess, onError, closeDeleteDialog]);

  const DeleteConfirmationDialog = useCallback(() => {
    const defaultMessage =
      customMessage ||
      `Are you sure you want to delete "${dialogState.entityName}"? This action cannot be undone and will remove the ${entityTypeName.toLowerCase()} from the system permanently.`;

    return (
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={`Delete ${entityTypeName}`}
        description={defaultMessage}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    );
  }, [
    dialogState.isOpen,
    dialogState.entityName,
    customMessage,
    entityTypeName,
    closeDeleteDialog,
    handleConfirmDelete,
    isDeleting,
  ]);

  return {
    dialogState,
    openDeleteDialog,
    closeDeleteDialog,
    handleConfirmDelete,
    DeleteConfirmationDialog,
  };
}

