"use client";
import { usePermissions } from "@/hooks/app/usePermissions";
import type { PermissionName } from "@/constants/permissions";
import type { ReactNode } from "react";
import { AccessDeniedPage } from "./AccessDeniedPage";

interface PermissionPageProps {
  /** The permission required to view this page */
  permission: PermissionName;
  /** Where to redirect if user lacks permission (default: /dashboard) */
  redirectTo?: string;
  /** Custom message to show when access is denied (optional) */
  accessDeniedMessage?: string;
  children: ReactNode;
}

export function PermissionPage({
  permission,
  redirectTo = "/dashboard",
  accessDeniedMessage,
  children,
}: PermissionPageProps) {
  const { hasPermission } = usePermissions();
  const allowed = hasPermission(permission);

  if (!allowed) {
    return (
      <AccessDeniedPage
        message={accessDeniedMessage}
        redirectTo={redirectTo}
      />
    );
  }

  return <>{children}</>;
}

