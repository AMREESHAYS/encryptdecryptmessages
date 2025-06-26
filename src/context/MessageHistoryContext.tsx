import { createContext, useContext, useState, ReactNode } from 'react';
import type { MessageHistoryItem } from '../types/index';

type MessageHistoryContextType = {
  history: MessageHistoryItem[];
  addMessage: (item: MessageHistoryItem) => void;
  clearHistory: () => void;
};

const MessageHistoryContext = createContext<MessageHistoryContextType | undefined>(undefined);

export const MessageHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<MessageHistoryItem[]>([]);

  const addMessage = (item: MessageHistoryItem) => setHistory((h) => [item, ...h]);
  const clearHistory = () => setHistory([]);

  return (
    <MessageHistoryContext.Provider value={{ history, addMessage, clearHistory }}>
      {children}
    </MessageHistoryContext.Provider>
  );
};

export const useMessageHistory = () => {
  const ctx = useContext(MessageHistoryContext);
  if (!ctx) throw new Error('useMessageHistory must be used within MessageHistoryProvider');
  return ctx;
};