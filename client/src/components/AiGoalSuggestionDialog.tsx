import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  Target,
  ListTodo,
  Repeat,
} from "lucide-react";
import { useSuggestGoal } from "@/hooks/useAiSuggestion";
import { useCreateGoal } from "@/hooks/useGoals";
import { useCreateTask } from "@/hooks/useTasks";
import { useCreateHabit } from "@/hooks/useHabits";
import type { GoalSuggestion } from "@/types/aiSuggestion.types";
import { toast } from "sonner";

type Step = "input" | "review";

interface Props {
  workspaceId: number;
}

export function AiGoalSuggestionDialog({ workspaceId }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [description, setDescription] = useState("");
  const [refinement, setRefinement] = useState("");
  const [suggestion, setSuggestion] = useState<GoalSuggestion | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [selectedHabits, setSelectedHabits] = useState<Set<number>>(new Set());

  const suggestGoal = useSuggestGoal();
  const createGoal = useCreateGoal(workspaceId);
  const createTask = useCreateTask(workspaceId);
  const createHabit = useCreateHabit(workspaceId);

  function resetAndClose() {
    setOpen(false);
    setStep("input");
    setDescription("");
    setRefinement("");
    setSuggestion(null);
    setSelectedTasks(new Set());
    setSelectedHabits(new Set());
  }

  function handleGenerate() {
    if (!description.trim()) return;
    suggestGoal.mutate(
      { description },
      {
        onSuccess: (data) => {
          setSuggestion(data);
          setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
          setSelectedHabits(new Set(data.habits.map((_, i) => i)));
          setStep("review");
        },
      },
    );
  }

  function handleRefine() {
    if (!refinement.trim() || !suggestion) return;
    suggestGoal.mutate(
      {
        description,
        previousSuggestion: suggestion,
        refinementRequest: refinement,
      },
      {
        onSuccess: (data) => {
          setSuggestion(data);
          setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
          setSelectedHabits(new Set(data.habits.map((_, i) => i)));
          setRefinement("");
        },
      },
    );
  }

  function toggleTask(index: number) {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function toggleHabit(index: number) {
    setSelectedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  async function handleAccept() {
    if (!suggestion) return;

    try {
      await createGoal.mutateAsync({
        title: suggestion.goal.title,
        description: suggestion.goal.description,
        type: suggestion.goal.type,
        target_value: suggestion.goal.target_value ?? undefined,
      });

      const taskPromises = suggestion.tasks
        .filter((_, i) => selectedTasks.has(i))
        .map((task) =>
          createTask.mutateAsync({
            title: task.title,
            description: task.description,
          }),
        );

      const habitPromises = suggestion.habits
        .filter((_, i) => selectedHabits.has(i))
        .map((habit) =>
          createHabit.mutateAsync({
            title: habit.title,
            description: habit.description,
          }),
        );

      await Promise.all([...taskPromises, ...habitPromises]);

      toast.success("Meta criada com sucesso!");
      resetAndClose();
    } catch {
      toast.error("Erro ao criar meta e itens.");
    }
  }

  const isCreating =
    createGoal.isPending || createTask.isPending || createHabit.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (o ? setOpen(true) : resetAndClose())}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Sparkles className="size-4" />
        Criar com IA
      </Button>

      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        {step === "input" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="size-5" />
                Criar meta com IA
              </DialogTitle>
              <DialogDescription>
                Descreva o que você quer alcançar e a IA vai sugerir uma meta,
                tarefas e hábitos.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label htmlFor="ai-description">
                  O que você quer alcançar?
                </Label>
                <Textarea
                  id="ai-description"
                  placeholder="Ex: quero aprender React do zero até conseguir construir projetos completos"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!description.trim() || suggestGoal.isPending}
                className="w-full gap-2"
              >
                {suggestGoal.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Gerando sugestão...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Gerar sugestão
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {step === "review" && suggestion && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="size-5" />
                Revisar sugestão
              </DialogTitle>
              <DialogDescription>
                Selecione o que deseja criar, ou peça um ajuste.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Meta */}
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="text-sm font-semibold">{suggestion.goal.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {suggestion.goal.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {suggestion.goal.type === "quantitative"
                    ? `Meta quantitativa · alvo: ${suggestion.goal.target_value}`
                    : "Meta qualitativa"}
                </p>
              </div>

              {/* Tarefas */}
              {suggestion.tasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ListTodo className="size-3.5" />
                    Tarefas sugeridas
                  </p>
                  {suggestion.tasks.map((task, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedTasks.has(i)}
                        onCheckedChange={() => toggleTask(i)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Hábitos */}
              {suggestion.habits.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Repeat className="size-3.5" />
                    Hábitos sugeridos
                  </p>
                  {suggestion.habits.map((habit, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedHabits.has(i)}
                        onCheckedChange={() => toggleHabit(i)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium">{habit.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {habit.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Refinamento */}
              <div className="space-y-1.5 pt-2 border-t">
                <Label
                  htmlFor="ai-refinement"
                  className="text-xs text-muted-foreground"
                >
                  Quer ajustar algo? (opcional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ai-refinement"
                    placeholder="Ex: adiciona mais um hábito de leitura"
                    value={refinement}
                    onChange={(e) => setRefinement(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                  />
                  <Button
                    variant="outline"
                    onClick={handleRefine}
                    disabled={!refinement.trim() || suggestGoal.isPending}
                  >
                    {suggestGoal.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Ajustar"
                    )}
                  </Button>
                </div>
              </div>

              {/* Ações finais */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={resetAndClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAccept}
                  disabled={isCreating}
                  className="flex-1 gap-2"
                >
                  {isCreating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle className="size-4" />
                  )}
                  {isCreating ? "Criando..." : "Criar selecionados"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
