"use client";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Accordian from "@/components/custom/Accordian";
import { Role } from "@/interfaces/Roles";
import { adminRoutes, RouteItem, userRoutes } from "@/app/constants/sidebar-routes";
import { usePermissions } from "@/hooks/app/usePermissions";
import { useMemo } from "react";

/**
 * Recursively filters routes based on user permissions.
 * - Routes with a `permission` field require the user to have that permission.
 *   However, if a parent route lacks permission but has visible children, show it as a container.
 * - Parent routes (routes with children) are completely hidden if:
 *   1. They have a permission requirement AND user doesn't have it AND no children are visible, OR
 *   2. All their children are filtered out (no visible children)
 * - Leaf routes (routes without children) require the permission if specified.
 */
function filterRoutesByPermission(
  routes: RouteItem[],
  permissionSet: Set<string>,
  isSuperAdmin: boolean
): RouteItem[] {
  return routes
    .map((route) => {
      const filteredChildren = route.children
        ? filterRoutesByPermission(route.children, permissionSet, isSuperAdmin)
        : undefined;

      const hasVisibleChildren = filteredChildren && filteredChildren.length > 0;
      const hasValidHref = route.href && route.href.trim() !== "";
      const hasChildren = route.children && route.children.length > 0;

      if (route.permission) {
        if (isSuperAdmin) {
          if (hasChildren && !hasVisibleChildren) {
            return null;
          }
          return {
            ...route,
            children: hasVisibleChildren ? filteredChildren : undefined,
          };
        }
        
        if (!permissionSet.has(route.permission)) {
          if (hasChildren && hasVisibleChildren) {
            return {
              ...route,
              href: "",
              children: filteredChildren,
            };
          }
          return null;
        }
      }

      if (hasChildren && !hasVisibleChildren) {
        return null;
      }

      if (!hasChildren && !hasValidHref) {
        return null;
      }

      return {
        ...route,
        children: hasVisibleChildren ? filteredChildren : undefined,
      };
    })
    .filter(Boolean) as RouteItem[];
}

export function Sidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate: () => void;
}) {
  const { user } = useAuth();
  const { permissions: permissionSet, isSuperAdmin } = usePermissions();
  const pathname = usePathname();
  const role: string = user?.user_metadata?.role ?? "Owner";

  const baseRoutes: RouteItem[] = role === Role.SUPER_ADMIN ? adminRoutes : userRoutes;
  const navigationRoutes = useMemo(
    () => filterRoutesByPermission(baseRoutes, permissionSet, isSuperAdmin),
    [baseRoutes, permissionSet, isSuperAdmin]
  );

  const renderRoute = (item: RouteItem, depth = 0) => {
    const hasValidHref = item.href && item.href.trim() !== "";
    const isActive = hasValidHref && (pathname === item.href || pathname.startsWith(item.href + "/"));
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.label + (item.href || '')} className={depth > 0 ? "ml-4" : ""}>
          <Accordian
            label={item.label}
            items={item.children ?? []}
            icon={item.icon ?? (() => null)}
            pathname={pathname}
            href={item.href}
            onNavigate={onNavigate}
            collapsed={collapsed}
            depth={depth}
          />
        </div>
      );
    }

    if (!hasValidHref) {
      return null;
    }

    return (
      <div key={item.label + item.href} className={depth > 0 ? "ml-4" : ""}>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={`relative flex items-center rounded-lg gap-2 px-3 py-2 text-sm font-medium transition-colors ${isActive
            ? "bg-primary/10 text-primary"
            : "hover:bg-accent hover:text-accent-foreground text-[#404040]"
            }`}
        >
          {item.icon && (
            <item.icon
              className="shrink-0 size-5"
              color={isActive ? "currentColor" : "#737373"}
            />
          )}
          {!collapsed && (
            <span className="whitespace-nowrap">
              {item.label}
            </span>
          )}
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden w-full p-5">
      <div
        aria-details="logo"
        className="flex items-center justify-between mb-9"
      >
        <Link href="/dashboard">
          <Image
            src="/auth/dashboard-logo.svg"
            alt="logo"
            width={156}
            height={36}
          />
        </Link>
      </div>

      <div className="space-y-1">
        {navigationRoutes.map((item) => renderRoute(item))}
      </div>
    </div>
  );
}

export default Sidebar;