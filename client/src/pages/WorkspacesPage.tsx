import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
} from "@/hooks/useWorkspaces";
import { EditWorkspaceDialog } from "@/components/EditWorkspaceDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Workspace } from "@/types/workspace.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BookOpen, ArrowRight, Plus } from "lucide-react";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";

function WorkspacesPage() {
  const navigate = useNavigate();
  const { data: workspaces, isLoading } = useWorkspaces();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const createWorkspace = useCreateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  function handleCreate() {
    if (!name.trim()) return;
    createWorkspace.mutate(
      { name, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setShowForm(false);
        },
      },
    );
  }

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
      {showForm && (
        <Card className="border-dashed">
          <CardContent className="pt-6 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Matemática"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={createWorkspace.isPending}
              >
                {createWorkspace.isPending ? "Criando..." : "Criar"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            <Card
              key={workspace.id}
              className="group hover:border-foreground/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="size-4 text-muted-foreground" />
                  {workspace.name}
                </CardTitle>
                <CardDescription>
                  {workspace.description || "Sem descrição"}
                </CardDescription>
              </CardHeader>
              <CardFooter
                className="gap-2 pt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                  className="gap-1"
                >
                  Abrir
                  <ArrowRight className="size-3" />
                </Button>
                <EditWorkspaceDialog workspace={workspace} />
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={deleteWorkspace.isPending}
                    >
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir workspace?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O workspace "
                        {workspace.name}" será excluído permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteWorkspace.mutate(workspace.id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkspacesPage;
