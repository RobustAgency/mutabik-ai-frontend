"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import InlineCreateModal from "./InlineCreateModal";
import { cn } from "@/lib/utils";

interface SelectOption {
  id: string | number;
  label: string;
  value: string;
}

interface SelectWithInlineCreateProps {
  // Standard Select props
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;

  // Data props
  options: SelectOption[];
  isLoading: boolean;
  isEmpty: boolean;

  // Inline creation props
  entityName: string; // "Vendor", "Stakeholder", etc.
  modalForm: React.ComponentType<{ onSuccess: (item: any) => void; onCancel: () => void }>;
  canCreate?: boolean; // Permission check
  modalTitle?: string;
  modalDescription?: string;

  // Styling
  className?: string;
  triggerClassName?: string;
  error?: boolean;
}

const SelectWithInlineCreate: React.FC<SelectWithInlineCreateProps> = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  options = [],
  isLoading = false,
  entityName,
  modalForm: ModalFormComponent,
  canCreate = true,
  modalTitle,
  modalDescription,
  className,
  triggerClassName,
  error = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const [previousValue, setPreviousValue] = useState<string | undefined>(value);
  const [selectKey, setSelectKey] = useState(0); // Force re-render key

  const ADD_NEW_VALUE = "__add_new__";

  // Track the previous value (before clicking "Add New")
  React.useEffect(() => {
    if (value !== ADD_NEW_VALUE && value !== undefined) {
      setPreviousValue(value);
    }
  }, [value]);

  const handleValueChange = (selectedValue: string) => {
    if (selectedValue === ADD_NEW_VALUE) {
      setIsModalOpen(true);
      setInternalOpen(false);
    } else {
      setPreviousValue(selectedValue);
      onValueChange(selectedValue);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Reset the select to clear the "__add_new__" selection
    // Force a re-render by changing the key
    setSelectKey(prev => prev + 1);
    // Reset to previous value or empty string
    if (previousValue) {
      onValueChange(previousValue);
    } else {
      // If no previous value (empty dropdown), just trigger change with empty
      // The key change will clear the visual selection
      onValueChange("");
    }
  };

  const handleSuccess = (createdItem: any) => {
    // Close the modal
    setIsModalOpen(false);

    // The RTK Query cache invalidation will automatically refetch the data
    // Auto-select the newly created item if it has an ID
    if (createdItem?.id) {
      const newId = String(createdItem.id);
      setPreviousValue(newId);
      onValueChange(newId);
      // Force re-render to show the new selection
      setSelectKey(prev => prev + 1);
    } else {
      // If no ID, reset to previous value or empty
      setSelectKey(prev => prev + 1);
      if (previousValue) {
        onValueChange(previousValue);
      } else {
        onValueChange("");
      }
    }
  };

  const showAddNew = canCreate && !isLoading;

  return (
    <>
      <Select
        key={selectKey}
        value={value || undefined}
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
        open={internalOpen}
        onOpenChange={setInternalOpen}
      >
        <SelectTrigger
          className={cn(
            "w-full",
            triggerClassName
          )}
          aria-invalid={error}
        >
          <SelectValue
            placeholder={isLoading ? "Loading..." : placeholder}
          />
        </SelectTrigger>
        <SelectContent className={className}>
          {showAddNew && (
            <SelectItem
              value={ADD_NEW_VALUE}
              className="text-[#4FD58F] font-medium cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add New {entityName}</span>
              </div>
            </SelectItem>
          )}
          {isLoading && (
            <SelectItem disabled value="__loading__">
              Loading {entityName.toLowerCase()}s...
            </SelectItem>
          )}
          {!isLoading && !showAddNew && options.length === 0 && (
            <SelectItem disabled value="__no_options__">
              No {entityName.toLowerCase()}s available
            </SelectItem>
          )}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <InlineCreateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        title={modalTitle || `Create New ${entityName}`}
        description={modalDescription}
      >
        <ModalFormComponent
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </InlineCreateModal>
    </>
  );
};

export default SelectWithInlineCreate;
