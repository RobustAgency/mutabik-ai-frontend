"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAiAssetQuery } from "@/app/lib/features/aiAssetsApi";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface AiAssetDetailsProps {
  aiAssetId: string;
}

const Row: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-b border-[#E4E7EC] last:border-0">
    <div className="text-[#667085] text-sm">{label}</div>
    <div className="sm:col-span-2 text-sm text-[#1D2939] break-all">{value ?? "-"}</div>
  </div>
);

const AiAssetDetails: React.FC<AiAssetDetailsProps> = ({ aiAssetId }) => {
  const router = useRouter();
  const idNum = Number(aiAssetId);
  const { data, isLoading } = useGetAiAssetQuery(idNum, { skip: !idNum });

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-medium text-sm text-[#000]">AI Asset Details</h2>
            <p className="font-sans text-sm text-[#667085]">View vendor linkage and lifecycle dates</p>
          </div>
          <div className="flex gap-2">
            <PermissionGate permission={PERMISSIONS.AI_ASSETS_EDIT}>
              <Button
                variant="outline"
                className="text-[#667085]"
                onClick={() => router.push(`/core-assets/ai-assets/${aiAssetId}/edit`)}
              >
                Edit
              </Button>
            </PermissionGate>
          </div>
        </div>

        {isLoading || !data ? (
          <div className="text-sm text-[#667085]">Loading...</div>
        ) : (
          <div className="divide-y divide-transparent">
            <Row label="ID" value={`#${data.id}`} />
            <Row label="Vendor ID" value={data.vendor_id ?? "-"} />
            <Row label="Vendor Agreement ID" value={data.vendor_agreement_id ?? "-"} />
            <Row
              label="Vendor Effective From"
              value={data.vendor_effective_from ? new Date(data.vendor_effective_from).toLocaleString() : "-"}
            />
            <Row
              label="Vendor Effective To"
              value={data.vendor_effective_to ? new Date(data.vendor_effective_to).toLocaleString() : "-"}
            />
            <Row label="Vendor Assessment ID" value={data.vendor_assessment_id ?? "-"} />
            <Row
              label="Created At"
              value={data.created_at ? new Date(data.created_at).toLocaleString() : "-"}
            />
            <Row
              label="Updated At"
              value={data.updated_at ? new Date(data.updated_at).toLocaleString() : "-"}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiAssetDetails;


