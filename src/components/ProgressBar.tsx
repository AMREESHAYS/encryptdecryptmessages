import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { ProgressInfo } from '../types/index';

interface ProgressBarProps {
  progress: number;
  message: string;
  stage: ProgressInfo['stage'];
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  message, 
  stage, 
  className = '' 
}) => {
  const getStageIcon = () => {
    switch (stage) {
      case 'preparing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
      case 'finalizing':
        return <Loader2 className="w-4 h-4 animate-spin text-orange-500" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'preparing':
        return 'from-blue-500 to-blue-600';
      case 'processing':
        return 'from-yellow-500 to-yellow-600';
      case 'finalizing':
        return 'from-orange-500 to-orange-600';
      case 'complete':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {/* Progress message */}
        <div className="flex items-center space-x-2">
          {getStageIcon()}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </span>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className={`progress-fill bg-gradient-to-r ${getStageColor()}`}
          style={{ width: `${progress}%`, transition: 'width 0.5s ease-out' }}
        />
      </div>

      {/* Progress percentage */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span className="capitalize font-medium">{stage ? stage.replace('_', ' ') : ''}</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {/* Stage indicator dots */}
      <div className="flex justify-center space-x-2">
        {['preparing', 'processing', 'finalizing', 'complete'].map((stageKey, index) => (
          <div
            key={stageKey}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index < ['preparing', 'processing', 'finalizing', 'complete'].indexOf(stage || '') + 1
                ? 'bg-primary-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;