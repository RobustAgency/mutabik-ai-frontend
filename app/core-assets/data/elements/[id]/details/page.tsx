"use client";



import { use } from "react";
import DataElementDetails from "@/components/app/dataElements/details/DataElementDetails";

interface DataElementDetailsPageProps {
  params: Promise<{ id: string }>;
}

const DataElementDetailsPage = ({ params }: DataElementDetailsPageProps) => {
  const { id } = use(params);
  return <DataElementDetails elementId={id} />;
};

export default DataElementDetailsPage;

