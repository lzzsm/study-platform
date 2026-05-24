import { useMe } from "@/hooks/useMe";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import type { Workspace } from "@/types/workspace.types";

function DashboardPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: loadingUser } = useMe();
  const { data: workspaces, isLoading: loadingWorkspaces } = useWorkspaces();

  if (loadingUser || loadingWorkspaces) return <p>Carregando...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Olá, {user?.name} 👋</h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Seus workspaces</h2>
          <Button size="sm" onClick={() => navigate("/workspaces")}>
            <Plus />
            Novo
          </Button>
        </div>

        {workspaces?.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum workspace ainda.{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => navigate("/workspaces")}
            >
              Crie o primeiro.
            </span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces?.map((workspace: Workspace) => (
              <Card
                key={workspace.id}
                className="cursor-pointer hover:border-foreground/30 transition-colors"
                onClick={() => navigate(`/workspaces/${workspace.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="size-4" />
                    {workspace.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {workspace.description || "Sem descrição"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
