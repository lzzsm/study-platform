import { Home, BookOpen, Settings, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import type { Workspace } from "@/types/workspace.types";
import { useLogout } from "@/hooks/useLogout";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: workspaces } = useWorkspaces();
  const logout = useLogout();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/dashboard")}
                  isActive={location.pathname === "/dashboard"}
                >
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/profile")}
                  isActive={location.pathname === "/profile"}
                >
                  <User />
                  <span>Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/workspaces")}
                  isActive={location.pathname === "/workspaces"}
                >
                  <Settings />
                  <span>Gerenciar workspaces</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="flex-1 min-h-0 flex flex-col">
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 min-h-0 overflow-y-auto">
            <SidebarMenu>
              {workspaces?.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2 py-1">
                  Nenhum workspace criado ainda.
                </p>
              ) : (
                workspaces?.map((workspace: Workspace) => (
                  <SidebarMenuItem key={workspace.id}>
                    <SidebarMenuButton
                      onClick={() => navigate(`/workspaces/${workspace.id}`)}
                      isActive={
                        location.pathname === `/workspaces/${workspace.id}`
                      }
                    >
                      <BookOpen />
                      <span>{workspace.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="hover:text-destructive"
                >
                  <LogOut />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
