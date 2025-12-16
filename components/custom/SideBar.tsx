"use client";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Accordian from "@/components/custom/Accordian";
import { Role } from "@/interfaces/Roles";
import { adminRoutes, RouteItem, userRoutes } from "@/app/constants/sidebar-routes";

export function Sidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate: () => void;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const role: string = user?.user_metadata?.role ?? "Owner";

  const navigationRoutes: RouteItem[] = role === Role.SUPER_ADMIN ? adminRoutes : userRoutes;

  // Helper to recursively render routes and children
  const renderRoute = (item: RouteItem, depth = 0) => {
    const isActive = item.href && (pathname === item.href || pathname.startsWith(item.href + "/"));
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    // If it has children (with or without href), render as Accordion
    if (hasChildren) {
      return (
        <div key={item.label + (item.href || '')} className={depth > 0 ? "ml-4" : ""}>
          <Accordian
            label={item.label}
            items={item.children ?? []}
            icon={item.icon ?? (() => null)}
            pathname={pathname}
            href={item.href} // Pass href even if empty - Accordion will handle it
            onNavigate={onNavigate}
            collapsed={collapsed}
            depth={depth}
          />
        </div>
      );
    }

    // Regular link item (no children) - this should rarely happen now
    // since most routes have children
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
      {/* Logo */}
      <div
        aria-details="logo"
        className="flex items-center justify-between mb-9!"
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

      {/* Sidebar Navigation */}
      <div className="space-y-1">
        {navigationRoutes.map((item) => renderRoute(item))}
      </div>
    </div>
  );
}

export default Sidebar;