"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useGetAiRiskRegisterByIdQuery,
  useDeleteAiRiskRegisterMutation,
} from "@/app/lib/features/aiRiskRegisterApi";
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { Card, CardContent } from "@/components/ui/card";
import { formatCategory } from "@/lib/helpers/ui";
import { formatDate } from "@/utils/formatDate";

interface AiRiskRegisterDetailsProps {
  riskId: string;
}

const AiRiskRegisterDetails: React.FC<AiRiskRegisterDetailsProps> = ({ riskId }) => {
  const router = useRouter();
  const { data, isLoading, error } = useGetAiRiskRegisterByIdQuery(Number(riskId));
  const [deleteRisk, { isLoading: isDeleting }] = useDeleteAiRiskRegisterMutation();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteRisk(Number(id)).unwrap();
    },
    isDeleting,
    entityTypeName: "AI Risk",
    onSuccess: () => router.push("/risk-compliance/ai-risk-management/register"),
  });

  const handleEdit = () => {
    router.push(`/risk-compliance/ai-risk-management/register/${riskId}/edit`);
  };

  const handleDelete = () => {
    if (data) openDeleteDialog(riskId, data.title);
  };

  return (
    <>
      <EntityDetailsLayout
        title="AI Risk Details"
        description="View and manage AI risk entry"
        loading={isLoading}
        error={error ? "Failed to load AI risk entry" : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      >
        {data && (
          <Card className="border-0 shadow-none">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0">
              <DetailItem label="Title" value={data.title} />
              <DetailItem label="Risk Category" value={formatCategory(data.risk_category)} />
              <DetailItem label="Risk Level" value={formatCategory(data.risk_level)} />
              <DetailItem label="Decision" value={formatCategory(data.decision)} />
              <DetailItem label="Status" value={formatCategory(data.status)} />
              <DetailItem label="Next Review Due" value={formatDate(data.next_review_due)} />
              <DetailItem label="AI Model ID" value={data.ai_model_id?.toString()} />
              <DetailItem
                label="AI Model Version ID"
                value={data.ai_model_version_id ? data.ai_model_version_id.toString() : "-"}
              />
              <DetailItem
                label="Use Case ID"
                value={data.use_case_id ? data.use_case_id.toString() : "-"}
              />
              <DetailItem label="Risk Owner (Stakeholder ID)" value={data.risk_owner.toString()} />
              <DetailItem label="Review Cadence" value={formatCategory(data.review_cadence)} />
              <DetailItem label="Likelihood Code" value={data.likelihood_code} />
              <DetailItem label="Impact Code" value={data.impact_code} />
              <DetailItem label="Inherent Score" value={data.inherent_score || "-"} />
              <DetailItem label="Residual Score" value={data.residual_score || "-"} />
              <DetailItem label="Evidence Link" value={data.evidence_link || "-"} />
              <DetailItem label="Linked Assessment ID" value={data.linked_assessment_id?.toString() || "-"} />
              <DetailItem label="Linked Incident ID" value={data.linked_incident_id?.toString() || "-"} />
              <DetailItem label="Linked CAPA ID" value={data.linked_capa_id?.toString() || "-"} />
              <DetailItem label="Created By" value={data.created_by} />
              <DetailItem label="Likelihood Snapshot" value={data.likelihood_label_snapshot || "-"} />
              <DetailItem label="Impact Snapshot" value={data.impact_label_snapshot || "-"} />
              <DetailItem label="Method Name Snapshot" value={data.method_name_snapshot || "-"} />
              <DetailItem label="Description" value={data.description} full />
              <DetailItem
                label="Related Controls"
                value={data.related_controls && data.related_controls.length > 0 ? data.related_controls.join(", ") : "-"}
                full
              />
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

export default AiRiskRegisterDetails;

