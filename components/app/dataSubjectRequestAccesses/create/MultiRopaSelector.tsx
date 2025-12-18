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
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Loader2, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import InlineCreateModal from "@/components/custom/InlineCreateModal";
import RopaModalForm from "@/components/app/recordOfProcessingActivities/create/RopaModalForm";
import { useGetRecordOfProcessingActivitiesQuery } from "@/app/lib/features/recordOfProcessingActivitiesApi";

interface MultiRopaSelectorProps {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
  error?: string;
}

const MultiRopaSelector: React.FC<MultiRopaSelectorProps> = ({
  label,
  value = [],
  onValueChange,
  placeholder = "Select processing activities",
  description,
  required = false,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: ropaData,
    isLoading,
    error: ropaError,
  } = useGetRecordOfProcessingActivitiesQuery({ per_page: 100 } as any);

  const allActivities = ropaData?.data ?? [];

  const filteredActivities = useMemo(() => {
    let filtered = allActivities;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (activity: any) =>
          activity.activity_code.toLowerCase().includes(search) ||
          activity.activity_name.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [allActivities, searchTerm]);

  const selectedActivities = allActivities.filter((a: any) =>
    value.includes(a.id)
  );

  const toggleActivity = (id: number) => {
    if (value.includes(id)) {
      onValueChange(value.filter((v) => v !== id));
    } else {
      onValueChange([...value, id]);
    }
  };

  const removeActivity = (id: number) => {
    onValueChange(value.filter((v) => v !== id));
  };

  const handleAddNew = () => {
    setOpen(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = (created: any) => {
    setIsModalOpen(false);
    if (created?.id) {
      const id = Number(created.id);
      if (!Number.isNaN(id)) {
        if (!value.includes(id)) {
          onValueChange([...value, id]);
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        {selectedActivities.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
            {selectedActivities.map((activity: any) => (
              <Badge
                key={activity.id}
                variant="light"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">
                  {activity.activity_code} - {activity.activity_name}
                </span>
                <button
                  type="button"
                  onClick={() => removeActivity(activity.id)}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading activities...</span>
                </div>
              ) : selectedActivities.length > 0 ? (
                <span>
                  {selectedActivities.length} activity
                  {selectedActivities.length > 1 ? "ies" : "y"} selected
                </span>
              ) : (
                placeholder
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[480px] p-0" align="start">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search processing activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus:ring-0 focus:border-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              <div
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground bg-green-50 text-[#4FD58F] font-medium"
                onClick={handleAddNew}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Add New ROPA</span>
              </div>

              {ropaError ? (
                <div className="p-4 text-center text-sm text-red-500">
                  Error loading activities
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchTerm ? "No processing activities found" : "No processing activities available"}
                </div>
              ) : (
                <>
                  {value.length > 0 && (
                    <div
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground border-b"
                      onClick={() => onValueChange([])}
                    >
                      <X className="mr-2 h-4 w-4" />
                      <span className="text-muted-foreground">
                        Clear all selections
                      </span>
                    </div>
                  )}

                  {filteredActivities.map((activity: any) => {
                    const id = activity.id;
                    const selected = value.includes(id);
                    return (
                      <div
                        key={id}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => toggleActivity(id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {activity.activity_code}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {activity.activity_name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>

      <InlineCreateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        title="Create New ROPA"
        description="Create a new record of processing activity and link it to this DSAR."
      >
        <RopaModalForm />
      </InlineCreateModal>
    </>
  );
};

export default MultiRopaSelector;


