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
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import { Badge } from "@/components/ui/badge";

interface MultiStakeholderSelectorProps {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
  error?: string;
  filterType?: "person" | "team" | "vendor_org" | "regulator" | "all";
}

const MultiStakeholderSelector: React.FC<MultiStakeholderSelectorProps> = ({
  label,
  value = [],
  onValueChange,
  placeholder = "Select stakeholders",
  description,
  required = false,
  error,
  filterType = "all",
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch stakeholders
  const {
    data: allStakeholders = [],
    isLoading: stakeholdersLoading,
    error: stakeholdersError,
  } = useGetStakeholdersQuery();

  // Filter and search stakeholders
  const filteredStakeholders = useMemo(() => {
    let filtered = allStakeholders;

    // Filter by type if specified
    if (filterType !== "all") {
      filtered = filtered.filter((stakeholder) => stakeholder.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (stakeholder) =>
          stakeholder.display_name.toLowerCase().includes(search) ||
          stakeholder.email.toLowerCase().includes(search) ||
          stakeholder.org_unit.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [allStakeholders, filterType, searchTerm]);

  // Find selected stakeholders
  const selectedStakeholders = allStakeholders.filter((s) => 
    value.includes(parseInt(s.id, 10))
  );

  // Toggle stakeholder selection
  const toggleStakeholder = (stakeholderId: string) => {
    const numericId = parseInt(stakeholderId, 10);
    if (value.includes(numericId)) {
      onValueChange(value.filter((id) => id !== numericId));
    } else {
      onValueChange([...value, numericId]);
    }
  };

  // Remove a selected stakeholder
  const removeStakeholder = (stakeholderId: string) => {
    const numericId = parseInt(stakeholderId, 10);
    onValueChange(value.filter((id) => id !== numericId));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Selected Stakeholders Display */}
      {selectedStakeholders.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
          {selectedStakeholders.map((stakeholder) => (
            <Badge
              key={stakeholder.id}
              variant="light"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-xs">{stakeholder.display_name}</span>
              <button
                type="button"
                onClick={() => removeStakeholder(stakeholder.id)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-11 w-full justify-between px-4 rounded-lg border focus:border-[#D0D5DD] focus:-ring-0",
              error ? "border-red-500" : "border-[#D0D5DD]",
              !value.length && "text-muted-foreground"
            )}
            disabled={stakeholdersLoading}
          >
            {stakeholdersLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading stakeholders...</span>
              </div>
            ) : selectedStakeholders.length > 0 ? (
              <span>
                {selectedStakeholders.length} stakeholder{selectedStakeholders.length > 1 ? "s" : ""} selected
              </span>
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
                {/* Clear all option */}
                {value.length > 0 && (
                  <div
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground border-b"
                    onClick={() => {
                      onValueChange([]);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    <span className="text-muted-foreground">Clear all selections</span>
                  </div>
                )}

                {/* Stakeholder options */}
                {filteredStakeholders.map((stakeholder) => (
                  <div
                    key={stakeholder.id}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                    onClick={() => toggleStakeholder(stakeholder.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(parseInt(stakeholder.id, 10)) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{stakeholder.display_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {stakeholder.email} • {stakeholder.org_unit}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {stakeholder.type.replace("_", " ")} • {stakeholder.classification}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};

export default MultiStakeholderSelector;

