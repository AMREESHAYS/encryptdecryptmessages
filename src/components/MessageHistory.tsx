import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Lock, 
  Unlock, 
  Trash2, 
  Download, 
  Upload, 
  Search,
  Calendar,
  Shield,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMessageHistory } from '../context/MessageHistoryContext';
import type { EncryptionAlgorithm, MessageHistoryItem } from '../types/index';
import CopyButton from './CopyButton';

const MessageHistory: React.FC = () => {
  const { history, clearHistory } = useMessageHistory(); // Only use available context values
  const [searchTerm, setSearchTerm] = useState('');
  const [algorithmFilter, setAlgorithmFilter] = useState<EncryptionAlgorithm | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'encrypted' | 'decrypted'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredMessages = history.filter((message: MessageHistoryItem) => {
    const matchesSearch = message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlgorithm = algorithmFilter === 'all' || message.algorithm === algorithmFilter;
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'encrypted' && message.isEncrypted) ||
      (typeFilter === 'decrypted' && !message.isEncrypted);
    return matchesSearch && matchesAlgorithm && matchesType;
  });

  const handleClearHistory = () => {
    clearHistory();
    setShowConfirmClear(false);
    toast.success('History cleared');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) // 7 days
    {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
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
              <History className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Message History
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your encryption and decryption activities
          </p>
        </div>

        {/* Controls */}
        <div className="crypto-card p-6 space-y-4">
          {/* Search and filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="crypto-input pl-10"
              />
            </div>

            {/* Algorithm filter */}
            <select
              value={algorithmFilter}
              onChange={(e) => setAlgorithmFilter(e.target.value as any)}
              className="crypto-input"
            >
              <option value="all">All Algorithms</option>
              <option value="AES-256-GCM">AES-256-GCM</option>
              <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
              <option value="RSA-OAEP">RSA-OAEP</option>
            </select>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="crypto-input"
            >
              <option value="all">All Operations</option>
              <option value="encrypted">Encrypted</option>
              <option value="decrypted">Decrypted</option>
            </select>

            {/* Stats */}
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {filteredMessages.length} of {history.length} messages
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {}}
              className="crypto-button-secondary flex items-center space-x-2"
              disabled={history.length === 0}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <label className="crypto-button-secondary flex items-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={() => {}}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowConfirmClear(true)}
              className="crypto-button-secondary flex items-center space-x-2 text-red-600 hover:text-red-700"
              disabled={history.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Clear confirmation modal */}
        <AnimatePresence>
          {showConfirmClear && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Clear Message History
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Are you sure you want to clear all message history? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleClearHistory}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                        >
                          Clear History
                        </button>
                        <button
                          onClick={() => setShowConfirmClear(false)}
                          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Message list */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="crypto-card p-8 text-center">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {history.length === 0 ? 'No History Yet' : 'No Matching Messages'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {history.length === 0 
                ? 'Start encrypting or decrypting messages to see them here'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message: MessageHistoryItem) => (
              <div className="crypto-card p-4 hover:shadow-lg transition-all duration-200" key={message.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        message.isEncrypted 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      }`}>
                        {message.isEncrypted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-medium ${
                            message.isEncrypted ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                          }`}>
                            {message.isEncrypted ? 'Encrypted' : 'Decrypted'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-900 dark:text-white truncate mb-2">
                          {message.preview}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>{message.algorithm}</span>
                          </div>
                          <span>{message.originalLength} chars</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {message.encryptedData && (
                        <CopyButton 
                          text={message.encryptedData} 
                          size="sm"
                        />
                      )}
                      <button
                        onClick={() => {}}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        title="Remove message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="crypto-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {history.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Operations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {history.filter(m => m.isEncrypted).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Encryptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {history.filter(m => !m.isEncrypted).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Decryptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(history.map(m => m.algorithm)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Algorithms Used</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageHistory;