"use client";

import * as React from "react";
import RolesTable from "@/components/app/users/RolesTable";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const UsersAndRolesPage: React.FC = () => {
  return (
    <PermissionPage permission={PERMISSIONS.ADMIN_ROLES_VIEW}>
      <RolesTable />
    </PermissionPage>
  );
};

export default UsersAndRolesPage;

