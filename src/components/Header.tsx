import React from 'react';
import { Shield, Sun, Moon, Laptop, Settings, History, Lock, Unlock } from 'lucide-react';
import { useTheme } from '../context/ThemeContest';
import { useTab } from '../context/TabContest';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { tab, setTab } = useTab();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-5 h-5" />;
      case 'dark': return <Moon className="w-5 h-5" />;
      case 'system': return <Laptop className="w-5 h-5" />;
      default: return <Sun className="w-5 h-5" />;
    }
  };

  const tabs = [
    { id: 'encrypt' as const, label: 'Encrypt', icon: Lock },
    { id: 'decrypt' as const, label: 'Decrypt', icon: Unlock },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                CryptoVault
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure Encryption Tool
              </p>
            </div>
          </div>
          {/* Tabs */}
          <nav className="flex space-x-4">
            {tabs.map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors duration-200 ${tab === tabItem.id ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <tabItem.icon className="w-5 h-5" />
                <span>{tabItem.label}</span>
              </button>
            ))}
          </nav>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Toggle theme"
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;