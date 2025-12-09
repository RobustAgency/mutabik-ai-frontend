import Header from "@/components/custom/Header"
import { Sidebar } from "@/components/custom/SideBar"

const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="hidden md:flex">
            <aside className="fixed left-0 top-0 z-30 h-[calc(100vh-3.5rem)] w-80 bg-[#FAFAFA]">
                <div className="h-full overflow-y-auto">
                    <Sidebar collapsed={false} onNavigate={() => { }} />
                </div>
            </aside>

            <main className="flex-1 ml-80 min-h-screen pr-5">
                <Header />
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DesktopLayout