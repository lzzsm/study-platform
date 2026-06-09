import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Topbar } from "./Topbar";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
