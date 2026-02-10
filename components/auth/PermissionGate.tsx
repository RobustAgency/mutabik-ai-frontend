"use client";
import { usePermissions } from "@/hooks/app/usePermissions";
import type { PermissionName } from "@/constants/permissions";
import type { ReactNode } from "react";

interface PermissionGateProps {
  /** Single permission to check */
  permission?: PermissionName;
  /** Multiple permissions to check */
  permissions?: PermissionName[];
  /** If true, ALL permissions required; if false (default), ANY permission is enough */
  requireAll?: boolean;
  /** What to render if user lacks permission (default: nothing) */
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let allowed = false;

  if (permission) {
    allowed = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    allowed = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return allowed ? <>{children}</> : <>{fallback}</>;
}

