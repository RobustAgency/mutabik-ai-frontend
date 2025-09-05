import Link from "next/link";
import {
  LayoutDashboard,
  Settings as SettingsIcon,
  LayoutGrid,
  House,
  Users,
  LogOut,
  CreditCard,
  FileChartColumnIncreasing,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import Accordian from "@/components/custom/Accordian";

// --- Types ---
type RouteItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  children?: RouteItem[];
};

// --- Routes ---
const adminRoutes: RouteItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: House },
  {
    href: "",
    label: "Compliance Library",
    icon: House,
    children: [
      { href: "/admin/frameworks", label: "Frameworks", icon: House },
      { href: "/admin/compliance-library/requirements", label: "Requirements", icon: House },
      { href: "/admin/compliance-library/controls", label: "Controls", icon: House },
    ],
  },
];

const userRoutes: RouteItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plans", label: "Plans", icon: CreditCard },
  { href: "/invoices", label: "Invoices", icon: FileChartColumnIncreasing },
];

const baseRoutes: RouteItem[] = [
  { href: "/settings", label: "Settings", icon: SettingsIcon },
  { href: "/logout", label: "Logout", icon: LogOut },
];

// --- Component ---
export function Sidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate: () => void;
}) {
  const { user } = useAuth();
  const role: string = user?.user_metadata?.role ?? "user";

  const navigationRoutes: RouteItem[] = role === "admin" ? adminRoutes : userRoutes;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Logo for mobile */}
      <div aria-details="logo" className="flex items-center justify-between md:hidden">
        <Link href="/" className="p-2">
          <Image src="/logo.png" alt="logo" width={120} height={56} />
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex flex-col gap-1 p-2 md:p-3 mt-6">
        {navigationRoutes.map((item) => (
          <div key={item.label}>
            {item.href !== "" && (
              <Link
                href={item.href || "#"}
                onClick={onNavigate}
                className="relative flex items-center rounded-md hover:bg-accent hover:text-accent-foreground gap-2 px-3 py-2 text-sm"
              >
                {item.icon ? <item.icon className="shrink-0 size-6" color="#737373" /> : null}
                {!collapsed && (
                  <span className="whitespace-nowrap text-[#404040] text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            )}

            {item.children && (
              <div className="mt-3">
                <Accordian items={item.children} />
              </div>
            )}
          </div>
        ))}

        {/* Base routes (Settings, Logout) */}
        {baseRoutes.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="relative flex items-center rounded-md hover:bg-accent hover:text-accent-foreground gap-2 px-3 py-2 text-sm"
          >
            {item.icon ? <item.icon className="shrink-0 size-6" color="#737373" /> : null}
            {!collapsed && (
              <span className="whitespace-nowrap text-[#404040] text-sm font-medium">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
