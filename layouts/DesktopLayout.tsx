import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/custom/SideBar"

const DesktopLayout = ({ children, desktopCollapsed }: { children: React.ReactNode, desktopCollapsed: boolean }) => {
    return (
        <div className="hidden md:flex">
            <aside className={cn(
                "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] bg-[#FAFAFA] transition-all duration-200",
                desktopCollapsed ? "w-16" : "w-68"
            )}>
                <div className="h-full overflow-y-auto">
                    <Sidebar collapsed={desktopCollapsed} onNavigate={() => { }} />
                </div>
            </aside>

            <main className={cn(
                "flex-1 transition-all duration-200 min-h-screen pr-5",
                desktopCollapsed ? "ml-16" : "ml-68"
            )}>
                <div className="py-10">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DesktopLayout