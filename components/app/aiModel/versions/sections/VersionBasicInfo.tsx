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
import { InfoTooltip } from "@/components/custom/InfoTooltip";

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
        <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">
          Basic Information
        </h2>
        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
          Provide general information for this model version.
        </p>
      </div>

      <div>
        <Label htmlFor="ai_model_id" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          Parent Model <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <SelectWithInlineCreate
          key={`ai_model_id-${formData.ai_model_id || "none"}`}
          value={formData.ai_model_id ? String(formData.ai_model_id) : "0"}
          onValueChange={(value) => setFormData(prev => ({ ...prev, ai_model_id: parseInt(value) }))}
          options={aiModels.map((model) => {
            // Backward compatibility: support both new and old field names
            const modelCategory = (model as any).category || (model as any).model_category || (model as any).primary_category || "";
            const categoryLabel = modelCategory.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
            return {
              id: model.id,
              label: `${model.name} (${categoryLabel || 'N/A'})`,
              value: String(model.id),
            };
          })}
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
          <Label htmlFor="version_number" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            Version Number <span className="text-red-500 ml-0.5">*</span>
            <InfoTooltip content="A semantic version number, e.g. 1.2.0." />
          </Label>
          <Input
            id="version_number"
            value={formData.version_number}
            onChange={(e) => setFormData(prev => ({ ...prev, version_number: e.target.value }))}
            placeholder="1.2.0"
            className={`w-full ${errors.version_number ? "border-red-500 focus:border-red-500 w-full" : "w-full"}`}
          />
          <p className="text-xs text-gray-500 mt-1">Semantic versioning (major.minor.patch).</p>
          {errors.version_number && (
            <p className="text-xs text-red-600 mt-1">{errors.version_number[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="version_type" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            Version Type <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Select
            key={`version_type-${formData.version_type || "none"}`}
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
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="What changed in this version? New features, improvements, bug fixes..."
          className="min-h-32 resize-none w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="release_date" className="text-sm font-medium text-gray-700 mb-2">
            Release Date
          </Label>
          <Input
            id="release_date"
            type="date"
            value={formData.release_date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value || null }))}
            placeholder="YYYY-MM-DD"
            className="w-full"
          />
          {errors.release_date && (
            <p className="text-xs text-red-600 mt-1">{errors.release_date[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="release_notes" className="text-sm font-medium text-gray-700 mb-2">Release Notes</Label>
        <Textarea
          id="release_notes"
          value={formData.release_notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, release_notes: e.target.value }))}
          placeholder="Detailed release notes for stakeholders..."
          className="min-h-32 resize-none w-full"
        />
      </div>
    </section>
  );
};

export default VersionBasicInfo;


