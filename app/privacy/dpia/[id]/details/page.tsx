import React from "react";
import DPIADetails from "@/components/app/dpia/details/DPIADetails";

interface PageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: PageProps) => {
  return <DPIADetails id={params.id} />;
};

export default page;

