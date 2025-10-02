import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "./CraeteUseCases"; 

interface BasicInfoProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData }) => {

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Basic Info
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="gap-6 w-full flex flex-col">
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Retail Credit Risk Scoring"
              className="h-[44px] px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, status: val }))
              }
            >
              <SelectTrigger className="gap-2 px-4 py-[22px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer" >
                <SelectValue placeholder="Draft" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Enter a description..."
              className="h-[74px] resize-none"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Business Objective</Label>
            <Textarea
              value={formData.businessObjective}
              onChange={(e) =>
                setFormData((p) => ({ ...p, businessObjective: e.target.value }))
              }
              placeholder="Enter the business objective..."
              className="h-[74px] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
