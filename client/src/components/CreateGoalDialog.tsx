import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateGoal } from "@/hooks/useGoals";
import { Plus } from "lucide-react";

export function CreateGoalDialog({ workspaceId }: { workspaceId: number }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"quantitative" | "qualitative">(
    "quantitative",
  );
  const [targetValue, setTargetValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const createGoal = useCreateGoal(workspaceId);

  function handleCreate() {
    if (!title.trim()) return;
    if (type === "quantitative" && !targetValue) return;

    createGoal.mutate(
      {
        title,
        description: description || undefined,
        type,
        target_value: type === "quantitative" ? Number(targetValue) : undefined,
        expires_at: expiresAt || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setDescription("");
          setType("quantitative");
          setTargetValue("");
          setExpiresAt("");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm">
          <Plus className="size-4 mr-1" />
          Nova meta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova meta</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={type === "quantitative" ? "default" : "outline"}
                onClick={() => setType("quantitative")}
              >
                Quantitativa
              </Button>
              <Button
                size="sm"
                variant={type === "qualitative" ? "default" : "outline"}
                onClick={() => setType("qualitative")}
              >
                Qualitativa
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="goal-title">Título</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ler 20 livros"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="goal-description">Descrição</Label>
            <Textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
              rows={2}
            />
          </div>

          {type === "quantitative" && (
            <div className="space-y-1">
              <Label htmlFor="target-value">Valor alvo</Label>
              <Input
                id="target-value"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="Ex: 20"
                min={1}
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="expires-at">Prazo (opcional)</Label>
            <Input
              id="expires-at"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={createGoal.isPending}>
              {createGoal.isPending ? "Criando..." : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
