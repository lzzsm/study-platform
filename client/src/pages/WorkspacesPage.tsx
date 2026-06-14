import { useState } from "react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceForm } from "@/components/CreateWorkspaceForm";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import type { Workspace } from "@/types/workspace.types";
import { BookOpen, Plus } from "lucide-react";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";

function WorkspacesPage() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize seus estudos em workspaces separados
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
        >
          <Plus className="size-4 mr-2" />
          {showForm ? "Cancelar" : "Novo workspace"}
        </Button>
      </div>

      {/* ── FORMULÁRIO DE CRIAÇÃO ── */}
      {showForm && <CreateWorkspaceForm onClose={() => setShowForm(false)} />}

      {/* ── LISTA DE WORKSPACES ── */}
      {isLoading ? (
        <CardGridSkeleton count={3} />
      ) : workspaces?.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <BookOpen className="size-10 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-sm">
            Nenhum workspace ainda.{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              Crie o primeiro.
            </span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces?.map((workspace: Workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkspacesPage;
