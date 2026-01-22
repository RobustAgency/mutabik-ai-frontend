"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ComplianceEvidenceForm } from "../shared/ComplianceEvidenceForm";
import {
  useGetComplianceEvidenceQuery,
  useUpdateComplianceEvidenceMutation,
} from "@/app/lib/features/complianceEvidenceApi";
import { useGetProjectQuery } from "@/app/lib/features/projectsApi";
import type { CreateComplianceEvidenceRequest } from "@/interfaces/ComplianceEvidence";
import type { FrameworkRequirement, FrameworkControl } from "@/app/lib/features/projectsApi";

interface EditComplianceEvidenceProps {
  id: number;
}

const EditComplianceEvidence: React.FC<EditComplianceEvidenceProps> = ({ id }) => {
  const router = useRouter();
  const { data: evidence, isLoading: isLoadingEvidence } =
    useGetComplianceEvidenceQuery(id);
  const [updateEvidence, { isLoading: isUpdating }] =
    useUpdateComplianceEvidenceMutation();

  // Fetch project details to get controls and requirements from framework
  const { data: project, isLoading: isLoadingProject } = useGetProjectQuery(
    evidence?.project_id ?? 0,
    { skip: !evidence?.project_id }
  );

  // Extract requirements from project framework
  const projectRequirements = useMemo(() => {
    if (!project?.framework?.requirements || !Array.isArray(project.framework.requirements)) {
      return undefined;
    }
    return project.framework.requirements as FrameworkRequirement[];
  }, [project]);

  // Extract all controls from all requirements (similar to ControlsList component)
  const projectControls = useMemo(() => {
    if (!projectRequirements || !Array.isArray(projectRequirements)) {
      return undefined;
    }

    const controls: FrameworkControl[] = [];
    projectRequirements.forEach((req) => {
      if (req.controls && Array.isArray(req.controls)) {
        controls.push(...req.controls);
      }
    });

    // Remove duplicates by id
    return Array.from(
      new Map(controls.map((ctrl) => [ctrl.id, ctrl])).values()
    );
  }, [projectRequirements]);

  const handleSubmit = async (data: Partial<CreateComplianceEvidenceRequest>) => {
    await updateEvidence({ id, data }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/compliance-evidences");
  };

  if (isLoadingEvidence || isLoadingProject) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Loading compliance evidence...</p>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Compliance evidence not found</p>
      </div>
    );
  }

  return (
    <ComplianceEvidenceForm
      mode="edit"
      initialData={evidence}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Compliance Evidence"
      description={`Update details for evidence #${evidence.id}`}
      projectRequirements={projectRequirements}
      projectControls={projectControls}
    />
  );
};

export default EditComplianceEvidence;

