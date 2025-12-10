"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { FormState } from "../types";
import { RiskCategory, RiskStatus } from "@/interfaces/AiRiskRegister";
import { formatRiskCategory, formatRiskStatus } from "@/utils/riskUtils";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import AiModelVersionModalForm from "@/components/app/aiModel/versions/AiModelVersionModalForm";
import UseCaseModalForm from "@/components/app/useCases/create/UseCaseModalForm";

interface BasicInformationStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  aiModels: any[];
  isModelsLoading: boolean;
  filteredVersions: any[];
  isVersionsLoading: boolean;
  useCases: any[];
  isUseCasesLoading: boolean;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  aiModels,
  isModelsLoading,
  filteredVersions,
  isVersionsLoading,
  useCases,
  isUseCasesLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          value={formState.title}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Model Bias Risk"
          className={`h-[44px] w-full px-4 rounded-lg border ${
            validationErrors.title ? "border-red-500" : "border-[#D0D5DD]"
          } focus:border-[#D0D5DD] focus:-ring-0`}
        />
        {validationErrors.title && (
          <p className="text-sm text-red-500">{validationErrors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          value={formState.descriptionInput}
          onChange={(e) => {
            const value = e.target.value;
            setFormState((prev) => ({
              ...prev,
              descriptionInput: value,
              description: value,
            }));
          }}
          onBlur={() => {
            setFormState((prev) => ({
              ...prev,
              description: prev.descriptionInput,
            }));
          }}
          rows={4}
          placeholder="Describe the risk in detail (required)..."
          className={`min-h-24 resize-none ${
            validationErrors.description ? "border-red-500" : ""
          }`}
        />
        {validationErrors.description && (
          <p className="text-sm text-red-500">{validationErrors.description[0]}</p>
        )}
        <p className="text-xs text-gray-500">
          {formState.descriptionInput.length} characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="risk_category">Risk Category <span className="text-red-500">*</span></Label>
          <Select
            value={formState.risk_category}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                risk_category: value as RiskCategory,
              }))
            }
          >
            <SelectTrigger
              className={`w-full ${
                validationErrors.risk_category ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select risk category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RiskCategory).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatRiskCategory(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.risk_category && (
            <p className="text-sm text-red-500">{validationErrors.risk_category[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
          <Select
            value={formState.status}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                status: value as RiskStatus,
              }))
            }
          >
            <SelectTrigger
              className={`w-full ${
                validationErrors.status ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RiskStatus).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatRiskStatus(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.status && (
            <p className="text-sm text-red-500">{validationErrors.status[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ai_model_id">AI Model <span className="text-red-500">*</span></Label>
          <SelectWithInlineCreate
            key={`ai_model_id-${formState.ai_model_id ?? "none"}`}
            value={formState.ai_model_id || undefined}
            onValueChange={(value) => {
              setFormState((prev) => ({
                ...prev,
                ai_model_id: value || "",
                // Reset version when model changes
                ai_model_version_id:
                  value !== prev.ai_model_id ? "" : prev.ai_model_version_id,
              }));
            }}
            options={aiModels.map((model: any) => ({
              id: model.id,
              label: model.name,
              value: String(model.id),
            }))}
            isLoading={isModelsLoading}
            isEmpty={!isModelsLoading && aiModels.length === 0}
            entityName="AI Model"
            modalForm={AiModelModalForm}
            placeholder="Select AI Model"
            error={!!validationErrors.ai_model_id}
          />
          {validationErrors.ai_model_id && (
            <p className="text-sm text-red-500">{validationErrors.ai_model_id[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ai_model_version_id">AI Model Version</Label>
          <SelectWithInlineCreate
            key={`ai_model_version_id-${formState.ai_model_version_id ?? "none"}`}
            value={formState.ai_model_version_id || undefined}
            onValueChange={(value) => {
              setFormState((prev) => ({
                ...prev,
                ai_model_version_id: value || "",
              }));
            }}
            options={filteredVersions.map((version: any) => ({
              id: version.id,
              label:
                version.version_number ||
                version.version ||
                `Version ${version.id}`,
              value: String(version.id),
            }))}
            isLoading={isVersionsLoading}
            isEmpty={
              !isVersionsLoading &&
              !!formState.ai_model_id &&
              filteredVersions.length === 0
            }
            entityName="Model Version"
            modalForm={AiModelVersionModalForm}
            placeholder={
              !formState.ai_model_id
                ? "Select AI model first"
                : "Select model version (optional)"
            }
            disabled={!formState.ai_model_id}
            error={!!validationErrors.ai_model_version_id}
          />
          {validationErrors.ai_model_version_id && (
            <p className="text-sm text-red-500">
              {validationErrors.ai_model_version_id[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="use_case_id">Use Case</Label>
          <SelectWithInlineCreate
            key={`use_case_id-${formState.use_case_id ?? "none"}`}
            value={formState.use_case_id || undefined}
            onValueChange={(value) => {
              setFormState((prev) => ({
                ...prev,
                use_case_id: value || "",
              }));
            }}
            options={useCases.map((useCase: any) => ({
              id: useCase.id,
              label:
                useCase.name ||
                useCase.use_case_title ||
                useCase.title ||
                `Use Case ${useCase.id}`,
              value: String(useCase.id),
            }))}
            isLoading={isUseCasesLoading}
            isEmpty={!isUseCasesLoading && useCases.length === 0}
            entityName="Use Case"
            modalForm={UseCaseModalForm}
            placeholder="Select use case (optional)"
            error={!!validationErrors.use_case_id}
          />
          {validationErrors.use_case_id && (
            <p className="text-sm text-red-500">{validationErrors.use_case_id[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="related_controls">Related Controls (comma separated)</Label>
        <Input
          id="related_controls"
          value={formState.related_controls}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              related_controls: e.target.value,
            }))
          }
          placeholder="control_1, control_2"
        />
      </div>
    </div>
  );
};

