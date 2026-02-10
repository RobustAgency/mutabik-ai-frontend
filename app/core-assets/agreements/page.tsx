"use client";

import Agreements from "@/components/app/agreements/Agreements";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function Page() {
  return (
    <PermissionPage permission={PERMISSIONS.AGREEMENTS_VIEW}>
      <Agreements />
    </PermissionPage>
  );
}

