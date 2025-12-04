"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormDataType } from "../types/aiModelTypes";

interface TechnicalDetailsProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    errors?: Record<string, string[]>;
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({
    formData,
    setFormData,
    errors = {},
}) => {
    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    return (
        <div className="space-y-6 w-full">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Business Adoption Status
                </h2>
                <hr className="border-gray-200" />
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Business Adoption Status */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Business Adoption Status
                    </Label>
                    <Select
                        value={formData.business_adoption_status || ""}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                business_adoption_status: value ? (value as "planned" | "active" | "deprecated" | "retired") : null,
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("business_adoption_status") || hasError("business_status") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="deprecated">Deprecated</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                    </Select>
                    {(hasError("business_adoption_status") || hasError("business_status")) && (
                        <p className="text-sm text-red-500">{getError("business_adoption_status") || getError("business_status")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicalDetails;
