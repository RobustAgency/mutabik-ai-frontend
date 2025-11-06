"use client";

import React from "react";
import { useParams } from "next/navigation";
import ArtifactAccessLogDetails from "@/components/app/aiModel/artifactAccessLogs/ArtifactAccessLogDetails";

const Page = () => {
  const params = useParams();
  const logId = params?.id as string;

  if (!logId) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <p className="text-sm text-red-500">Invalid log ID</p>
      </div>
    );
  }

  return <ArtifactAccessLogDetails logId={logId} />;
};

export default Page;

