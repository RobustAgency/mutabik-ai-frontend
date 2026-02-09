"use client";
import { useAuth } from "@/providers/AuthProvider";
import { useMemo, useCallback } from "react";
import type { PermissionName } from "@/constants/permissions";

export function usePermissions() {
  const { profile } = useAuth();

  const isSuperAdmin = profile?.is_super_admin ?? false;

  // Build a Set of permission name strings for O(1) lookups
  const permissionSet = useMemo(() => {
    if (!profile?.permissions) return new Set<string>();
    return new Set(profile.permissions.map((p) => p.name));
  }, [profile?.permissions]);

  /** Check if user has a specific permission */
  const hasPermission = useCallback(
    (permission: PermissionName): boolean => {
      if (isSuperAdmin) return true;
      return permissionSet.has(permission);
    },
    [permissionSet, isSuperAdmin]
  );

  /** Check if user has ANY of the given permissions (OR logic) */
  const hasAnyPermission = useCallback(
    (permissions: PermissionName[]): boolean => {
      if (isSuperAdmin) return true;
      return permissions.some((p) => permissionSet.has(p));
    },
    [permissionSet, isSuperAdmin]
  );

  /** Check if user has ALL of the given permissions (AND logic) */
  const hasAllPermissions = useCallback(
    (permissions: PermissionName[]): boolean => {
      if (isSuperAdmin) return true;
      return permissions.every((p) => permissionSet.has(p));
    },
    [permissionSet, isSuperAdmin]
  );

  /** Check if user has any permission in a module (e.g. "core-assets") */
  const hasModuleAccess = useCallback(
    (module: string): boolean => {
      if (isSuperAdmin) return true;
      return [...permissionSet].some((p) => p.startsWith(`${module}.`));
    },
    [permissionSet, isSuperAdmin]
  );

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModuleAccess,
    isSuperAdmin,
    permissions: permissionSet,
  };
}

