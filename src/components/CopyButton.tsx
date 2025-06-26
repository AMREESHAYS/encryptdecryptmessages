import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className = '', 
  size = 'md' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
      console.error('Copy failed:', error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        toast.success('Copied to clipboard!');
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackError) {
        toast.error('Copy not supported in this browser');
      }
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1 text-xs';
      case 'lg':
        return 'p-3 text-base';
      default:
        return 'p-2 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center justify-center space-x-1 
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
        text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
        rounded-lg border border-gray-300 dark:border-gray-600
        transition-all duration-200 transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${getSizeClasses()} ${className}
      `}
      title="Copy to clipboard"
      disabled={copied}
    >
      {copied ? (
        <>
          <Check className={`${getIconSize()} text-green-500`} />
          {size !== 'sm' && <span>Copied!</span>}
        </>
      ) : (
        <>
          <Copy className={getIconSize()} />
          {size !== 'sm' && <span>Copy</span>}
        </>
      )}
    </button>
  );
};

export default CopyButton;