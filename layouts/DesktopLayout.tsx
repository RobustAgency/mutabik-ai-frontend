import Header from "@/components/custom/Header";
import { Sidebar } from "@/components/custom/SideBar";

const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden md:block">
      <aside className="fixed left-0 z-30 h-[calc(100vh-76px)] w-[340px] bg-[#FAFAFA]">
        <div className="h-full overflow-y-auto">
          <Sidebar collapsed={false} onNavigate={() => {}} />
        </div>
      </aside>

      <main className="ml-[340px] w-[calc(100%-340px)] min-h-screen">
        <Header />
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
};

export default DesktopLayout;
