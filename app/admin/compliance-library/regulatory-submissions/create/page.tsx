"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RegulatorySubmissionForm from "@/components/admin/regulatory-submissions/RegulatorySubmissionForm";
import { useRegulatorySubmissionMutations } from "@/hooks/admin/useRegulatorySubmissions";
import { CreateRegulatorySubmissionRequest, UpdateRegulatorySubmissionRequest } from "@/interfaces/RegulatorySubmission";

export default function CreateRegulatorySubmissionPage() {
  const router = useRouter();
  const { createRegulatorySubmission } = useRegulatorySubmissionMutations();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (data: CreateRegulatorySubmissionRequest | UpdateRegulatorySubmissionRequest) => {
    try {
      setServerErrors({});
      await createRegulatorySubmission(data as CreateRegulatorySubmissionRequest);
      router.push("/admin/compliance-library/regulatory-submissions");
    } catch (err: any) {
      setServerErrors(err?.data?.errors || {});
      throw err;
    }
  };

  return (
    <RegulatorySubmissionForm
      mode="create"
      onSubmit={handleSubmit}
      serverErrors={serverErrors}
    />
  );
}

