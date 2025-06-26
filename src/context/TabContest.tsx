import { createContext, useContext, useState, ReactNode } from 'react';

type Tab = 'encrypt' | 'decrypt' | 'settings' | 'history';

type TabContextType = {
  tab: Tab;
  setTab: (tab: Tab) => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState<Tab>('encrypt');
  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTab must be used within TabProvider');
  return ctx;
};