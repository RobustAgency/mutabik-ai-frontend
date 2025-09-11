import Link from "next/link";
import {
  // Settings as SettingsIcon,
  LayoutGrid,
  House,
  // LogOut,
  CreditCard,
  LucideIcon,
  Users2,
} from "lucide-react";
import { Landmark } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import Accordian from "@/components/custom/Accordian";
import { Role } from "@/interfaces/Roles";

// --- Types ---
type RouteItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  children?: RouteItem[];
};

// --- Routes ---
const adminRoutes: RouteItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: House },
  { href: "/admin/projects", label: "Projects", icon: LayoutGrid },
  {
    href: "",
    label: "Compliance Library",
    icon: Landmark,
    children: [
      { href: "/admin/compliance-library/frameworks", label: "Frameworks", icon: House },
      { href: "/admin/compliance-library/requirements", label: "Requirements" },
      { href: "/admin/compliance-library/tags", label: "Tags" },
      { href: "/admin/compliance-library/controls", label: "Controls" },
    ],
  },
  {
    href: "",
    label: "Users Administration",
    icon: Users2,
    children: [
      { href: "/admin/users-administration/admin-users", label: "Admins" },
      { href: "/admin/users-administration/customers", label: "Customers" },
    ],
  },
];

const userRoutes = [
  // { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plans", label: "Plans", icon: CreditCard },
  // { href: "/invoices", label: "Invoices", icon: FileChartColumnIncreasing },
];


// const baseRoutes: RouteItem[] = [
//   { href: "/settings", label: "Settings", icon: SettingsIcon },
//   { href: "/logout", label: "Logout", icon: LogOut },
// ];

// --- Component ---
export function Sidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate: () => void;
}) {
  const { user } = useAuth();
  const role: string = user?.user_metadata?.role ?? "Owner";

  const navigationRoutes: RouteItem[] = role === Role.SUPER_ADMIN ? adminRoutes : userRoutes;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Logo for mobile */}
      <div aria-details="logo" className="flex items-center justify-between md:hidden">
        <Link href="/" className="pl-5 pt-2">
          <Image src="/auth/dashboard-logo.svg" alt="logo" width={120} height={56} />
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

            {item.children && item.icon && (
              <div>
                <Accordian label={item.label} items={item.children} icon={item.icon} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
