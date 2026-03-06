"use client";

import React from "react";
import UsersTable from "@/components/app/users/UsersTable";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const UsersPage = () => {
  return (
    <PermissionPage permission={PERMISSIONS.ADMIN_USERS_VIEW}>
      <div className="min-h-screen bg-[#FAFAFA] p-6">
        <UsersTable />
      </div>
    </PermissionPage>
  );
};

export default UsersPage;
