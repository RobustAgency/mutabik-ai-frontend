import {
  adminRoutes,
  RouteItem,
  userRoutes,
} from "@/app/constants/sidebar-routes";
import { Role } from "@/interfaces/Roles";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Finds the most specific route match and builds the path to it
 * Prefers child routes over parent routes when they have the same href
 */
function findRouteHierarchy(
  routes: RouteItem[],
  pathname: string,
  currentPath: string = "",
  hierarchy: RouteItem[] = []
): RouteItem[] | null {
  let bestMatch: RouteItem[] | null = null;
  let bestMatchDepth = -1;

  for (const route of routes) {
    // Skip routes with empty href (parent containers)
    if (!route.href) {
      if (route.children) {
        const found = findRouteHierarchy(
          route.children,
          pathname,
          currentPath,
          [...hierarchy, route]
        );
        if (found && found.length > bestMatchDepth) {
          bestMatch = found;
          bestMatchDepth = found.length;
        }
      }
      continue;
    }

    const fullPath = route.href;

    // Exact match
    if (pathname === fullPath) {
      const match = [...hierarchy, route];
      // Prefer deeper matches (children over parents)
      if (match.length > bestMatchDepth) {
        bestMatch = match;
        bestMatchDepth = match.length;
      }
    }

    // Path starts with this route
    if (pathname.startsWith(fullPath + "/")) {
      // Check children for more specific matches first
      if (route.children) {
        const found = findRouteHierarchy(route.children, pathname, fullPath, [
          ...hierarchy,
          route,
        ]);
        if (found && found.length > bestMatchDepth) {
          bestMatch = found;
          bestMatchDepth = found.length;
        }
      }

      // If no better child match, consider this route
      const match = [...hierarchy, route];
      if (match.length > bestMatchDepth) {
        bestMatch = match;
        bestMatchDepth = match.length;
      }
    }
  }

  return bestMatch;
}

/**
 * Formats a path segment into a readable label
 */
function formatLabel(segment: string): string {
  const actionMap: Record<string, string> = {
    create: "Create",
    edit: "Edit",
    details: "Details",
  };

  if (actionMap[segment]) {
    return actionMap[segment];
  }

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generates breadcrumbs from the current pathname
 */
export function generateBreadcrumbs(
  pathname: string,
  userRole?: string
): BreadcrumbItem[] {
  // Skip breadcrumbs for auth and onboarding routes
  const skipRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/update-password",
    "/auth/confirm",
    "/logout",
    "/error",
    "/verify-email",
    "/accept-invite",
    "/admin/login",
    "/onboarding",
  ];

  if (
    skipRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return [];
  }

  // Get appropriate routes based on role
  const routes = userRole === Role.SUPER_ADMIN ? adminRoutes : userRoutes;

  // Split pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];

  // Check if the last segment is an action word or dynamic param
  const lastSegment = segments[segments.length - 1];
  const isActionWord = ["create", "edit", "details"].includes(lastSegment);
  const isDynamicParam =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      lastSegment
    ) || /^\d+$/.test(lastSegment);

  // Build the base path (without action words or dynamic params)
  let basePath = pathname;
  let actionLabel: string | null = null;

  if (isActionWord) {
    basePath = "/" + segments.slice(0, -1).join("/");
    actionLabel = formatLabel(lastSegment);
  } else if (isDynamicParam) {
    const secondLast = segments[segments.length - 2];
    if (secondLast && ["create", "edit", "details"].includes(secondLast)) {
      basePath = "/" + segments.slice(0, -2).join("/");
      actionLabel = formatLabel(secondLast);
    } else {
      basePath = "/" + segments.slice(0, -1).join("/");
      actionLabel = "Details";
    }
  }

  // Find the route hierarchy for the base path
  const routeHierarchy = findRouteHierarchy(routes, basePath);

  if (routeHierarchy && routeHierarchy.length > 0) {
    // Filter out container routes (empty href) and add only routes with actual hrefs
    const routesWithHref = routeHierarchy.filter((r) => r.href);

    // Remove duplicates: if two consecutive routes have the same href, keep only the last one (most specific)
    const uniqueRoutes: RouteItem[] = [];
    for (let i = 0; i < routesWithHref.length; i++) {
      const route = routesWithHref[i];
      const nextRoute = routesWithHref[i + 1];

      // If next route has the same href, skip this one (prefer the more specific/child route)
      if (nextRoute && nextRoute.href === route.href) {
        continue;
      }

      uniqueRoutes.push(route);
    }

    for (let i = 0; i < uniqueRoutes.length; i++) {
      const route = uniqueRoutes[i];
      const isLastRoute = i === uniqueRoutes.length - 1;

      // Only add href if it's not the last route
      breadcrumbs.push({
        label: route.label,
        href: isLastRoute ? undefined : route.href,
      });
    }
  } else {
    // Fallback: build breadcrumbs from path segments
    let currentPath = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      // Skip dynamic params
      if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment
        ) ||
        /^\d+$/.test(segment)
      ) {
        continue;
      }

      // Skip action words (will be added at the end)
      if (
        ["create", "edit", "details"].includes(segment) &&
        i === segments.length - 1
      ) {
        continue;
      }

      currentPath += `/${segment}`;
      const label = formatLabel(segment);

      if (label) {
        const isLast = i === segments.length - 1;
        breadcrumbs.push({
          label,
          href: isLast ? undefined : currentPath,
        });
      }
    }
  }

  // Add action label if present
  if (actionLabel) {
    breadcrumbs.push({
      label: actionLabel,
    });
  }

  // Remove duplicates (same label and href)
  const uniqueBreadcrumbs: BreadcrumbItem[] = [];
  const seen = new Set<string>();

  for (const item of breadcrumbs) {
    const key = `${item.label}:${item.href || ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueBreadcrumbs.push(item);
    }
  }

  return uniqueBreadcrumbs;
}
