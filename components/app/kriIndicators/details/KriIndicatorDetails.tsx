"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useGetKriIndicatorByIdQuery,
  useDeleteKriIndicatorMutation,
} from "@/app/lib/features/kriIndicatorApi";
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { Card, CardContent } from "@/components/ui/card";
import { formatCategory } from "@/lib/helpers/ui";
import { formatDate } from "@/utils/formatDate";

interface KriIndicatorDetailsProps {
  indicatorId: string;
}

const KriIndicatorDetails: React.FC<KriIndicatorDetailsProps> = ({ indicatorId }) => {
  const router = useRouter();
  const { data, isLoading, error } = useGetKriIndicatorByIdQuery(Number(indicatorId));
  const [deleteIndicator, { isLoading: isDeleting }] = useDeleteKriIndicatorMutation();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteIndicator(Number(id)).unwrap();
    },
    isDeleting,
    entityTypeName: "KRI Indicator",
    onSuccess: () => router.push("/governance/kri-indicators"),
  });

  const handleEdit = () => {
    router.push(`/governance/kri-indicators/${indicatorId}/edit`);
  };

  const handleDelete = () => {
    if (data) openDeleteDialog(indicatorId, data.name);
  };

  return (
    <>
      <EntityDetailsLayout
        title="KRI Indicator Details"
        description="View and manage KRI configuration"
        loading={isLoading}
        error={error ? "Failed to load KRI indicator" : null}
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
              <DetailItem label="Status" value={formatCategory(data.status)} />
              <DetailItem label="Name" value={data.name} />
              <DetailItem label="Definition" value={data.definition} full />
              <DetailItem
                label="Directionality"
                value={formatCategory(data.directionality)}
              />
              <DetailItem label="Unit" value={data.unit || "-"} />
              <DetailItem label="Sample Window" value={data.sample_window} />
              <DetailItem
                label="Threshold Warning"
                value={`${data.threshold_warning}${data.unit ? ` ${data.unit}` : ""}`}
              />
              <DetailItem
                label="Threshold Critical"
                value={`${data.threshold_critical}${data.unit ? ` ${data.unit}` : ""}`}
              />
              <DetailItem label="Data Source" value={data.data_source} />
              <DetailItem
                label="Collection Method"
                value={formatCategory(data.collection_method)}
              />
              <DetailItem label="Frequency" value={formatCategory(data.frequency)} />
              <DetailItem
                label="Alert Routing"
                value={formatCategory(data.alert_routing)}
              />
              <DetailItem
                label="Action on Breach"
                value={formatCategory(data.action_on_breach)}
              />
              <DetailItem label="Owner Team" value={data.owner_team} />
              <DetailItem label="Notes" value={data.notes || "-"} full />
              <DetailItem label="Created At" value={formatDate(data.created_at)} />
              <DetailItem label="Updated At" value={formatDate(data.updated_at)} />
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

export default KriIndicatorDetails;

