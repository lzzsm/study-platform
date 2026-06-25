import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSearch } from "@/hooks/usePublicProfile";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, ArrowRight } from "lucide-react";
import type { UserSearchResult } from "@/types/user.types";
import { useDebounce } from "@/hooks/useDebounce";

function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const { data: results, isLoading } = useUserSearch(debouncedQuery);

  return (
    <div className="max-w-xl mx-auto space-y-8 pt-8">
      {/* ── HEADER ── */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Buscar usuários</h1>
        <p className="text-sm text-muted-foreground">
          Encontre outros estudantes pelo nome ou email
        </p>
      </div>

      {/* ── INPUT ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9 h-11 bg-muted/50 border-border/50 focus:bg-background transition-colors"
          placeholder="Nome ou email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* ── ESTADOS ── */}
      {query.trim().length > 0 && query.trim().length < 2 && (
        <p className="text-center text-sm text-muted-foreground">
          Digite pelo menos 2 caracteres.
        </p>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 animate-pulse"
            >
              <div className="size-10 rounded-full bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-28 bg-muted rounded-full" />
                <div className="h-3 w-44 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && results?.length === 0 && query.trim().length >= 2 && (
        <div className="text-center py-8 space-y-2">
          <User className="size-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            Nenhum usuário encontrado para "{query}".
          </p>
        </div>
      )}

      {!isLoading && results && results.length > 0 && (
        <div className="space-y-2">
          {results.map((user: UserSearchResult) => (
            <button
              key={user.id}
              onClick={() => navigate(`/users/${user.id}`)}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
            >
              <Avatar className="size-10 shrink-0">
                <AvatarImage src={user.avatar_url ?? undefined} />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{user.name}</p>
                {user.bio && (
                  <p className="text-xs text-muted-foreground truncate">
                    {user.bio}
                  </p>
                )}
              </div>
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* estado inicial — sem query */}
      {query.trim().length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Comece digitando para encontrar usuários.
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
