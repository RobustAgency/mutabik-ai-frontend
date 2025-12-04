"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { CreateAiModelVersionData } from "@/service/app/aiModelVersions";
import { InfoTooltip } from "@/components/custom/InfoTooltip";

interface Props {
  formData: CreateAiModelVersionData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAiModelVersionData>>;
  errors: Record<string, string[]>;
}

const VersionDeployment: React.FC<Props> = ({ formData, setFormData, errors }) => {
  const [customizationInput, setCustomizationInput] = React.useState('');

  const handleEnvChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deployment_environments: checked
        ? [...(prev.deployment_environments || []), value]
        : (prev.deployment_environments || []).filter(v => v !== value),
    }));
  };

  const handleCustomizationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomizationInput(e.target.value);
  };

  const handleCustomizationKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newCustomization = customizationInput.trim();

      if (newCustomization.length > 0) {
        setFormData(prev => ({
          ...prev,
          customizations_applied: [
            ...(prev.customizations_applied || []),
            newCustomization
          ]
        }));
        // Clear input for next entry
        setCustomizationInput('');
      }
    }
  };

  const removeCustomization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customizations_applied: (prev.customizations_applied || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">
          Deployment &amp; Lifecycle
        </h2>
        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
          Deployment configuration, lifecycle stage, and governance status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            Deployment Status <span className="text-red-500 ml-0.5">*</span>
            <InfoTooltip content="Current deployment state: Not Deployed, Testing, Staging, Production, or Retired." />
          </Label>
          <Select
            value={formData.deployment_status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, deployment_status: value as any }))}
          >
            <SelectTrigger className={errors.deployment_status ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['not_deployed', 'testing', 'staging', 'production', 'retired'].map(v => (
                <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.deployment_status && (
            <p className="text-xs text-red-600 mt-1">{errors.deployment_status[0]}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            Lifecycle Stage <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Select
            value={formData.lifecycle_stage}
            onValueChange={(value) => setFormData(prev => ({ ...prev, lifecycle_stage: value as any }))}
          >
            <SelectTrigger className={errors.lifecycle_stage ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['development', 'design', 'validation', 'deployment', 'monitoring', 'retired'].map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.lifecycle_stage && (
            <p className="text-xs text-red-600 mt-1">{errors.lifecycle_stage[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2">Deployment Environments</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['development', 'testing', 'staging', 'production'].map(env => (
            <div key={env} className="flex items-center space-x-2">
              <Checkbox
                id={`env_${env}`}
                checked={(formData.deployment_environments || []).includes(env)}
                onCheckedChange={(checked) => handleEnvChange(env, checked as boolean)}
              />
              <Label htmlFor={`env_${env}`} className="text-sm text-gray-700">{env}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2">Customizations Applied</Label>
        <Input
          type="text"
          value={customizationInput}
          onChange={handleCustomizationInputChange}
          onKeyPress={handleCustomizationKeyPress}
          placeholder='Type customization and press Enter'
          className="w-full"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {(formData.customizations_applied || []).map((customization, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {customization}
              <button
                type="button"
                onClick={() => removeCustomization(index)}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">
              Governance &amp; Monitoring
            </h2>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              Approval Status <span className="text-red-500 ml-0.5">*</span>
              <InfoTooltip content="Final governance decision for this version." />
            </Label>
            <Select
              value={formData.approval_status || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  approval_status: (value || null) as CreateAiModelVersionData["approval_status"],
                }))
              }
            >
              <SelectTrigger className={errors.approval_status ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
                <SelectValue placeholder="Select approval status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="approved_for_pilot">Approved for Pilot</SelectItem>
                <SelectItem value="approved_for_production">Approved for Production</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="rolled_back">Rolled Back</SelectItem>
              </SelectContent>
            </Select>
            {errors.approval_status && (
              <p className="text-xs text-red-600 mt-1">
                {errors.approval_status[0]}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VersionDeployment;


