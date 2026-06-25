import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex size-9 items-center justify-center rounded-md border border-input bg-background text-sm shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <Sun
          className={`h-4 w-4 transition-all ${
            theme === "system"
              ? "rotate-90 scale-0"
              : "rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all ${
            theme === "system"
              ? "rotate-90 scale-0"
              : "rotate-90 scale-0 dark:rotate-0 dark:scale-100"
          }`}
        />
        <Monitor
          className={`absolute h-4 w-4 transition-all ${
            theme === "system" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          <span className="flex-1">Claro</span>
          {theme === "light" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          <span className="flex-1">Escuro</span>
          {theme === "dark" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="h-4 w-4 mr-2" />
          <span className="flex-1">Sistema</span>
          {theme === "system" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
