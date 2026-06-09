import { useNavigate } from "react-router-dom";
import { useTabsStore } from "@/store/tabsStore";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
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
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex items-center gap-2 px-3 py-1 rounded-t text-sm cursor-pointer whitespace-nowrap border-b-2 transition-colors ${
            activeTabId === tab.id
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.name}
          <button
            onClick={(e) => handleClose(e, tab.id)}
            className="hover:text-destructive transition-colors"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}

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
