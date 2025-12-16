"use client";

import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import InlineCreateModal from "@/components/custom/InlineCreateModal";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";

interface StakeholderSelectorWithInlineProps {
    label: string;
    value: number | string | null;
    onValueChange: (value: number | string | null) => void;
    placeholder?: string;
    description?: string;
    required?: boolean;
    error?: string;
    filterType?: "person" | "team" | "vendor_org" | "regulator" | "all";
}

const StakeholderSelectorWithInline: React.FC<StakeholderSelectorWithInlineProps> = ({
    label,
    value,
    onValueChange,
    placeholder = "Select stakeholder",
    description,
    required = false,
    error,
    filterType = "all",
}) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch stakeholders
    const {
        data: allStakeholders = [],
        isLoading: stakeholdersLoading,
        error: stakeholdersError
    } = useGetStakeholdersQuery();

    // Filter and search stakeholders
    const filteredStakeholders = useMemo(() => {
        let filtered = allStakeholders;

        // Filter by type if specified
        if (filterType !== "all") {
            filtered = filtered.filter(stakeholder => stakeholder.type === filterType);
        }

        // Filter by search term
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(stakeholder =>
                stakeholder.display_name.toLowerCase().includes(search) ||
                stakeholder.email.toLowerCase().includes(search) ||
                stakeholder.org_unit.toLowerCase().includes(search)
            );
        }

        return filtered;
    }, [allStakeholders, filterType, searchTerm]);

    // Find selected stakeholder
    const selectedStakeholder = allStakeholders.find(s => s.id === value);

    const handleAddNew = () => {
        setOpen(false);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        // RTK Query cache invalidation will automatically refetch stakeholders
    };

    return (
        <>
            <div className="flex flex-col gap-2 w-full">
                <Label>
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                "h-11 w-full justify-between px-4 rounded-lg border focus:border-[#D0D5DD] focus:-ring-0",
                                error ? "border-red-500" : "border-[#D0D5DD]",
                                !value && "text-muted-foreground"
                            )}
                            disabled={stakeholdersLoading}
                        >
                            {stakeholdersLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Loading stakeholders...</span>
                                </div>
                            ) : selectedStakeholder ? (
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">{selectedStakeholder.display_name}</span>
                                    <span className="text-xs text-gray-500">
                                        {selectedStakeholder.email}
                                    </span>
                                </div>
                            ) : (
                                placeholder
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[400px] p-0" align="start">
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Input
                                placeholder="Search stakeholders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus:ring-0 focus:border-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {/* Add New Stakeholder Option */}
                            <div
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground bg-green-50 text-[#4FD58F] font-medium"
                                onClick={handleAddNew}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Add New Stakeholder</span>
                            </div>

                            {stakeholdersError ? (
                                <div className="p-4 text-center text-sm text-red-500">
                                    Error loading stakeholders
                                </div>
                            ) : filteredStakeholders.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    {searchTerm ? "No stakeholders found" : "No stakeholders available"}
                                </div>
                            ) : (
                                <>
                                    {/* Clear selection option */}
                                    <div
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                                        onClick={() => {
                                            onValueChange(null);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                !value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span className="text-muted-foreground">Clear selection</span>
                                    </div>

                                    {/* Stakeholder options */}
                                    {filteredStakeholders.map((stakeholder) => (
                                        <div
                                            key={stakeholder.id}
                                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                                            onClick={() => {
                                                onValueChange(stakeholder.id);
                                                setOpen(false);
                                                setSearchTerm("");
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === stakeholder.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{stakeholder.display_name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {stakeholder.email} • {stakeholder.org_unit}
                                                </span>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {stakeholder.type.replace('_', ' ')} • {stakeholder.classification}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {description && (
                    <p className="text-xs text-gray-500">{description}</p>
                )}
            </div>

            <InlineCreateModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                title="Create New Stakeholder"
            >
                <StakeholderModalForm
                    onSuccess={handleSuccess}
                    onCancel={handleModalClose}
                />
            </InlineCreateModal>
        </>
    );
};

export default StakeholderSelectorWithInline;

