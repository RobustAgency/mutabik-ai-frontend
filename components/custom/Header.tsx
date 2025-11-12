"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { generateBreadcrumbs } from "@/lib/utils/breadcrumbs";
import Breadcrumbs from "./Breadcrumbs";
import ProfileInfo from "./ProfileInfo";

const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;

  const breadcrumbItems = useMemo(() => {
    return generateBreadcrumbs(pathname, userRole);
  }, [pathname, userRole]);

  const headerGridClass = cn(
    "grid w-full sticky top-1.5 z-30 bg-[#FAFAFA] backdrop-blur-md py-2",
    // default design same (2 columns)
    // "grid-cols-[minmax(0,2fr)_auto] md:grid-cols-[300px_minmax(0,1fr)]",
    // mobile devices: convert to column layout
    "max-sm:flex max-sm:flex-col max-sm:gap-2 min-h-[76px]"
  );

  return (
    <header className={headerGridClass}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 md:px-6 w-full">
        <div>
          {breadcrumbItems.length > 0 ? (
            <Breadcrumbs items={breadcrumbItems} />
          ) : null}
        </div>
        <ProfileInfo />
      </div>
    </header>
  );
};

export default Header;
