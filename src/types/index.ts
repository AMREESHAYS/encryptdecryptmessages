// Central TypeScript types for encryption/decryption app

export type EncryptionAlgorithm = 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'RSA';
export type Theme = 'light' | 'dark' | 'system';
export type PremiumTheme = 'gradient' | 'neon' | 'minimal';

export interface ProgressInfo {
  percent: number;
  message?: string;
  stage?: 'preparing' | 'processing' | 'finalizing' | 'complete' | string;
}

export interface Message {
  id: string;
  content: string;
  encrypted: boolean;
  algorithm: EncryptionAlgorithm;
  timestamp: number;
}

export interface KeyDerivationOptions {
  salt: string;
  iterations: number;
  algorithm: 'PBKDF2' | 'Scrypt';
}

export type MessageHistoryItem = {
  id: string;
  type: 'encrypted' | 'decrypted';
  content: string;
  timestamp: number;
  preview: string;
  algorithm: EncryptionAlgorithm;
  isEncrypted: boolean;
  originalLength: number;
  encryptedLength: number;
  encryptedData?: string;
  meta?: Record<string, unknown>;
};

// Define ActiveTab type here for context usage
export type ActiveTab = 'encrypt' | 'decrypt' | 'settings' | 'history';
