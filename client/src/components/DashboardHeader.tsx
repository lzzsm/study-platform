import { User } from "lucide-react";

interface DashboardHeaderProps {
  name?: string;
  avatarUrl?: string;
}

export function DashboardHeader({ name, avatarUrl }: DashboardHeaderProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name ?? "Usuário"}
            className="size-full object-cover"
          />
        ) : (
          <User className="size-6 text-muted-foreground" />
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting()}, {name?.split(" ")[0]}
        </h1>
      </div>
    </div>
  );
}
