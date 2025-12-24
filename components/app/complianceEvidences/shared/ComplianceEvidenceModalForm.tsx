"use client";

import React, { useMemo } from "react";
import { ComplianceEvidenceForm } from "./ComplianceEvidenceForm";
import { useCreateComplianceEvidenceMutation } from "@/app/lib/features/complianceEvidenceApi";
import type { CreateComplianceEvidenceRequest, ComplianceEvidence } from "@/interfaces/ComplianceEvidence";
import type { Project, FrameworkRequirement, FrameworkControl } from "@/app/lib/features/projectsApi";

interface ComplianceEvidenceModalFormProps {
  project: Project;
  onSuccess?: (createdItem: any) => void;
  onCancel?: () => void;
}

/**
 * Inline-create adapter for Compliance Evidence to work with InlineCreateModal.
 * Renders the full multi-step form inside the modal and surfaces the created item
 * back to the parent on success.
 */
export const ComplianceEvidenceModalForm: React.FC<ComplianceEvidenceModalFormProps> = ({
  project,
  onSuccess,
  onCancel,
}) => {
  const [createEvidence, { isLoading }] = useCreateComplianceEvidenceMutation();

  // Extract requirements and controls from project's framework
  const { projectRequirements, projectControls } = useMemo(() => {
    if (!project.framework || !Array.isArray(project.framework.requirements)) {
      return { projectRequirements: undefined, projectControls: undefined };
    }

    const requirements = project.framework.requirements as FrameworkRequirement[];
    
    // Extract all controls from all requirements (flatten)
    const allControls: FrameworkControl[] = [];
    requirements.forEach((req) => {
      if (req.controls && Array.isArray(req.controls)) {
        allControls.push(...req.controls);
      }
    });

    // Remove duplicate controls by id
    const uniqueControls = Array.from(
      new Map(allControls.map((ctrl) => [ctrl.id, ctrl])).values()
    );

    return {
      projectRequirements: requirements,
      projectControls: uniqueControls,
    };
  }, [project.framework]);

  // Create initial data with pre-filled ai_model_id from project
  const initialData: Partial<ComplianceEvidence> | undefined = project.ai_model_id
    ? {
        ai_model_id: project.ai_model_id,
      }
    : undefined;

  const handleSubmit = async (
    data: CreateComplianceEvidenceRequest | Partial<CreateComplianceEvidenceRequest>
  ) => {
    const payload: CreateComplianceEvidenceRequest = {
      ...(data as CreateComplianceEvidenceRequest),
      // Ensure ai_model_id is set from project if not already set
      ai_model_id: data.ai_model_id ?? project.ai_model_id ?? null,
      // Add project_id from the current project
      project_id: project.id,
    };
    const result = await createEvidence(payload).unwrap();
    onSuccess?.((result as any)?.data ?? result);
  };

  const handleSuccess = () => {
    onSuccess?.(null);
  };

  return (
    <ComplianceEvidenceForm
      key={`compliance-form-${project.id}`}
      mode="create"
      initialData={initialData as ComplianceEvidence}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Upload Compliance Evidence"
      description="Fill in the details to upload compliance evidence for this project"
      projectRequirements={projectRequirements}
      projectControls={projectControls}
      hideHeader={true}
    />
  );
};

