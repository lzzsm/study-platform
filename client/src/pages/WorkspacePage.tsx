import { useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspaces";
import { BookOpen } from "lucide-react";

function WorkspacePage() {
  const { id } = useParams();
  const { data: workspace, isLoading } = useWorkspace(Number(id));

  if (isLoading) return <p>Carregando...</p>;
  if (!workspace) return <p>Workspace não encontrado.</p>;

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold">Tarefas</h2>
          <p className="text-muted-foreground text-sm">Em breve</p>
        </div>
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold">Metas</h2>
          <p className="text-muted-foreground text-sm">Em breve</p>
        </div>
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold">Hábitos</h2>
          <p className="text-muted-foreground text-sm">Em breve</p>
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage;
