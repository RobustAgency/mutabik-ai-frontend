import React from "react";
import ConsentRecordDetails from "@/components/app/consentRecords/details/ConsentRecordDetails";

interface PageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: PageProps) => {
  return <ConsentRecordDetails id={params.id} />;
};

export default page;


