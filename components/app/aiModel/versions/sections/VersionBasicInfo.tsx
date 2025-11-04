"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateAiModelVersionData } from "@/service/app/aiModelVersions";
import { useAiModels } from "@/hooks/app/useAiModels";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";

interface Props {
  formData: CreateAiModelVersionData;
  setFormData: React.Dispatch<React.SetStateAction<CreateAiModelVersionData>>;
  errors: Record<string, string[]>;
}

const VersionBasicInfo: React.FC<Props> = ({ formData, setFormData, errors }) => {
  const { aiModels } = useAiModels();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">Basic Info</h2>
        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Provide general information for this model version</p>
      </div>

      <div>
        <Label htmlFor="ai_model_id" className="text-sm font-medium text-gray-700 mb-2">
          Parent Model <span className="text-red-500">*</span>
        </Label>
        <SelectWithInlineCreate
          value={formData.ai_model_id ? String(formData.ai_model_id) : "0"}
          onValueChange={(value) => setFormData(prev => ({ ...prev, ai_model_id: parseInt(value) }))}
          options={aiModels.map((model) => ({
            id: model.id,
            label: `${model.name} (${model.primary_category.replace('_', ' ')})`,
            value: String(model.id),
          }))}
          isLoading={false}
          isEmpty={aiModels.length === 0}
          entityName="AI Model"
          modalForm={AiModelModalForm}
          placeholder="Select a model..."
          error={!!errors.ai_model_id}
        />
        {errors.ai_model_id && (
          <p className="text-xs text-red-600 mt-1">{errors.ai_model_id[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="version_number" className="text-sm font-medium text-gray-700 mb-2">
            Version Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="version_number"
            value={formData.version_number}
            onChange={(e) => setFormData(prev => ({ ...prev, version_number: e.target.value }))}
            placeholder="v2.1.3"
            className={`w-full ${errors.version_number ? "border-red-500 focus:border-red-500 w-full" : "w-full"}`}
          />
          <p className="text-xs text-gray-500 mt-1">Semantic versioning (major.minor.patch)</p>
          {errors.version_number && (
            <p className="text-xs text-red-600 mt-1">{errors.version_number[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="version_type" className="text-sm font-medium text-gray-700 mb-2">
            Version Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.version_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, version_type: value as any }))}
          >
            <SelectTrigger className={errors.version_type ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="patch">Patch</SelectItem>
              <SelectItem value="experimental">Experimental</SelectItem>
            </SelectContent>
          </Select>
          {errors.version_type && (
            <p className="text-xs text-red-600 mt-1">{errors.version_type[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
          Description
        </Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="What changed in this version? New features, improvements, bug fixes..."
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="release_notes" className="text-sm font-medium text-gray-700 mb-2">Release Notes</Label>
        <Textarea
          id="release_notes"
          rows={3}
          value={formData.release_notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, release_notes: e.target.value }))}
          placeholder="Detailed release notes for stakeholders..."
          className="w-full"
        />
      </div>
    </section>
  );
};

export default VersionBasicInfo;


