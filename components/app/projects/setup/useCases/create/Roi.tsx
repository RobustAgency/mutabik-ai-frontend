import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataType } from "./CraeteUseCases"; 

interface RoiProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const Roi: React.FC<RoiProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          ROI
        </h2>
        <hr className="border-gray-200" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Label>Expected ROI (%)</Label>
            <Input
              value={formData.expectedRoi}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expectedRoi: e.target.value }))
              }
              placeholder="20%"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Implementation Cost</Label>
            <Input
              value={formData.implementationCost}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, implementationCost: e.target.value }))
              }
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Reduction in time (x)</Label>
            <Input
              value={formData.reductionTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reductionTime: e.target.value }))
              }
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Label>Reduction in cost (per year)</Label>
            <Input
              value={formData.reductionCost}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reductionCost: e.target.value }))
              }
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Increase in revenue (per year)</Label>
            <Input
              value={formData.increaseRevenue}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, increaseRevenue: e.target.value }))
              }
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Risk avoidance (per year)</Label>
            <Input
              value={formData.riskAvoidance}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, riskAvoidance: e.target.value }))
              }
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>FTE capacity saved (count)</Label>
            <Input
              value={formData.fteCapacity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fteCapacity: e.target.value }))
              }
              placeholder="30"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roi;
