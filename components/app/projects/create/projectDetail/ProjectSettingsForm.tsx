"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  projectSchema,
  type ProjectFormData,
} from "@/lib/schemas/project.schema";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useUpdateProjectMutation, type Project } from "@/app/lib/features/projectsApi";

interface ProjectSettingsFormProps {
  project: Project;
}

export const ProjectSettingsForm: React.FC<ProjectSettingsFormProps> = ({
  project,
}) => {
  const [updateProject, { isLoading: loading }] = useUpdateProjectMutation();
  const { data: aiModels = [] } = useGetAiModelsQuery({ per_page: 100 });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      ai_model_id: project.ai_model_id ?? undefined,
      name: project.name,
      description: project.description ?? "",
      governance_pillar: project.governance_pillar as GovernancePillar,
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      ai_model_id: project.ai_model_id ?? undefined,
      name: project.name,
      description: project.description ?? "",
      governance_pillar: project.governance_pillar as GovernancePillar,
    });
  }, [project, reset]);

  const onSubmit = async (values: ProjectFormData) => {
    try {
      const payload = {
        ai_model_id: values.ai_model_id,
        name: values.name.trim(),
        description: values.description?.trim() || null,
        governance_pillar: values.governance_pillar,
      };
      await updateProject({ id: project.id, data: payload }).unwrap();
    } catch (error) {
      // Error handling is done by the API (toast notification)
      console.error("Failed to update project:", error);
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mb-6">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-semibold text-lg text-[#1D2939]">
              Project settings
            </h2>
            <p className="text-sm text-[#667085]">
              Update basic information about this project.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-[#344054] flex items-center gap-1">
                  AI Model <span className="text-red-500">*</span>
                </Label>
                <Select
                  key={`ai_model_id-${watch("ai_model_id")?.toString() ?? ""}`}
                  value={watch("ai_model_id")?.toString() ?? ""}
                  onValueChange={(value) =>
                    setValue("ai_model_id", Number(value), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full mt-1 h-10 border-[#D0D5DD]">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {(aiModels || []).map((model: any) => (
                        <SelectItem key={model.id} value={String(model.id)}>
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

              <div>
                <Label className="text-sm font-medium text-[#344054] flex items-center gap-1">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("name")}
                  className="mt-1 h-10 border-[#D0D5DD]"
                  placeholder="Project name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-[#344054]">
                  Description
                </Label>
                <Textarea
                  {...register("description")}
                  className="mt-1 min-h-[100px] border-[#D0D5DD]"
                  placeholder="Describe the purpose, scope and key stakeholders of this project."
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-[#344054] flex items-center gap-1">
                  Governance pillar <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("governance_pillar") as string}
                  onValueChange={(value) =>
                    setValue("governance_pillar", value as GovernancePillar, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full mt-1 h-10 border-[#D0D5DD]">
                    <SelectValue placeholder="Select pillar" />
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
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !isDirty}
              className="h-10 px-6 bg-[#4FD58F] text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};


