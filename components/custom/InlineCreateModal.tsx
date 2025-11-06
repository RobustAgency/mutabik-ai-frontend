"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface InlineCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (createdItem: any) => void;
    title: string;
    description?: string;
    children: React.ReactElement<{
        onSuccess?: (createdItem: any) => void;
        onCancel?: () => void;
    }>;
}

const InlineCreateModal: React.FC<InlineCreateModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    title,
    description,
    children,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl!">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-[#1D2939]">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-[#667085]">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="mt-4">
                    {React.cloneElement(children, {
                        onSuccess,
                        onCancel: onClose,
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InlineCreateModal;

