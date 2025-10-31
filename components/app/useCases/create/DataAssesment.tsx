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
import { FormDataType } from "../types/useCaseTypes";

interface DataAssesmentProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const DataAssesment: React.FC<DataAssesmentProps> = ({ formData, setFormData }) => {
  const handleChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855] ">
          Data Assessment
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Availability Status */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Data Availability Status
          </Label>
          <Select
            value={formData.data_availability_status}
            onValueChange={(value) => handleChange("data_availability_status", value)}
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="Select Availability Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="partially_available">Partially Available</SelectItem>
              <SelectItem value="not_available">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Readiness */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Data Readiness
          </Label>
          <Select
            value={formData.data_readiness}
            onValueChange={(value) => handleChange("data_readiness", value)}
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="Select Data Readiness Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="D1">D1 - Raw Data</SelectItem>
              <SelectItem value="D2">D2 - Processed Data</SelectItem>
              <SelectItem value="D3">D3 - Cleaned Data</SelectItem>
              <SelectItem value="D4">D4 - Analysis-Ready Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DataAssesment;
