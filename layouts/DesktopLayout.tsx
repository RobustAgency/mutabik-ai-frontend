import { Sidebar } from "@/components/custom/SideBar"

const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="hidden md:flex">
            <aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-68 bg-[#FAFAFA]">
                <div className="h-full overflow-y-auto">
                    <Sidebar collapsed={false} onNavigate={() => { }} />
                </div>
            </aside>

            <main className="flex-1 ml-72 min-h-screen pr-5">
                <div className="py-10">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DesktopLayout