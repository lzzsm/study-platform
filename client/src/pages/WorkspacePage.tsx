import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspaces";
import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksTab } from "@/components/TasksTab";
import { GoalsTab } from "@/components/GoalsTab";
import { HabitsTab } from "@/components/HabitsTab";
import { WorkspaceMembersTab } from "@/components/WorkspaceMembersTab";
import { WorkspacePageSkeleton } from "@/components/skeletons/WorkspacePageSkeleton";
import { useTabsStore } from "@/store/tabsStore";

function WorkspacePage() {
  const { id } = useParams();
  const workspaceId = Number(id);
  const { openTab } = useTabsStore();

  const { data: workspace, isLoading: loadingWorkspace } =
    useWorkspace(workspaceId);

  // Abre a aba na topbar quando o workspace carrega
  useEffect(() => {
    if (workspace) {
      openTab({ id: workspace.id, name: workspace.name });
    }
  }, [workspace, openTab]);

  if (loadingWorkspace) return <WorkspacePageSkeleton />;
  if (!workspace) return <p>Workspace não encontrado.</p>;

  return (
    <div className="space-y-6">
      {/* Cabeçalho do workspace */}
      <div className="flex items-center gap-3">
        <BookOpen className="size-6" />
        <div>
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-muted-foreground text-sm">
              {workspace.description}
            </p>
          )}
        </div>
      </div>

      {/* Abas: Tarefas | Metas | Hábitos | Membros */}
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="habits">Hábitos</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TasksTab workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsTab workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="habits">
          <HabitsTab workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <WorkspaceMembersTab workspaceId={workspaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WorkspacePage;
