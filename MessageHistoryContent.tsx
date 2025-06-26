import React, { createContext, useContext, useEffect, useState } from 'react';
import { MessageHistory, EncryptedMessage, AppSettings } from '@/types';

interface MessageHistoryContextType {
  history: MessageHistory;
  addMessage: (message: Omit<EncryptedMessage, 'id' | 'timestamp'>) => void;
  removeMessage: (id: string) => void;
  clearHistory: () => void;
  getMessageById: (id: string) => EncryptedMessage | undefined;
  exportHistory: () => string;
  importHistory: (data: string) => boolean;
  secureErase: () => void;
}

const MessageHistoryContext = createContext<MessageHistoryContextType | undefined>(undefined);

export function useMessageHistory() {
  const context = useContext(MessageHistoryContext);
  if (context === undefined) {
    throw new Error('useMessageHistory must be used within a MessageHistoryProvider');
  }
  return context;
}

interface MessageHistoryProviderProps {
  children: React.ReactNode;
  settings?: AppSettings;
}

export function MessageHistoryProvider({ children, settings }: MessageHistoryProviderProps) {
  const [history, setHistory] = useState<MessageHistory>(() => {
    try {
      const saved = localStorage.getItem('messageHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          messages: parsed.messages || [],
          totalCount: parsed.totalCount || 0,
          lastCleanup: parsed.lastCleanup || Date.now(),
        };
      }
    } catch (error) {
      console.warn('Failed to load message history:', error);
    }
    
    return {
      messages: [],
      totalCount: 0,
      lastCleanup: Date.now(),
    };
  });

  // Save history to localStorage when it changes
  useEffect(() => {
    if (settings?.autoSaveHistory !== false) {
      try {
        localStorage.setItem('messageHistory', JSON.stringify(history));
      } catch (error) {
        console.warn('Failed to save message history:', error);
      }
    }
  }, [history, settings?.autoSaveHistory]);

  // Auto-cleanup old messages based on settings
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      const maxMessages = settings?.historyLimit || 100;

      setHistory(prev => {
        const filtered = prev.messages
          .filter(msg => now - msg.timestamp < maxAge)
          .slice(-maxMessages)
          .sort((a, b) => b.timestamp - a.timestamp);

        if (filtered.length !== prev.messages.length) {
          return {
            messages: filtered,
            totalCount: prev.totalCount,
            lastCleanup: now,
          };
        }

        return prev;
      });
    };

    const interval = setInterval(cleanup, 60 * 60 * 1000); // Check hourly
    return () => clearInterval(interval);
  }, [settings?.historyLimit]);

  const addMessage = (message: Omit<EncryptedMessage, 'id' | 'timestamp'>) => {
    const newMessage: EncryptedMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setHistory(prev => ({
      messages: [newMessage, ...prev.messages].slice(0, settings?.historyLimit || 100),
      totalCount: prev.totalCount + 1,
      lastCleanup: prev.lastCleanup,
    }));
  };

  const removeMessage = (id: string) => {
    setHistory(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== id),
    }));
  };

  const clearHistory = () => {
    setHistory({
      messages: [],
      totalCount: 0,
      lastCleanup: Date.now(),
    });
  };

  const getMessageById = (id: string): EncryptedMessage | undefined => {
    return history.messages.find(msg => msg.id === id);
  };

  const exportHistory = (): string => {
    const exportData = {
      version: '1.0.0',
      exportDate: Date.now(),
      history,
      checksum: btoa(JSON.stringify(history)).slice(0, 16),
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importHistory = (data: string): boolean => {
    try {
      const imported = JSON.parse(data);
      
      if (!imported.version || !imported.history) {
        return false;
      }

      // Validate imported data structure
      if (!Array.isArray(imported.history.messages)) {
        return false;
      }

      // Merge with existing history (avoid duplicates)
      const existingIds = new Set(history.messages.map(msg => msg.id));
      const newMessages = imported.history.messages.filter(
        (msg: EncryptedMessage) => !existingIds.has(msg.id)
      );

      setHistory(prev => ({
        messages: [...newMessages, ...prev.messages]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, settings?.historyLimit || 100),
        totalCount: prev.totalCount + newMessages.length,
        lastCleanup: Date.now(),
      }));

      return true;
    } catch (error) {
      console.warn('Failed to import history:', error);
      return false;
    }
  };

  const secureErase = () => {
    // Overwrite sensitive data before clearing
    setHistory(prev => ({
      messages: prev.messages.map(msg => ({
        ...msg,
        encryptedData: undefined,
        preview: '[ERASED]',
      })),
      totalCount: prev.totalCount,
      lastCleanup: Date.now(),
    }));

    // Clear after a brief delay
    setTimeout(() => {
      clearHistory();
    }, 100);
  };

  const value: MessageHistoryContextType = {
    history,
    addMessage,
    removeMessage,
    clearHistory,
    getMessageById,
    exportHistory,
    importHistory,
    secureErase,
  };

  return (
    <MessageHistoryContext.Provider value={value}>
      {children}
    </MessageHistoryContext.Provider>
  );
}