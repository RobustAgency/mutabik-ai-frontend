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
import { FormDataType } from "./CreateUseCases";

interface UseCaseClassificationProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const UseCaseClassification: React.FC<UseCaseClassificationProps> = ({
  formData,
  setFormData,
}) => {
  // ✅ handleChange function for cleaner code
  const handleChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Use-case Classification
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Use case type */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Use case type
          </Label>
          <Select
            value={formData.use_case_type}
            onValueChange={(value) => handleChange("use_case_type", value)}
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="Regulatory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regulatory">Regulatory</SelectItem>
              <SelectItem value="strategic">Strategic</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Value driver */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Value driver
          </Label>
          <Select
            value={formData.value_driver}
            onValueChange={(value) => handleChange("value_driver", value)}
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="Cost" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost">Cost</SelectItem>
              <SelectItem value="efficiency">Efficiency</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UseCaseClassification;
