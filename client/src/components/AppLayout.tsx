import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <SidebarTrigger />
          <ThemeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default AppLayout;
