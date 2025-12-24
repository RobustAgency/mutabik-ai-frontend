"use client";

import React from "react";
import EditRegulatorySubmission from "@/components/app/regulatorySubmissions/edit/EditRegulatorySubmission";
import { useParams } from "next/navigation";

const EditRegulatorySubmissionPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id || isNaN(Number(id))) {
    return <div>Invalid regulatory submission ID</div>;
  }

  return <EditRegulatorySubmission id={Number(id)} />;
};

export default EditRegulatorySubmissionPage;

