"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useGetAiRiskTreatmentByIdQuery,
  useDeleteAiRiskTreatmentMutation,
} from "@/app/lib/features/aiRiskTreatmentApi";
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { Card, CardContent } from "@/components/ui/card";
import { formatCategory } from "@/lib/helpers/ui";
import { formatDate } from "@/utils/formatDate";

interface AiRiskTreatmentDetailsProps {
  treatmentId: string;
}

const AiRiskTreatmentDetails: React.FC<AiRiskTreatmentDetailsProps> = ({
  treatmentId,
}) => {
  const router = useRouter();
  const { data, isLoading, error } = useGetAiRiskTreatmentByIdQuery(
    Number(treatmentId)
  );
  const [deleteTreatment, { isLoading: isDeleting }] =
    useDeleteAiRiskTreatmentMutation();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteTreatment(Number(id)).unwrap();
    },
    isDeleting,
    entityTypeName: "AI Risk Treatment",
    onSuccess: () => router.push("/risk-compliance/ai-risk-management/treatment"),  
  });

  const handleEdit = () => {
    router.push(`/risk-compliance/ai-risk-management/treatment/${treatmentId}/edit`);
  };

  const handleDelete = () => {
    if (data) openDeleteDialog(treatmentId, data.plan_summary);
  };

  return (
    <>
      <EntityDetailsLayout
        title="AI Risk Treatment Details"
        description="View and manage treatment plan"
        loading={isLoading}
        error={error ? "Failed to load treatment plan" : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      >
        {data && (
          <Card className="border-0 shadow-none">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0">
              <DetailItem
                label="AI Risk Register ID"
                value={data.ai_risk_register_id.toString()}
              />
              <DetailItem
                label="Treatment Type"
                value={formatCategory(data.treatment_type)}
              />
              <DetailItem label="Status" value={formatCategory(data.status)} />
              <DetailItem
                label="Due Date"
                value={formatDate(data.due_date)}
              />
              <DetailItem
                label="Owner Stakeholder ID"
                value={data.owner_stakeholder_id.toString()}
              />
              <DetailItem
                label="Expected Residual Level"
                value={data.expected_residual_level || "-"}
              />
              <DetailItem
                label="Result Verification"
                value={
                  data.result_verification
                    ? formatCategory(data.result_verification)
                    : "-"
                }
              />
              <DetailItem label="Evidence Link" value={data.evidence_link || "-"} />
              <DetailItem label="Linked CAPA ID" value={data.linked_capa_id || "-"} />
              <DetailItem label="Closed At" value={data.closed_at ? formatDate(data.closed_at) : "-"} />
              <DetailItem label="Assignees" value={data.assignee?.join(", ") || "-"} full />
              <DetailItem label="Plan Summary" value={data.plan_summary} full />
            </CardContent>
          </Card>
        )}
      </EntityDetailsLayout>
      <DeleteConfirmationDialog />
    </>
  );
};

const DetailItem = ({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <p className="text-xs font-medium text-[#667085]">{label}</p>
    <p className="text-sm font-normal text-[#1D2939] mt-1 whitespace-pre-wrap">
      {value || "-"}
    </p>
  </div>
);

export default AiRiskTreatmentDetails;

