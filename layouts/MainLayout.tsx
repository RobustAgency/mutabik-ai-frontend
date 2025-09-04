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
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);

    if (isLoading) return <Spinner />

    return (
        <div className="!bg-[#FAFAFA] text-foreground">
            <MobileLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                desktopCollapsed={desktopCollapsed}
                setDesktopCollapsed={setDesktopCollapsed}>
                {children}
            </MobileLayout>
            <DesktopLayout desktopCollapsed={desktopCollapsed}>
                {children}
            </DesktopLayout>

        </div>
    );
}