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

const VersionTechnical: React.FC<Props> = ({ formData, setFormData, errors }) => {
  const handleArrayChange = (field: 'input_modalities' | 'output_modalities', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter(v => v !== value),
    }));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">Technical</h2>
        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Architecture, complexity and modalities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Architecture Type <span className="text-red-500">*</span></Label>
          <Input
            value={formData.architecture_type}
            onChange={(e) => setFormData(prev => ({ ...prev, architecture_type: e.target.value }))}
            placeholder="transformer, cnn, rnn, etc."
            className={`w-full ${errors.architecture_type ? "border-red-500 focus:border-red-500" : ""}`}
          />
          {errors.architecture_type && (
            <p className="text-xs text-red-600 mt-1">{errors.architecture_type[0]}</p>
          )}
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Complexity Level <span className="text-red-500">*</span></Label>
          <Select
            value={formData.complexity_level}
            onValueChange={(value) => setFormData(prev => ({ ...prev, complexity_level: value as any }))}
          >
            <SelectTrigger className={errors.complexity_level ? "border-red-500 focus:border-red-500" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['simple','moderate','complex','massive'].map(v => (
                <SelectItem key={v} value={v}>{v.replace('_',' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.complexity_level && (
            <p className="text-xs text-red-600 mt-1">{errors.complexity_level[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Parameter Count</Label>
          <Input
            type="number"
            value={formData.parameter_count ?? ''}
            onChange={(e) => setFormData(prev => ({ ...prev, parameter_count: e.target.value ? parseInt(e.target.value) : null }))}
            placeholder="175000000000"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Model File Size (GB) <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            step="0.001"
            value={formData.model_file_size_gb ?? ''}
            onChange={(e) => setFormData(prev => ({ ...prev, model_file_size_gb: e.target.value ? parseFloat(e.target.value) : 0 }))}
            placeholder="2.5"
            className={`w-full ${errors.model_file_size_gb ? "border-red-500 focus:border-red-500" : ""}`}
          />
          {errors.model_file_size_gb && (
            <p className="text-xs text-red-600 mt-1">{errors.model_file_size_gb[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2">Training Duration (hours)</Label>
        <Input
          type="number"
          value={formData.training_duration_hours ?? ''}
          onChange={(e) => setFormData(prev => ({ ...prev, training_duration_hours: e.target.value ? parseInt(e.target.value) : null }))}
          placeholder="24"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2">Input Modalities</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['text','image','audio','video','structured_data','time_series'].map(mod => (
            <div key={mod} className="flex items-center space-x-2">
              <Checkbox
                id={`input_${mod}`}
                checked={formData.input_modalities.includes(mod)}
                onCheckedChange={(checked) => handleArrayChange('input_modalities', mod, checked as boolean)}
              />
              <Label htmlFor={`input_${mod}`} className="text-sm text-gray-700">{mod.replace('_',' ')}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2">Output Modalities</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['text','image','audio','classification','regression','embedding','structured_data'].map(mod => (
            <div key={mod} className="flex items-center space-x-2">
              <Checkbox
                id={`output_${mod}`}
                checked={formData.output_modalities.includes(mod)}
                onCheckedChange={(checked) => handleArrayChange('output_modalities', mod, checked as boolean)}
              />
              <Label htmlFor={`output_${mod}`} className="text-sm text-gray-700">{mod.replace('_',' ')}</Label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VersionTechnical;


