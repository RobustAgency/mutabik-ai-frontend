import React from "react";
import ConsentRecordDetails from "@/components/app/consentRecords/details/ConsentRecordDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <ConsentRecordDetails id={id} />;
};

export default page;


