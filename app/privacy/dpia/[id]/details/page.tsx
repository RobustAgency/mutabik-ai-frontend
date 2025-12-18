import React from "react";
import DPIADetails from "@/components/app/dpia/details/DPIADetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <DPIADetails id={id} />;
};

export default page;

