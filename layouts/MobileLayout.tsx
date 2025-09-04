import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Sidebar } from "@/components/custom/SideBar"
import Header from "@/components/custom/Header"

const MobileLayout = ({ children, sidebarOpen, setSidebarOpen, desktopCollapsed, setDesktopCollapsed }: { children: React.ReactNode, sidebarOpen: boolean, setSidebarOpen: (open: boolean) => void, desktopCollapsed: boolean, setDesktopCollapsed: (collapsed: boolean) => void }) => {
    return (
        <>
            <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen} direction="left">
                <Header
                    desktopCollapsed={desktopCollapsed}
                    setDesktopCollapsed={setDesktopCollapsed}
                />
                <DrawerContent className="w-[80%] max-w-[200px] p-0 md:hidden">
                    <DrawerHeader className="hidden">
                        <DrawerTitle>Navigation</DrawerTitle>
                    </DrawerHeader>
                    <aside className="h-full bg-background">
                        <Sidebar collapsed={false} onNavigate={() => setSidebarOpen(false)} />
                    </aside>
                </DrawerContent>
            </Drawer>
            <div className="md:hidden">
                <main className="min-h-[calc(100vh-3.5rem)] p-4">
                    {children}
                </main>
            </div>
        </>
    )
}

export default MobileLayout