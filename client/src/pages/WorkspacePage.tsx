import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspaces";
import {
  useTasks,
  useCreateTask,
  useToggleTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { useHabits, useCreateHabit } from "@/hooks/useHabits";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import { HabitCard } from "@/components/HabitCard";
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
import type { Goal } from "@/types/goal.types";
import type { Habit } from "@/types/habit.types";
import { TaskListSkeleton } from "@/components/skeletons/TaskListSkeleton";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";
import { HabitGridSkeleton } from "@/components/skeletons/HabitGridSkeleton";
import { WorkspacePageSkeleton } from "@/components/skeletons/WorkspacePageSkeleton";
import { useTabsStore } from "@/store/tabsStore";
import { WorkspaceMembers } from "@/components/WorkspaceMembers";

function WorkspacePage() {
  const { id } = useParams();
  const workspaceId = Number(id);
  const { openTab } = useTabsStore();

  // Paginação e filtro de tarefas
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"pending" | "completed" | undefined>(
    undefined,
  );

  // Dados do workspace e suas entidades
  const { data: workspace, isLoading: loadingWorkspace } =
    useWorkspace(workspaceId);
  const { data: taskData, isLoading: loadingTasks } = useTasks(
    workspaceId,
    page,
    status,
  );
  const { data: goals, isLoading: loadingGoals } = useGoals(workspaceId);
  const { data: habits, isLoading: loadingHabits } = useHabits(workspaceId);

  // Mutations
  const createTask = useCreateTask(workspaceId);
  const toggleTask = useToggleTask(workspaceId);
  const deleteTask = useDeleteTask(workspaceId);
  const createHabit = useCreateHabit(workspaceId);

  // States dos formulários inline
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDescription, setHabitDescription] = useState("");

  const tasks = taskData?.tasks ?? [];
  const totalPages = Math.ceil((taskData?.total ?? 0) / 10);

  // Abre a aba na topbar quando o workspace carrega
  useEffect(() => {
    if (workspace) {
      openTab({ id: workspace.id, name: workspace.name });
    }
  }, [workspace, openTab]);

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

  function handleCreateHabit() {
    if (!habitTitle.trim()) return;
    createHabit.mutate(
      { title: habitTitle, description: habitDescription || undefined },
      {
        onSuccess: () => {
          setHabitTitle("");
          setHabitDescription("");
        },
      },
    );
  }

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

      {/* Abas: Tarefas | Metas | Hábitos */}
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="habits">Hábitos</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
        </TabsList>

        {/* ── TAREFAS ── */}
        <TabsContent value="tasks" className="space-y-4 mt-4">
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
        </TabsContent>

        {/* ── METAS ── */}
        <TabsContent value="goals" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Metas</h2>
            <CreateGoalDialog workspaceId={workspaceId} />
          </div>

          {loadingGoals ? (
            <CardGridSkeleton count={4} />
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
        </TabsContent>

        {/* ── HÁBITOS ── */}
        <TabsContent value="habits" className="space-y-4 mt-4">
          {/* Formulário de criação */}
          <div className="space-y-2">
            <Input
              value={habitTitle}
              onChange={(e) => setHabitTitle(e.target.value)}
              placeholder="Novo hábito..."
              onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
            />
            <Input
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              placeholder="Descrição (opcional)"
            />
            <Button
              onClick={handleCreateHabit}
              disabled={createHabit.isPending}
              size="sm"
            >
              <Plus className="size-4 mr-1" />
              {createHabit.isPending ? "Criando..." : "Criar hábito"}
            </Button>
          </div>

          {/* Lista de hábitos */}
          {loadingHabits ? (
            <HabitGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habits?.map((habit: Habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  workspaceId={workspaceId}
                />
              ))}
              {habits?.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Nenhum hábito ainda.
                </p>
              )}
            </div>
          )}
        </TabsContent>

        {/* ── MEMBROS ── */}
        <TabsContent value="members" className="mt-4">
          <WorkspaceMembers workspaceId={workspaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WorkspacePage;
