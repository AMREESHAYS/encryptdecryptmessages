import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Unlock, Eye, EyeOff, Zap, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { decryptData } from '../utils/Cryptoutils';
import type { EncryptionAlgorithm, ProgressInfo } from '../types/index';
import { useMessageHistory } from '../context/MessageHistoryContext';
import CopyButton from './CopyButton';
import ProgressBar from './ProgressBar';

const DecryptionForm: React.FC = () => {
  const [encryptedData, setEncryptedData] = useState('');
  const [password, setPassword] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [parsedMetadata, setParsedMetadata] = useState<any>(null);

  const { addMessage } = useMessageHistory();

  const handleDecrypt = useCallback(async () => {
    if (!encryptedData.trim()) {
      toast.error('Please enter encrypted data to decrypt');
      return;
    }

    if (!password) {
      toast.error('Please enter the decryption password');
      return;
    }

    setIsLoading(true);
    setProgress({ stage: 'preparing', percent: 0, message: 'Parsing encrypted data...' });

    try {
      // Parse the encrypted data JSON
      let metadata;
      try {
        metadata = JSON.parse(encryptedData);
        setParsedMetadata(metadata);
      } catch (parseError) {
        toast.error('Invalid encrypted data format. Please check your input.');
        setIsLoading(false);
        setProgress(null);
        return;
      }

      // Validate required fields
      if (!metadata.algorithm || !metadata.data || !metadata.iv || !metadata.salt) {
        toast.error('Encrypted data is missing required fields');
        setIsLoading(false);
        setProgress(null);
        return;
      }

      const result = await decryptData(
        metadata.data,
        password,
        metadata.algorithm as EncryptionAlgorithm,
        metadata.iv,
        metadata.salt,
        (progressInfo) => setProgress(progressInfo)
      );

      if (result.success && result.decryptedData) {
        setDecryptedResult(result.decryptedData);

        // Add to message history
        addMessage({
          id: crypto.randomUUID(),
          type: 'decrypted',
          content: result.decryptedData,
          timestamp: Date.now(),
          preview: result.decryptedData.substring(0, 50) + (result.decryptedData.length > 50 ? '...' : ''),
          algorithm: metadata.algorithm,
          isEncrypted: false,
          originalLength: result.decryptedData.length,
          encryptedLength: encryptedData.length,
          encryptedData,
        });

        toast.success('Message decrypted successfully!');
      } else {
        // Remove result.error usage, just show generic error
        toast.error('Decryption failed. Please check your password and data.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred during decryption');
      console.error('Decryption error:', error);
    } finally {
      setIsLoading(false);
      setProgress(null);
      setPassword(''); // Clear password for security
    }
  }, [encryptedData, password, addMessage]);

  const handleClear = () => {
    setEncryptedData('');
    setPassword('');
    setDecryptedResult('');
    setParsedMetadata(null);
    toast.success('Form cleared');
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEncryptedData(text);
      toast.success('Encrypted data pasted from clipboard');
    } catch (error) {
      toast.error('Failed to read from clipboard');
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
              <Unlock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Decrypt Message
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Restore your encrypted message to its original form
          </p>
        </div>

        {/* Main form */}
        <div className="crypto-card p-6 space-y-6">
          {/* Encrypted data input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Encrypted Data
              </label>
              <button
                onClick={handlePasteFromClipboard}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                disabled={isLoading}
              >
                Paste from Clipboard
              </button>
            </div>
            <textarea
              value={encryptedData}
              onChange={(e) => setEncryptedData(e.target.value)}
              placeholder="Paste your encrypted data JSON here..."
              rows={8}
              className="crypto-textarea"
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {encryptedData.length} characters
            </div>
          </div>

          {/* Parsed metadata preview */}
          {parsedMetadata && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Detected Encryption Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Algorithm:</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">{parsedMetadata.algorithm}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Timestamp:</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">
                    {parsedMetadata.timestamp ? new Date(parsedMetadata.timestamp).toLocaleString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Decryption Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the password used for encryption..."
                className="crypto-input pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {progress && (
            <ProgressBar
              progress={progress.percent}
              message={progress.message || ''}
              stage={progress.stage || 'preparing'}
            />
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDecrypt}
              disabled={isLoading || !encryptedData.trim() || !password}
              className="crypto-button flex-1 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Decrypting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Decrypt Message</span>
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="crypto-button-secondary flex items-center justify-center space-x-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {decryptedResult && (
        <div className="crypto-card p-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Decrypted Message</span>
              </h3>
              <CopyButton text={decryptedResult} />
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap break-words">
                {decryptedResult}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white">Algorithm Used</div>
                <div className="text-gray-600 dark:text-gray-400">{parsedMetadata?.algorithm || 'Unknown'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white">Message Length</div>
                <div className="text-gray-600 dark:text-gray-400">{decryptedResult.length} chars</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white">Decrypted At</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DecryptionForm;