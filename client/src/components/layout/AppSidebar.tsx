import {
  Home,
  BookOpen,
  Settings,
  LogOut,
  User,
  Search,
  Mail,
} from "lucide-react";
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
import { usePendingInvites } from "@/hooks/useInvites";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useWorkspaces();
  const logout = useLogout();

  const { data: invites } = usePendingInvites();
  const pendingCount = invites?.length ?? 0;
  const workspaces = data?.items ?? [];

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
                  onClick={() => navigate("/search")}
                  isActive={location.pathname === "/search"}
                >
                  <Search />
                  <span>Buscar usuários</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/invites")}
                  isActive={location.pathname === "/invites"}
                >
                  <div className="relative">
                    <Mail />
                    {pendingCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                        {pendingCount > 9 ? "9+" : pendingCount}
                      </span>
                    )}
                  </div>
                  <span>Convites</span>
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
              {workspaces.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2 py-1">
                  Nenhum workspace criado ainda.
                </p>
              ) : (
                workspaces.map((workspace: Workspace) => (
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
