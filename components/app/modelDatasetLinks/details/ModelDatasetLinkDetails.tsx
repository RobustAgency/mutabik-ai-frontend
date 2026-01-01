"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetModelDatasetLinkQuery } from "@/app/lib/features/modelDatasetLinksApi";
import ModelDatasetLinkFormReadOnly from "./ModelDatasetLinkFormReadOnly";

interface ModelDatasetLinkDetailsProps {
  linkId: number;
}

const ModelDatasetLinkDetails: React.FC<ModelDatasetLinkDetailsProps> = ({ linkId }) => {
  const router = useRouter();
  const { data: link, isLoading, error } = useGetModelDatasetLinkQuery(linkId);

  const handleEdit = () => {
    router.push(`/core-assets/data/model-links/${linkId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading model-dataset link details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load model-dataset link details</p>
            <Button onClick={() => router.push("/core-assets/data/model-links")} className="bg-[#4FD58F] text-white">
              Back to Model-Dataset Links
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-6">
          <div>
            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Model-Dataset Link Details</h1>
            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View and manage model-dataset link information</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
          </div>
        </div>

        <CardContent className="space-y-6">
          <ModelDatasetLinkFormReadOnly link={link} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelDatasetLinkDetails;

