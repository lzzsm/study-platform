import { useNavigate } from "react-router-dom";
import { EditWorkspaceDialog } from "@/components/EditWorkspaceDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import { BookOpen, ArrowRight } from "lucide-react";
import type { Workspace } from "@/types/workspace.types";
import { useDeleteWorkspace } from "@/hooks/useWorkspaces";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const navigate = useNavigate();
  const deleteWorkspace = useDeleteWorkspace();

  const isDeletingThis =
    deleteWorkspace.isPending && deleteWorkspace.variables === workspace.id;

  return (
    <Card
      className="group hover:border-foreground/30 hover:shadow-md transition-all cursor-pointer"
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
      <CardFooter className="gap-2 pt-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/workspaces/${workspace.id}`);
          }}
          className="gap-1"
        >
          Abrir
          <ArrowRight className="size-3" />
        </Button>
        <div onClick={(e) => e.stopPropagation()}>
          <EditWorkspaceDialog workspace={workspace} />
        </div>
        <AlertDialog>
          <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={isDeletingThis}
            >
              {isDeletingThis ? "Excluindo..." : "Excluir"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir workspace?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O workspace "{workspace.name}"
                será excluído permanentemente.
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
  );
}
