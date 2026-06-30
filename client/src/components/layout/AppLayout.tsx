import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { AppTopbar } from "./AppTopbar";
import { useSocket } from "@/hooks/useSocket";

function AppLayout({ children }: { children: React.ReactNode }) {
  useSocket();
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <AppTopbar />
        <main className="flex-1 p-4 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
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
