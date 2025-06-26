import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Info,
  Crown,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContest';
import { useMessageHistory } from '../context/MessageHistoryContext';
import type { Theme } from '../types/index';

const SettingsPanel: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { clearHistory } = useMessageHistory();
  const [isPremiumMode, setIsPremiumMode] = useState(false);

  const themes: { value: Theme; label: string; description: string }[] = [
    { value: 'light', label: 'Light', description: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
    { value: 'system', label: 'System', description: 'Follows your device setting' },
  ];

  const handleExportSettings = () => {
    try {
      const settings = {
        theme,
        exportDate: Date.now(),
      };
      
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cryptovault-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Settings exported successfully!');
    } catch (error) {
      toast.error('Failed to export settings');
    }
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.theme) setTheme(data.theme);
        if (typeof data.premiumMode === 'boolean') setIsPremiumMode(data.premiumMode);
        
        toast.success('Settings imported successfully!');
      } catch (error) {
        toast.error('Invalid settings file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
              <Settings className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your CryptoVault experience
          </p>
        </div>
      </motion.div>

      {/* Premium Mode Toggle */}
      <div className="crypto-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Premium Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlock additional algorithms and premium themes
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPremiumMode(!isPremiumMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPremiumMode 
                ? 'bg-primary-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPremiumMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {isPremiumMode && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Premium Features Unlocked
                </span>
              </div>
              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• ChaCha20-Poly1305 encryption algorithm</li>
                <li>• RSA-OAEP hybrid encryption</li>
                <li>• Premium theme variants</li>
                <li>• Advanced message history</li>
              </ul>
            </motion.div>
          </div>
        )}
      </div>

      {/* Appearance Settings */}
      <div className="crypto-card p-6 space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h3>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Color Theme
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  theme === themeOption.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {themeOption.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {themeOption.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="crypto-card p-6 space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Security
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Password Security
            </h4>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>• Passwords are never stored</li>
              <li>• Memory cleared after operations</li>
              <li>• Strong password validation</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Encryption Standards
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• AES-256-GCM encryption</li>
              <li>• PBKDF2 key derivation</li>
              <li>• Cryptographically secure random</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="crypto-card p-6 space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Data Management
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportSettings}
            className="crypto-button-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Settings</span>
          </button>

          <label className="crypto-button-secondary flex items-center justify-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Settings</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              clearHistory();
              toast.success('All data cleared');
            }}
            className="crypto-button-secondary w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            This will clear message history and reset all settings
          </p>
        </div>
      </div>

      {/* About */}
      <div className="crypto-card p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          CryptoVault
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Version 1.0.0 • Built with security in mind
        </p>
        <div className="flex justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
          <span>🔒 End-to-End Security</span>
          <span>🚀 Modern Algorithms</span>
          <span>🎨 Beautiful Interface</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;