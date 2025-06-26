import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Zap, Shield, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { encryptData, validatePasswordStrength, ALGORITHM_CONFIGS } from '../utils/Cryptoutils';
import type { EncryptionAlgorithm, ProgressInfo } from '../types/index';
import { useMessageHistory } from '../context/MessageHistoryContext';
import { useTheme } from '../context/ThemeContest';
import CopyButton from './CopyButton';
import ProgressBar from './ProgressBar';

const EncryptionForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState<EncryptionAlgorithm>('AES-256-GCM');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [encryptionMetadata, setEncryptionMetadata] = useState<any>(null);

  const { addMessage } = useMessageHistory();
  const { theme } = useTheme();

  const passwordStrength = validatePasswordStrength(password);

  const handleEncrypt = useCallback(async () => {
    if (!message.trim()) {
      toast.error('Please enter a message to encrypt');
      return;
    }

    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    if (passwordStrength.strength === 'weak') {
      toast.error('Password is too weak. Please use a stronger password.');
      return;
    }

    setIsLoading(true);
    setProgress({ stage: 'preparing', percent: 0, message: 'Starting encryption...' });

    try {
      const result = await encryptData(
        message,
        password,
        algorithm,
        (progressInfo) => setProgress(progressInfo)
      );

      if (result.success && result.encryptedData) {
        const formattedResult = JSON.stringify({
          algorithm: result.algorithm,
          data: result.encryptedData,
          iv: result.iv,
          salt: result.salt,
          keyDerivation: result.keyDerivationInfo,
          timestamp: result.timestamp,
        }, null, 2);

        setEncryptedResult(formattedResult);
        setEncryptionMetadata(result);

        // Add to message history
        addMessage({
          id: crypto.randomUUID(),
          type: 'encrypted',
          content: message,
          timestamp: Date.now(),
          preview: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          algorithm,
          isEncrypted: true,
          originalLength: message.length,
          encryptedLength: formattedResult.length,
          encryptedData: formattedResult,
        });

        toast.success('Message encrypted successfully!');
      } else {
        toast.error(result.error || 'Encryption failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred during encryption');
      console.error('Encryption error:', error);
    } finally {
      setIsLoading(false);
      setProgress(null);
      setPassword(''); // Clear password for security
    }
  }, [message, password, algorithm, passwordStrength.strength, addMessage]);

  const handleClear = () => {
    setMessage('');
    setPassword('');
    setEncryptedResult('');
    setEncryptionMetadata(null);
    toast.success('Form cleared');
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthBgColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  // Main wrapper
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'block' }}
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-full ${
              theme === 'dark' 
                ? 'bg-primary-900 text-primary-400' 
                : 'bg-primary-100 text-primary-600'
            }`}>
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Encrypt Message
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Secure your message with military-grade encryption
          </p>
        </div>

        {/* Main form */}
        <div className="crypto-card p-6 space-y-6">
          {/* Algorithm selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Encryption Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as EncryptionAlgorithm)}
              className="crypto-input"
              disabled={isLoading}
            >
              {Object.entries(ALGORITHM_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name} - {config.description}
                  {config.isPremium ? ' (Premium)' : ''}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              <span>
                {ALGORITHM_CONFIGS[algorithm].keySize}-bit key • 
                {ALGORITHM_CONFIGS[algorithm].isPremium ? ' Premium Feature' : ' Standard Security'}
              </span>
            </div>
          </div>

          {/* Message input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message to Encrypt
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message here..."
              rows={6}
              className="crypto-textarea"
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {message.length} characters
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Encryption Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password..."
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
            
            {/* Password strength indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Password Strength
                  </span>
                  <span className={`text-xs font-medium ${getStrengthColor(passwordStrength.strength)}`}>
                    {passwordStrength.strength.toUpperCase()}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${getStrengthBgColor(passwordStrength.strength)}`}
                    style={{ width: `${password && password.length >= 8 ? 100 : 33}%` }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <ul className="list-disc list-inside space-y-1">
                      {passwordStrength.feedback.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
              onClick={handleEncrypt}
              disabled={isLoading || !message.trim() || !password}
              className="crypto-button flex-1 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Encrypting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Encrypt Message</span>
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

        {/* Results */}
        {encryptedResult && (
          <div className="crypto-card p-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'block' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Encrypted Result
                </h3>
                <CopyButton text={encryptedResult} />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words font-mono">
                  {encryptedResult}
                </pre>
              </div>

              {encryptionMetadata && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white">Algorithm</div>
                    <div className="text-gray-600 dark:text-gray-400">{encryptionMetadata.algorithm}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white">Original Size</div>
                    <div className="text-gray-600 dark:text-gray-400">{message.length} chars</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white">Encrypted Size</div>
                    <div className="text-gray-600 dark:text-gray-400">{encryptedResult.length} chars</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white">Timestamp</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {new Date(encryptionMetadata.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EncryptionForm;