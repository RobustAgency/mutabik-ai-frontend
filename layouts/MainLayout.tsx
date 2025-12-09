"use client";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import Spinner from "@/components/ui/spinner";
import DesktopLayout from "@/layouts/DesktopLayout";
import MobileLayout from "@/layouts/MobileLayout";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="bg-[#FAFAFA]! text-foreground">
      <section className="md:hidden">
        <MobileLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
          {children}
        </MobileLayout>
      </section>
      <DesktopLayout>{children}</DesktopLayout>
    </div>
  );
}
