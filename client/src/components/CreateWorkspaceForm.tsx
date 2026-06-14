import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateWorkspace } from "@/hooks/useWorkspaces";

interface CreateWorkspaceFormProps {
  onClose: () => void;
}

export function CreateWorkspaceForm({ onClose }: CreateWorkspaceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createWorkspace = useCreateWorkspace();

  function handleCreate() {
    if (!name.trim()) return;
    createWorkspace.mutate(
      { name, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          onClose();
        },
      },
    );
  }

  return (
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
          <Button onClick={handleCreate} disabled={createWorkspace.isPending}>
            {createWorkspace.isPending ? "Criando..." : "Criar"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
