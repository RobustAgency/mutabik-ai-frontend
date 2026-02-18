"use client";

import { use } from "react";
import EditDatasetSubjectPopulation from "@/components/app/datasetSubjectPopulation/edit/EditDatasetSubjectPopulation";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface EditDatasetSubjectPopulationPageProps {
  params: Promise<{ id: string }>;
}

const EditDatasetSubjectPopulationPage = ({ params }: EditDatasetSubjectPopulationPageProps) => {
  const { id } = use(params);
  return (
    <PermissionPage permission={PERMISSIONS.DATASET_SUBJECT_POPULATIONS_EDIT}>
      <EditDatasetSubjectPopulation populationId={id} />
    </PermissionPage>
  );
};

export default EditDatasetSubjectPopulationPage;

