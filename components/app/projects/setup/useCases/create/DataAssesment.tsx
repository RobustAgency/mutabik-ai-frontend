import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormDataType } from "./CraeteUseCases"; 

interface DataAssesmentProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const DataAssesment: React.FC<DataAssesmentProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Data Assessment
        </h2>
        <hr className="border-gray-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Data availability status
          </Label>
          <Select
            value={formData.dataAvailability}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, dataAvailability: value }))
            }
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF]">
              <SelectValue placeholder="Partially Available" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="partially">Partially Available</SelectItem>
              <SelectItem value="not">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data readiness */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Data readiness level
          </Label>
          <Select
            value={formData.dataReadiness}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, dataReadiness: value }))
            }
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="D3 - Cleaned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="d1">D1 - Raw</SelectItem>
              <SelectItem value="d2">D2 - Processed</SelectItem>
              <SelectItem value="d3">D3 - Cleaned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data freshness */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Data freshness
          </Label>
          <Select
            value={formData.dataFreshness}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, dataFreshness: value }))
            }
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="Weekly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DataAssesment;
