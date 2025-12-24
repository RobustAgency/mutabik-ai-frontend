"use client";

import React from "react";
import RegulatorySubmissionDetails from "@/components/app/regulatorySubmissions/details/RegulatorySubmissionDetails";
import { useParams } from "next/navigation";

const RegulatorySubmissionDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Invalid regulatory submission ID</div>;
  }

  return <RegulatorySubmissionDetails id={id} />;
};

export default RegulatorySubmissionDetailsPage;

