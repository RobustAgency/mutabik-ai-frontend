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
  const handleEnvChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deployment_environments: checked
        ? [...(prev.deployment_environments || []), value]
        : (prev.deployment_environments || []).filter(v => v !== value),
    }));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">Deployment</h2>
        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Deployment status, lifecycle and compliance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Compliance Check Status <span className="text-red-500">*</span></Label>
          <Select
            value={formData.compliance_check_status || 'compliant'}
            onValueChange={(value) => setFormData(prev => ({ ...prev, compliance_check_status: value as any }))}
          >
            <SelectTrigger className={errors.compliance_check_status ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['compliant', 'non_compliant', 'under_review', 'not_checked'].map(v => (
                <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.compliance_check_status && (
            <p className="text-xs text-red-600 mt-1">{errors.compliance_check_status[0]}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Validation Status <span className="text-red-500">*</span></Label>
          <Select
            value={formData.validation_status || 'not_validated'}
            onValueChange={(value) => setFormData(prev => ({ ...prev, validation_status: value as any }))}
          >
            <SelectTrigger className={errors.validation_status ? "border-red-500 focus:border-red-500 w-full" : "w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['not_validated', 'in_progress', 'passed', 'failed'].map(v => (
                <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.validation_status && (
            <p className="text-xs text-red-600 mt-1">{errors.validation_status[0]}</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Release Date</Label>
          <Input
            type="date"
            value={formData.release_date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value || null }))}
          />
        </div>
        <div className="flex items-center gap-3 mt-6 sm:mt-0">
          <Checkbox
            id="has_performance_data"
            checked={formData.has_performance_data}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_performance_data: checked as boolean }))}
          />
          <Label htmlFor="has_performance_data" className="text-sm text-gray-700">Has Performance Data?</Label>
        </div>
        <div className="flex items-center gap-3 mt-6 sm:mt-0">
          <Checkbox
            id="performance_baseline_established"
            checked={formData.performance_baseline_established}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, performance_baseline_established: checked as boolean }))}
          />
          <Label htmlFor="performance_baseline_established" className="text-sm text-gray-700">Performance Baseline Established</Label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="rollback_available"
          checked={formData.rollback_available || false}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rollback_available: checked as boolean }))}
        />
        <Label htmlFor="rollback_available" className="text-sm text-gray-700">Rollback Available</Label>
      </div>
    </section>
  );
};

export default VersionDeployment;


