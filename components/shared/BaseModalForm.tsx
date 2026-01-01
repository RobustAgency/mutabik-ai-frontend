"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BaseModalFormProps {
    children: React.ReactNode;
    validationErrors: Record<string, string[]>;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    isLoading?: boolean;
    submitButtonText?: string;
    cancelButtonText?: string;
    className?: string;
}

const BaseModalForm: React.FC<BaseModalFormProps> = ({
    children,
    validationErrors,
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonText = "Submit",
    cancelButtonText = "Cancel",
    className = "",
}) => {
    return (
        <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
            {/* Show validation errors */}
            {Object.keys(validationErrors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <p className="font-semibold mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(validationErrors).map(([field, errors]) => (
                                <li key={field}>
                                    <span className="font-medium capitalize">
                                        {field.replace(/_/g, " ")}:
                                    </span>{" "}
                                    {errors[0]}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Form content */}
            {children}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelButtonText}
                    </Button>
                )}
                <Button
                    type="submit"
                    className="bg-[#4FD58F] hover:bg-[#3fc77f]"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : submitButtonText}
                </Button>
            </div>
        </form>
    );
};

export default BaseModalForm;

