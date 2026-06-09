import { create } from "zustand";

interface Tab {
  id: number;
  name: string;
}

interface TabsStore {
  tabs: Tab[];
  activeTabId: number | null;
  openTab: (tab: Tab) => void;
  closeTab: (id: number) => void;
  setActiveTab: (id: number) => void;
}

export const useTabsStore = create<TabsStore>((set) => ({
  tabs: [],
  activeTabId: null,

  openTab: (tab) =>
    set((state) => {
      const exists = state.tabs.find((t) => t.id === tab.id);
      if (exists) return { activeTabId: tab.id };
      return { tabs: [...state.tabs, tab], activeTabId: tab.id };
    }),

  closeTab: (id) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== id);
      const newActive =
        state.activeTabId === id
          ? (newTabs[newTabs.length - 1]?.id ?? null)
          : state.activeTabId;
      return { tabs: newTabs, activeTabId: newActive };
    }),

  setActiveTab: (id) => set({ activeTabId: id }),
}));
