import React, { createContext, useContext, useState } from 'react';
import type { ActiveTab } from './src/types/index';

interface TabContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  previousTab: ActiveTab | null;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function useTab() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
}

interface TabProviderProps {
  children: React.ReactNode;
}

export function TabProvider({ children }: TabProviderProps) {
  const [activeTab, setActiveTabState] = useState<ActiveTab>('encrypt');
  const [previousTab, setPreviousTab] = useState<ActiveTab | null>(null);

  const setActiveTab = (tab: ActiveTab) => {
    setPreviousTab(activeTab);
    setActiveTabState(tab);
  };

  const value: TabContextType = {
    activeTab,
    setActiveTab,
    previousTab,
  };

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
}