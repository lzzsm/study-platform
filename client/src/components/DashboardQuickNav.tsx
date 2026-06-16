import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Plus,
  User,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import type { Workspace } from "@/types/workspace.types";

interface DashboardQuickNavProps {
  recentWorkspaces: Workspace[];
}

export function DashboardQuickNav({
  recentWorkspaces,
}: DashboardQuickNavProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Navegação rápida
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard className="size-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/workspaces")}
        >
          <BookOpen className="size-4 mr-2" />
          Workspaces
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile")}
        >
          <User className="size-4 mr-2" />
          Perfil
        </Button>

        {recentWorkspaces.length > 0 && (
          <div className="w-px h-8 bg-border self-center mx-1" />
        )}

        {recentWorkspaces.map((workspace: Workspace) => (
          <Button
            key={workspace.id}
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/workspaces/${workspace.id}`)}
          >
            {workspace.name}
            <ArrowRight className="size-3 ml-2" />
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/workspaces")}
        >
          <Plus className="size-4 mr-1" />
          Novo workspace
        </Button>
      </div>
    </div>
  );
}
