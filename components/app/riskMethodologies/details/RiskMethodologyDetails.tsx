"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useGetRiskMethodologyByIdQuery,
  useDeleteRiskMethodologyMutation,
} from "@/app/lib/features/riskMethodologyApi";
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { Card, CardContent } from "@/components/ui/card";

interface RiskMethodologyDetailsProps {
  methodologyId: string;
}

const RiskMethodologyDetails: React.FC<RiskMethodologyDetailsProps> = ({
  methodologyId,
}) => {
  const router = useRouter();
  const { data, isLoading, error } = useGetRiskMethodologyByIdQuery(
    Number(methodologyId)
  );
  const [deleteMethodology, { isLoading: isDeleting }] =
    useDeleteRiskMethodologyMutation();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteMethodology(Number(id)).unwrap();
    },
    isDeleting,
    entityTypeName: "Risk Methodology",
    onSuccess: () => router.push("/risk-compliance/ai-risk-management/methodologies"),
  });

  const handleEdit = () => {
        router.push(`/risk-compliance/ai-risk-management/methodologies/${methodologyId}/edit`);
  };

  const handleDelete = () => {
    if (data) {
      openDeleteDialog(methodologyId, data.name);
    }
  };

  return (
    <>
      <EntityDetailsLayout
        title="Risk Methodology Details"
        description="View and manage risk methodology information"
        loading={isLoading}
        error={error ? "Failed to load risk methodology" : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      >
        {data && (
          <Card className="border-0 shadow-none">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0">
              <DetailItem label="Name" value={data.name} />
              <DetailItem label="Owner Team" value={data.owner_team} />
              <DetailItem
                label="Effective From"
                value={data.effective_from || "-"}
              />
              <DetailItem label="Effective To" value={data.effective_to || "Current"} />
              <DetailItem label="Acceptance Thresholds" value={data.acceptance_thresholds} />
              <DetailItem label="Review Policy" value={data.review_policy} full />
              <DetailItem
                label="Aggregation Logic"
                value={data.aggregation_logic || "-"}
                full
              />
              <DetailItem
                label="Likelihood Scale"
                value={JSON.stringify(data.likelihood_scale, null, 2)}
                full
                mono
              />
              <DetailItem
                label="Impact Scale"
                value={JSON.stringify(data.impact_scale, null, 2)}
                full
                mono
              />
              <DetailItem
                label="Matrix Rule"
                value={JSON.stringify(data.matrix_rule, null, 2)}
                full
                mono
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
  mono,
}: {
  label: string;
  value: string;
  full?: boolean;
  mono?: boolean;
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <p className="text-xs font-medium text-[#667085]">{label}</p>
    <p
      className={`text-sm font-normal text-[#1D2939] mt-1 whitespace-pre-wrap ${
        mono ? "font-mono text-xs" : ""
      }`}
    >
      {value || "-"}
    </p>
  </div>
);

export default RiskMethodologyDetails;

