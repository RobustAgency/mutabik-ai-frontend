"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GovernancePillar } from "@/utils/governancePillar";
import type { ProjectFormData } from "@/lib/schemas/project.schema";

interface BasicInformationStepProps {
  aiModels: any[];
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  aiModels,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProjectFormData>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* AI Model */}
        <div className="space-y-2">
          <Label
            htmlFor="aiModel"
            className="font-medium text-sm leading-5 text-[#344054] flex items-center gap-1"
          >
            AI Model <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("ai_model_id")?.toString() ?? ""}
            onValueChange={(value) =>
              setValue("ai_model_id", Number(value), {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full cursor-pointer min-h-11 h-11 rounded-lg border border-[#D0D5DD] px-4 py-2.5 bg-white shadow-sm">
              <SelectValue
                placeholder="Select AI model"
                className="font-normal text-sm text-[#1D2939]"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(aiModels || []).map((model: any) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.ai_model_id && (
            <p className="text-xs text-red-500 mt-1">
              {errors.ai_model_id.message as string}
            </p>
          )}
        </div>

        {/* Project Name */}
        <div className="space-y-2">
          <Label
            htmlFor="projectName"
            className="font-medium text-sm leading-5 text-[#344054] flex items-center gap-1"
          >
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            {...register("name")}
            className="h-11 rounded-lg border border-[#D0D5DD] bg-white shadow-sm px-4 py-2.5"
            placeholder="AI Credit Risk Scoring"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Description (optional) */}
        <div className="space-y-2">
          <Label
            htmlFor="projectDescription"
            className="font-medium text-sm leading-5 text-[#344054]"
          >
            Description
          </Label>
          <Textarea
            id="projectDescription"
            {...register("description")}
            className="h-[134px] rounded-lg border border-[#D0D5DD] bg-white shadow-sm px-4 py-3"
            placeholder="Describe the purpose, scope and key stakeholders of this project."
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.description.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Governance pillar */}
      <div className="space-y-4">
        <Label
          htmlFor="governancePillar"
          className="font-medium text-sm leading-5 text-[#344054] flex items-center gap-1"
        >
          Choose governance pillar <span className="text-red-500">*</span>
        </Label>
        <Select
          value={watch("governance_pillar")}
          onValueChange={(value) =>
            setValue("governance_pillar", value as GovernancePillar, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full cursor-pointer min-h-11 h-11 rounded-lg border border-[#D0D5DD] px-4 py-2.5 bg-white shadow-sm">
            <SelectValue
              placeholder="Select governance pillar"
              className="font-normal text-sm text-[#1D2939]"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={GovernancePillar.AI_GOVERNANCE}>
                AI Governance
              </SelectItem>
              <SelectItem value={GovernancePillar.DATA_GOVERNANCE}>
                Data Governance
              </SelectItem>
              <SelectItem value={GovernancePillar.PRIVACY_PDPL}>
                Privacy/PDPL
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.governance_pillar && (
          <p className="text-xs text-red-500 mt-1">
            {errors.governance_pillar.message as string}
          </p>
        )}
      </div>
    </div>
  );
};


