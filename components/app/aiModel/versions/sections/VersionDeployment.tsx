"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { CreateAiModelVersionData } from "@/service/app/aiModelVersions";

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
        <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">Deployment</h2>
        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Deployment status, lifecycle and compliance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Deployment Status <span className="text-red-500">*</span></Label>
          <Select
            value={formData.deployment_status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, deployment_status: value as any }))}
          >
            <SelectTrigger className={errors.deployment_status ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['not_deployed', 'deploying', 'deployed', 'failed', 'rollback'].map(v => (
                <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.deployment_status && (
            <p className="text-xs text-red-600 mt-1">{errors.deployment_status[0]}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Lifecycle Stage <span className="text-red-500">*</span></Label>
          <Select
            value={formData.lifecycle_stage}
            onValueChange={(value) => setFormData(prev => ({ ...prev, lifecycle_stage: value as any }))}
          >
            <SelectTrigger className={errors.lifecycle_stage ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['development', 'testing', 'staging', 'production', 'deprecated', 'retired'].map(v => (
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
    </section>
  );
};

export default VersionDeployment;


