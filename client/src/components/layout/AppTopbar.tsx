import { useNavigate } from "react-router-dom";
import { useTabsStore } from "@/store/tabsStore";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
  const navigate = useNavigate();
  const { tabs, activeTabId, closeTab, setActiveTab } = useTabsStore();

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

      <Button
        variant="ghost"
        size="icon"
        className="size-7 ml-1 shrink-0"
        onClick={() => navigate("/workspaces")}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
