"use client";

import React, { useMemo } from "react";
import { useGetRecordOfProcessingActivitiesQuery } from "@/app/lib/features/recordOfProcessingActivitiesApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import RopaModalForm from "@/components/app/recordOfProcessingActivities/create/RopaModalForm";

interface SingleRopaSelectorProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  error?: string;
}

const SingleRopaSelector: React.FC<SingleRopaSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select processing activity",
  error,
}) => {
  const { data: ropaData, isLoading } =
    useGetRecordOfProcessingActivitiesQuery({ per_page: 100 } as any);

  const activities = ropaData?.data ?? [];

  const options = useMemo(
    () =>
      activities.map((activity: any) => ({
        id: activity.id,
        value: String(activity.id),
        label: activity.activity_name,
      })),
    [activities]
  );

  const handleChange = (val: string) => {
    if (!val) {
      onChange(null);
    } else {
      const num = Number(val);
      onChange(Number.isNaN(num) ? null : num);
    }
  };

  return (
    <div className="space-y-2">
      <SelectWithInlineCreate
        key={`ropa-${value || "none"}`}
        value={value ? String(value) : ""}
        onValueChange={handleChange}
        placeholder={placeholder}
        disabled={isLoading}
        options={options}
        isLoading={isLoading}
        isEmpty={options.length === 0}
        entityName="ROPA"
        modalForm={RopaModalForm}
        canCreate={true}
        triggerClassName={`w-full ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SingleRopaSelector;


