"use client";
import { usePermissions } from "@/hooks/app/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { PermissionName } from "@/constants/permissions";
import type { ReactNode } from "react";

interface PermissionPageProps {
  /** The permission required to view this page */
  permission: PermissionName;
  /** Where to redirect if user lacks permission (default: /dashboard) */
  redirectTo?: string;
  children: ReactNode;
}

export function PermissionPage({
  permission,
  redirectTo = "/dashboard",
  children,
}: PermissionPageProps) {
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const allowed = hasPermission(permission);

  useEffect(() => {
    if (!allowed) {
      router.replace(redirectTo);
    }
  }, [allowed, redirectTo, router]);

  if (!allowed) return null;

  return <>{children}</>;
}

