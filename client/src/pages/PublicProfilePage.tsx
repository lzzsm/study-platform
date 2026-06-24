import { useParams, useNavigate } from "react-router-dom";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Flame,
  Target,
  BookOpen,
  User,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function PublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: profile, isLoading } = usePublicProfile(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-8 pt-8">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto pt-8 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/search")}>
          <ArrowLeft className="size-4 mr-2" />
          Voltar à busca
        </Button>
        <p className="text-muted-foreground text-sm">Usuário não encontrado.</p>
      </div>
    );
  }

  const joinedDate = new Date(profile.created_at).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      label: "Tarefas completas",
      value: profile.stats.completedTasks,
      icon: CheckCircle,
      color: "text-muted-foreground",
    },
    {
      label: "Melhor streak",
      value: `${profile.stats.bestStreak} dias`,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Metas concluídas",
      value: profile.stats.completedGoals,
      icon: Target,
      color: "text-muted-foreground",
    },
    {
      label: "Hábitos ativos",
      value: profile.stats.activeHabits,
      icon: BookOpen,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-8 pt-8">
      {/* ── VOLTAR ── */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/search")}
        className="-ml-2"
      >
        <ArrowLeft className="size-4 mr-2" />
        Voltar à busca
      </Button>

      {/* ── PERFIL ── */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16 ring-2 ring-border">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback className="text-lg">
            <User className="size-6" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight">{profile.name}</h1>
          {profile.bio && (
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
            <Calendar className="size-3" />
            <span>Membro desde {joinedDate}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── STATS ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Estatísticas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-muted/50 space-y-2"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={`size-3.5 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage;
