"use client";

import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isLoading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitClassName?: string;
  cancelClassName?: string;
}

export default function FormActions({
  isLoading,
  isEditing,
  onCancel,
  submitLabel,
  cancelLabel = "Cancel",
  submitClassName = "bg-[#4FD58F] hover:bg-[#3BAD6B] text-white px-6 py-2 rounded-lg",
  cancelClassName = "px-6 py-2 rounded-lg",
}: FormActionsProps) {
  const defaultSubmitLabel = isLoading
    ? isEditing
      ? "Updating..."
      : "Creating..."
    : isEditing
    ? "Update"
    : "Create";

  return (
    <div className="flex gap-4">
      <Button type="submit" disabled={isLoading} className={submitClassName}>
        {submitLabel || defaultSubmitLabel}
      </Button>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={cancelClassName}
        >
          {cancelLabel}
        </Button>
      )}
    </div>
  );
}

