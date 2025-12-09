"use client";



import { use } from "react";
import DatasetSubjectPopulationDetails from "@/components/app/datasetSubjectPopulation/details/DatasetSubjectPopulationDetails";

interface DatasetSubjectPopulationDetailsPageProps {
  params: Promise<{ id: string }>;
}

const DatasetSubjectPopulationDetailsPage = ({ params }: DatasetSubjectPopulationDetailsPageProps) => {
  const { id } = use(params);
  return <DatasetSubjectPopulationDetails populationId={id} />;
};

export default DatasetSubjectPopulationDetailsPage;

