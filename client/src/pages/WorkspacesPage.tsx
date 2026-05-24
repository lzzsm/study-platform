import { useState } from "react";
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

function WorkspacesPage() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
        },
      },
    );
  }

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Workspaces</h1>

      <Card className="p-6">
        <h2 className="text-base font-semibold mb-4">Novo workspace</h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Matemática"
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
          <Button onClick={handleCreate} disabled={createWorkspace.isPending}>
            {createWorkspace.isPending ? "Criando..." : "Criar"}
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {workspaces?.map((workspace: Workspace) => (
          <Card key={workspace.id}>
            <CardHeader>
              <CardTitle>{workspace.name}</CardTitle>
              <CardDescription>
                {workspace.description || "Sem descrição"}
              </CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
              <EditWorkspaceDialog workspace={workspace} />
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    variant="destructive"
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

        {workspaces?.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Nenhum workspace ainda.
          </p>
        )}
      </div>
    </div>
  );
}

export default WorkspacesPage;
