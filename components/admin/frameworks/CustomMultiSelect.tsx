"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
}

interface CustomMultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function CustomMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className,
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Handle option selection/deselection
    const handleOptionClick = useCallback((optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];

        onChange(newValue);
    }, [value, onChange]);

    // Remove selected item
    const handleRemoveItem = useCallback((itemToRemove: string, event: React.MouseEvent) => {
        event.stopPropagation();
        const newValue = value.filter(v => v !== itemToRemove);
        onChange(newValue);
    }, [value, onChange]);

    // Toggle dropdown
    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Get selected options for display
    const selectedOptions = value.map(val =>
        options.find(opt => opt.value === val)
    ).filter(Boolean) as Option[];

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {/* Trigger Button */}
            <div
                onClick={toggleDropdown}
                className={cn(
                    "flex min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
                    isOpen && "ring-2 ring-ring ring-offset-2"
                )}
            >
                <div className="flex flex-wrap gap-1 flex-1 min-h-[24px] items-center">
                    {selectedOptions.length > 0 ? (
                        <>
                            {selectedOptions.slice(0, 3).map((option) => (
                                <div
                                    key={option.value}
                                    className="inline-flex items-center rounded-full border border-gray-600 px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-transparent text-gray-800 hover:bg-gray-50"
                                >
                                    {option.label}
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveItem(option.value, e)}
                                        className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-600 hover:text-gray-800"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {selectedOptions.length > 3 && (
                                <div className="inline-flex items-center rounded-full border border-gray-500 px-2.5 py-0.5 text-xs font-medium bg-transparent text-gray-700">
                                    +{selectedOptions.length - 3} more
                                </div>
                            )}
                        </>
                    ) : (
                        <span className="text-muted-foreground text-sm">{placeholder}</span>
                    )}
                </div>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 opacity-50 transition-transform",
                        isOpen && "transform rotate-180"
                    )}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md animate-in fade-in-0 zoom-in-95"
                >
                    <div className="max-h-60 overflow-auto p-1">
                        {options.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No options available
                            </div>
                        ) : (
                            options.map((option) => {
                                const isSelected = value.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() => handleOptionClick(option.value)}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            isSelected && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <div className="flex items-center space-x-2 w-full">
                                            <div className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3" />}
                                            </div>
                                            <span className="flex-1">{option.label}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
