"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import KriIndicatorForm from "../create/KriIndicatorForm";
import {
  useGetKriIndicatorByIdQuery,
  useUpdateKriIndicatorMutation,
} from "@/app/lib/features/kriIndicatorApi";
import { UpdateKriIndicatorData } from "@/interfaces/KriIndicator";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EditKriIndicatorProps {
  indicatorId: string;
}

const EditKriIndicator: React.FC<EditKriIndicatorProps> = ({ indicatorId }) => {
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetKriIndicatorByIdQuery(
    Number(indicatorId)
  );
  const [updateIndicator, { isLoading }] = useUpdateKriIndicatorMutation();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (payload: UpdateKriIndicatorData) => {
    setServerErrors({});
    try {
      await updateIndicator({ id: Number(indicatorId), data: payload }).unwrap();
      router.push(`/risk-compliance/ai-risk-management/kri/${indicatorId}/details`);
    } catch (err: any) {
      if (err?.data?.errors) setServerErrors(err.data.errors);
      throw err;
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#4FD58F]" />
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6">
          <p className="text-sm text-red-500">Failed to load KRI Indicator.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-sans font-semibold text-2xl text-[#1D2939]">
          Edit KRI Indicator
        </h1>
        <p className="font-sans font-normal text-sm text-[#667085]">
          Update thresholds, collection method, and alerts.
        </p>
      </div>

      <KriIndicatorForm
        initialData={data}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </div>
  );
};

export default EditKriIndicator;

