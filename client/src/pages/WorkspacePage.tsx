import { useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspaces";
import {
  useTasks,
  useCreateTask,
  useToggleTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EditTaskDialog } from "@/components/EditTaskDialog";
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
import type { Task } from "@/types/task.types";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import type { Goal } from "@/types/goal.types";

function WorkspacePage() {
  const { id } = useParams();
  const workspaceId = Number(id);

  const { data: workspace, isLoading: loadingWorkspace } =
    useWorkspace(workspaceId);
  const { data: tasks, isLoading: loadingTasks } = useTasks(workspaceId);
  const { data: goals, isLoading: loadingGoals } = useGoals(workspaceId);
  const createTask = useCreateTask(workspaceId);
  const toggleTask = useToggleTask(workspaceId);
  const deleteTask = useDeleteTask(workspaceId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate() {
    if (!title.trim()) return;
    createTask.mutate(
      { title, description: description || undefined },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
        },
      },
    );
  }

  if (loadingWorkspace) return <p>Carregando...</p>;
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

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tarefas</h2>

        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nova tarefa..."
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
          />
          <Button
            onClick={handleCreate}
            disabled={createTask.isPending}
            size="sm"
          >
            <Plus className="size-4 mr-1" />
            {createTask.isPending ? "Criando..." : "Criar tarefa"}
          </Button>
        </div>

        {loadingTasks ? (
          <p className="text-muted-foreground text-sm">Carregando tarefas...</p>
        ) : (
          <div className="space-y-2">
            {tasks?.map((task: Task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) =>
                    toggleTask.mutate({ id: task.id, completed: !!checked })
                  }
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <EditTaskDialog task={task} workspaceId={workspaceId} />
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{task.title}" será excluída permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTask.mutate(task.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}

            {tasks?.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma tarefa ainda.
              </p>
            )}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Metas</h2>
          <CreateGoalDialog workspaceId={workspaceId} />
        </div>

        {loadingGoals ? (
          <p className="text-muted-foreground text-sm">Carregando metas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals?.map((goal: Goal) => (
              <GoalCard key={goal.id} goal={goal} workspaceId={workspaceId} />
            ))}
            {goals?.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma meta ainda.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspacePage;
