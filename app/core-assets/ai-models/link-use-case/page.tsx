import React from "react";
import LinkedUseCasesList from "@/components/app/aiModel/linkUseCase/LinkedUseCasesList";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
  return (
    <PermissionPage permission={PERMISSIONS.AI_MODEL_USE_CASES_VIEW}>
      <LinkedUseCasesList />
    </PermissionPage>
  );
};

export default Page;

