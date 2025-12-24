"use client";

import React, { useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ComplianceEvidenceForm } from "@/components/app/complianceEvidences/shared/ComplianceEvidenceForm";
import { useCreateComplianceEvidenceMutation } from "@/app/lib/features/complianceEvidenceApi";
import type { CreateComplianceEvidenceRequest, ComplianceEvidence } from "@/interfaces/ComplianceEvidence";
import type { Project, FrameworkRequirement, FrameworkControl } from "@/app/lib/features/projectsApi";

interface ComplianceEvidenceUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export const ComplianceEvidenceUploadDialog: React.FC<
  ComplianceEvidenceUploadDialogProps
> = ({ open, onOpenChange, project }) => {
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

  const handleSubmit = useCallback(async (
    data: CreateComplianceEvidenceRequest | Partial<CreateComplianceEvidenceRequest>
  ) => {
    const payload: CreateComplianceEvidenceRequest = {
      ...(data as CreateComplianceEvidenceRequest),
      // Ensure ai_model_id is set from project if not already set
      ai_model_id: data.ai_model_id ?? project.ai_model_id ?? null,
      // Add project_id from the current project
      project_id: project.id,
    };
    await createEvidence(payload).unwrap();
  }, [createEvidence, project.id, project.ai_model_id]);

  const handleSuccess = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl!">
        <DialogHeader>
          <DialogTitle>Upload Compliance Evidence</DialogTitle>
          <DialogDescription>
            Create a new compliance evidence for this project
            {project.framework && (
              <span className="block mt-1 text-xs text-gray-500">
                Framework: {project.framework.name}
                {project.framework.version && ` (${project.framework.version})`}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

