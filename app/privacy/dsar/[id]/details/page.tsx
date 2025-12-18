"use client";

import React from "react";
import DSARDetails from "@/components/app/dataSubjectRequestAccesses/details/DSARDetails";
import { useParams } from "next/navigation";

const DSARDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Invalid DSAR ID</div>;
  }

  return <DSARDetails id={id} />;
};

export default DSARDetailsPage;

