"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FILTER_CONFIGS, FilterConfig, FilterFieldConfig } from "@/lib/config/filterConfigs";
import { cn } from "@/lib/utils";

interface DynamicFilterProps {
    filterType: string;
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onApply?: () => void;
    onClear?: () => void;
}

export function DynamicFilter({
    filterType,
    filters,
    onFiltersChange,
    onApply,
    onClear,
}: DynamicFilterProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [localFilters, setLocalFilters] = React.useState<Record<string, any>>(filters);

    const config: FilterConfig = FILTER_CONFIGS[filterType] || {};

    // Update local filters when props change
    React.useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const updateFilter = (key: string, value: any) => {
        const updated = { ...localFilters };
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
            delete updated[key];
        } else {
            updated[key] = value;
        }
        setLocalFilters(updated);
    };

    const handleMultiselectToggle = (key: string, value: string) => {
        const current = (localFilters[key] as string[]) || [];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        updateFilter(key, updated.length > 0 ? updated : undefined);
    };

    const handleDateChange = (key: string, date: Date | undefined) => {
        if (date) {
            updateFilter(key, format(date, "yyyy-MM-dd"));
        } else {
            updateFilter(key, undefined);
        }
    };

    const handleClear = () => {
        const cleared: Record<string, any> = {};
        setLocalFilters(cleared);
        if (onClear) {
            onClear();
        } else {
            onFiltersChange(cleared);
        }
    };

    const handleApply = () => {
        onFiltersChange(localFilters);
        if (onApply) {
            onApply();
        }
        setIsOpen(false);
    };

    // Calculate active filter count (excluding per_page)
    const activeFilterCount = React.useMemo(() => {
        return Object.entries(localFilters).filter(([key, value]) => {
            if (key === "per_page") return false;
            if (value === undefined || value === null || value === "") return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        }).length;
    }, [localFilters]);

    const renderFilterField = (fieldConfig: FilterFieldConfig) => {
        const { key, label, type, options, placeholder, maxLength, dateConstraints } = fieldConfig;
        const value = localFilters[key];

        switch (type) {
            case "select":
                return (
                    <div className="flex flex-wrap gap-2">
                        {options?.map((option) => {
                            const isSelected = value === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => updateFilter(key, isSelected ? undefined : option.value)}
                                    className={cn(
                                        "px-3 py-1 text-sm rounded-full border transition-colors",
                                        isSelected
                                            ? "bg-[#4FD58F]/10 border-[#4FD58F] text-[#4FD58F]"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                );

            case "multiselect":
                return (
                    <div className="flex flex-wrap gap-2">
                        {options?.map((option) => {
                            const isSelected = (value as string[])?.includes(option.value) || false;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleMultiselectToggle(key, option.value)}
                                    className={cn(
                                        "px-3 py-1 text-sm rounded-full border transition-colors",
                                        isSelected
                                            ? "bg-[#4FD58F]/10 border-[#4FD58F] text-[#4FD58F]"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                );

            case "text":
                return (
                    <Input
                        type="text"
                        placeholder={placeholder || `Search by ${label.toLowerCase()}...`}
                        value={value || ""}
                        onChange={(e) => updateFilter(key, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FD58F]"
                        maxLength={maxLength}
                    />
                );

            case "date":
                const dateValue = value ? new Date(value) : undefined;
                const handleDateSelect = (selectedDate: Date | undefined) => {
                    handleDateChange(key, selectedDate);
                    // If setting "from" date and "to" date is before it, clear "to"
                    if (key === "from" && selectedDate && localFilters.to) {
                        const toDate = new Date(localFilters.to);
                        if (toDate < selectedDate) {
                            updateFilter("to", undefined);
                        }
                    }
                };
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg",
                                    !dateValue && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateValue ? format(dateValue, "yyyy-MM-dd") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateValue}
                                onSelect={handleDateSelect}
                                initialFocus
                                disabled={(date) => {
                                    if (dateConstraints?.disableFuture && date > new Date()) return true;
                                    if (dateConstraints?.disablePast && date < new Date()) return false;
                                    if (key === "to" && localFilters.from) {
                                        const fromDate = new Date(localFilters.from);
                                        return date < fromDate;
                                    }
                                    return false;
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                );

            case "boolean":
                return (
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={value === true}
                                onChange={(e) => updateFilter(key, e.target.checked ? true : undefined)}
                                className="w-4 h-4 text-[#4FD58F] rounded"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                        </label>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors",
                    activeFilterCount > 0
                        ? "border-[#4FD58F] bg-[#4FD58F]/10 text-[#4FD58F]"
                        : "border-gray-300 bg-white text-gray-700"
                )}
            >
                <Filter className="w-4 h-4" />
                <span className="hidden md:block">
                    Filters
                </span>
                {activeFilterCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-[#4FD58F] text-white text-xs font-semibold rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 max-h-96 overflow-y-auto space-y-4">
                        {(() => {
                            const renderedKeys = new Set<string>();
                            return Object.values(config).map((fieldConfig) => {
                                const { key, label, type } = fieldConfig;

                                // Skip if already rendered (for date ranges)
                                if (renderedKeys.has(key)) return null;

                                // Handle date range rendering
                                if (type === "date") {
                                    const fromConfig = config["from"];
                                    const toConfig = config["to"];

                                    if (key === "from" && fromConfig && toConfig) {
                                        renderedKeys.add("from");
                                        renderedKeys.add("to");
                                        return (
                                            <div key="date-range">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date Range
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">From</label>
                                                        {renderFilterField(fromConfig)}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">To</label>
                                                        {renderFilterField(toConfig)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else if (key === "to" && fromConfig) {
                                        // Already rendered with "from"
                                        return null;
                                    } else if (key === "from" || key === "to") {
                                        // Single date field
                                        renderedKeys.add(key);
                                        return (
                                            <div key={key}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {label}
                                                </label>
                                                {renderFilterField(fieldConfig)}
                                            </div>
                                        );
                                    }
                                }

                                renderedKeys.add(key);
                                return (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {label}
                                        </label>
                                        {renderFilterField(fieldConfig)}
                                    </div>
                                );
                            });
                        })()}
                    </div>

                    <div className="p-4 border-t border-gray-200 flex justify-between">
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            Clear All
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                className="px-4 py-2 text-sm bg-[#4FD58F] text-white rounded-lg hover:bg-[#4FD58F]/90"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

