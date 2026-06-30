import { useNavigate } from "react-router-dom";
import { useTabsStore } from "@/store/tabsStore";
import { X, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePendingInvites } from "@/hooks/useInvites";

export function AppTopbar() {
  const navigate = useNavigate();
  const { tabs, activeTabId, closeTab, setActiveTab } = useTabsStore();
  const { data: invites } = usePendingInvites();
  const pendingCount = invites?.length ?? 0;

  function handleTabClick(id: number) {
    setActiveTab(id);
    navigate(`/workspaces/${id}`);
  }

  function handleClose(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    closeTab(id);
    if (activeTabId === id) {
      navigate("/dashboard");
    }
  }

  return (
    <div className="flex items-center gap-1 border-b px-4 h-10 overflow-x-auto">
      {tabs.length === 0 ? (
        <span className="text-sm text-muted-foreground">
          Nenhuma aba aberta
        </span>
      ) : (
        tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`group flex items-center gap-3 pl-3 pr-2 py-1 rounded-t text-sm cursor-pointer whitespace-nowrap border-b-2 transition-colors hover:bg-muted/50 ${
              activeTabId === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.name}
            <button
              onClick={(e) => handleClose(e, tab.id)}
              className="opacity-0 group-hover:opacity-100 rounded-sm p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))
      )}

      <div className="ml-auto flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 relative"
          onClick={() => navigate("/invites")}
        >
          <Bell className="size-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium leading-none">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => navigate("/workspaces")}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
