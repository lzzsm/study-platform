import { useState } from "react";
import {
  useTasks,
  useCreateTask,
  useToggleTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { Plus, Trash2 } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Task } from "@/types/task.types";
import { TaskListSkeleton } from "@/components/skeletons/TaskListSkeleton";

interface TasksTabProps {
  workspaceId: number;
}

export function TasksTab({ workspaceId }: TasksTabProps) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"pending" | "completed" | undefined>(
    undefined,
  );

  const { data: taskData, isLoading: loadingTasks } = useTasks(
    workspaceId,
    page,
    status,
  );

  const createTask = useCreateTask(workspaceId);
  const toggleTask = useToggleTask(workspaceId);
  const deleteTask = useDeleteTask(workspaceId);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const tasks = taskData?.items ?? [];
  const totalPages = Math.ceil((taskData?.total ?? 0) / 10);

  function handleCreateTask() {
    if (!taskTitle.trim()) return;
    createTask.mutate(
      { title: taskTitle, description: taskDescription || undefined },
      {
        onSuccess: () => {
          setTaskTitle("");
          setTaskDescription("");
          setPage(1);
        },
      },
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Formulário de criação */}
      <div className="space-y-2">
        <Input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Nova tarefa..."
          onKeyDown={(e) => e.key === "Enter" && handleCreateTask()}
        />
        <Input
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Descrição (opcional)"
        />
        <Button
          onClick={handleCreateTask}
          disabled={createTask.isPending}
          size="sm"
        >
          <Plus className="size-4 mr-1" />
          {createTask.isPending ? "Criando..." : "Criar tarefa"}
        </Button>
      </div>

      {/* Filtros de status */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={status === undefined ? "default" : "outline"}
          onClick={() => {
            setStatus(undefined);
            setPage(1);
          }}
        >
          Todas
        </Button>
        <Button
          size="sm"
          variant={status === "pending" ? "default" : "outline"}
          onClick={() => {
            setStatus("pending");
            setPage(1);
          }}
        >
          Pendentes
        </Button>
        <Button
          size="sm"
          variant={status === "completed" ? "default" : "outline"}
          onClick={() => {
            setStatus("completed");
            setPage(1);
          }}
        >
          Completas
        </Button>
      </div>

      {/* Lista de tarefas */}
      {loadingTasks ? (
        <TaskListSkeleton />
      ) : (
        <div className="space-y-2">
          {tasks.map((task: Task) => (
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

          {tasks.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhuma tarefa ainda.
            </p>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => p - 1)}
                    aria-disabled={page === 1}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-4">
                    Página {page} de {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => p + 1)}
                    aria-disabled={page === totalPages}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
