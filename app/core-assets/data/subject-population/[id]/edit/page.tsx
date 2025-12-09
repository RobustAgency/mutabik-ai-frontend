"use client";



import { use } from "react";
import EditDatasetSubjectPopulation from "@/components/app/datasetSubjectPopulation/edit/EditDatasetSubjectPopulation";

interface EditDatasetSubjectPopulationPageProps {
  params: Promise<{ id: string }>;
}

const EditDatasetSubjectPopulationPage = ({ params }: EditDatasetSubjectPopulationPageProps) => {
  const { id } = use(params);
  return <EditDatasetSubjectPopulation populationId={id} />;
};

export default EditDatasetSubjectPopulationPage;

