import { useState } from "react";
import {
  useWorkspaceMembers,
  useUpdateMemberRole,
  useRemoveMember,
} from "@/hooks/useWorkspaceMembers";
import {
  useInviteMember,
  useWorkspacePendingInvites,
  useCancelInvite,
} from "@/hooks/useInvites";
import type {
  WorkspaceMember,
  WorkspaceRole,
} from "@/types/workspaceMember.types";
import type { WorkspaceInviteWithDetails } from "@/types/workspaceInvite.types";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UserPlus, Trash2, User, Clock, X } from "lucide-react";
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

export function WorkspaceMembersTab({ workspaceId }: Props) {
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
  const [cancellingInviteId, setCancellingInviteId] = useState<number | null>(
    null,
  );

  const { data, isLoading } = useWorkspaceMembers(workspaceId, page);
  const { data: pendingInvites } = useWorkspacePendingInvites(workspaceId);
  const { data: currentUser } = useMe();

  const inviteMember = useInviteMember(workspaceId);
  const updateRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveMember(workspaceId);
  const cancelInvite = useCancelInvite(workspaceId);

  const members = data?.items ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / 10);
  const currentMember = members.find(
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

      {/* ── CONVITES PENDENTES ── */}
      {isOwner && pendingInvites && pendingInvites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="size-4" />
            Convites pendentes ({pendingInvites.length})
          </h3>
          {pendingInvites.map((invite: WorkspaceInviteWithDetails) => (
            <div
              key={invite.id}
              className="flex items-center justify-between p-3 border border-dashed rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback>
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Convite enviado
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {roleLabels[invite.role as WorkspaceRole]} · expira em{" "}
                    {new Date(invite.expires_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setCancellingInviteId(invite.id)}
              >
                <X className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ── LISTA DE MEMBROS ── */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Membros ({data?.total ?? 0})</h3>

        {members.map((member: WorkspaceMember) => (
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

              {isOwner && member.role !== "owner" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setRemovingMemberId(member.user_id)}
                >
                  <Trash2 className="size-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {members.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum membro ainda.</p>
        )}

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

      {/* ── DIALOG REMOVER MEMBRO ── */}
      <AlertDialog
        open={removingMemberId !== null}
        onOpenChange={(open) => {
          if (!open) setRemovingMemberId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover membro?</AlertDialogTitle>
            <AlertDialogDescription>
              Este membro perderá acesso ao workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                if (removingMemberId) {
                  removeMember.mutate(removingMemberId, {
                    onSuccess: () => setRemovingMemberId(null),
                  });
                }
              }}
              disabled={removeMember.isPending}
            >
              {removeMember.isPending ? "Removendo..." : "Remover"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── DIALOG CANCELAR CONVITE ── */}
      <AlertDialog
        open={cancellingInviteId !== null}
        onOpenChange={(open) => {
          if (!open) setCancellingInviteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar convite?</AlertDialogTitle>
            <AlertDialogDescription>
              O convite será cancelado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <Button
              onClick={() => {
                if (cancellingInviteId) {
                  cancelInvite.mutate(cancellingInviteId, {
                    onSuccess: () => setCancellingInviteId(null),
                  });
                }
              }}
              disabled={cancelInvite.isPending}
            >
              {cancelInvite.isPending ? "Cancelando..." : "Cancelar convite"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
