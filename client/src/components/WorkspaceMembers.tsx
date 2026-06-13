import { useState } from "react";
import {
  useWorkspaceMembers,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
} from "@/hooks/useWorkspaceMembers";
import type {
  WorkspaceMember,
  WorkspaceRole,
} from "@/types/workspaceMember.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { UserPlus, Trash2, User } from "lucide-react";
import { MemberListSkeleton } from "@/components/skeletons/MemberListSkeleton";
import { useMe } from "@/hooks/useMe";

const roleLabels: Record<WorkspaceRole, string> = {
  owner: "Dono",
  editor: "Editor",
  viewer: "Visualizador",
};

interface Props {
  workspaceId: number;
}

export function WorkspaceMembers({ workspaceId }: Props) {
  const { data: members, isLoading } = useWorkspaceMembers(workspaceId);
  const { data: currentUser } = useMe();
  const inviteMember = useInviteMember(workspaceId);
  const updateRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveMember(workspaceId);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");

  // verifica se o usuário atual é owner
  const currentMember = members?.find(
    (m: WorkspaceMember) => m.user_id === currentUser?.id,
  );
  const isOwner = currentMember?.role === "owner";

  function handleInvite() {
    if (!email.trim()) return;
    inviteMember.mutate(
      { email, role },
      {
        onSuccess: () => {
          setEmail("");
          setRole("viewer");
        },
      },
    );
  }

  if (isLoading) return <MemberListSkeleton />;

  return (
    <div className="space-y-6">
      {/* ── CONVIDAR ── */}
      {isOwner && (
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <UserPlus className="size-4" />
            Convidar membro
          </h3>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="invite-email"
                className="text-xs text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Papel</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as "editor" | "viewer")}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleInvite}
                disabled={inviteMember.isPending}
                size="sm"
              >
                {inviteMember.isPending ? "Convidando..." : "Convidar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── LISTA DE MEMBROS ── */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">
          Membros ({members?.length ?? 0})
        </h3>
        {members?.map((member: WorkspaceMember) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={member.avatar_url ?? undefined} />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Alterar papel — só owner pode, e não pode alterar o próprio owner */}
              {isOwner && member.role !== "owner" ? (
                <Select
                  value={member.role}
                  onValueChange={(v) =>
                    updateRole.mutate({
                      userId: member.user_id,
                      role: v as WorkspaceRole,
                    })
                  }
                >
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-xs text-muted-foreground px-2">
                  {roleLabels[member.role]}
                </span>
              )}

              {/* Remover — só owner pode, e não pode remover o próprio owner */}
              {isOwner && member.role !== "owner" && (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Trash2 className="size-3.5 text-muted-foreground" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover membro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {member.name} perderá acesso a este workspace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeMember.mutate(member.user_id)}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
