// Core cryptographic types
export interface CryptoResult {
  success: boolean;
  data?: string;
  error?: string;
  algorithm?: string;
  timestamp?: number;
}

export interface EncryptionResult extends CryptoResult {
  encryptedData?: string;
  iv?: string;
  salt?: string;
  keyDerivationInfo?: KeyDerivationInfo;
}

export interface DecryptionResult extends CryptoResult {
  decryptedData?: string;
}

export interface KeyDerivationInfo {
  algorithm: 'PBKDF2' | 'scrypt';
  iterations?: number;
  keyLength: number;
  saltLength: number;
}

// Supported encryption algorithms
export type EncryptionAlgorithm = 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'RSA-OAEP';

// Algorithm configuration
export interface AlgorithmConfig {
  name: string;
  description: string;
  keySize: number;
  ivSize: number;
  tagSize?: number;
  isPremium?: boolean;
}

// Message history types
export interface EncryptedMessage {
  id: string;
  timestamp: number;
  algorithm: EncryptionAlgorithm;
  originalLength: number;
  encryptedLength: number;
  isEncrypted: boolean;
  preview: string; // First 50 chars of original message
  encryptedData?: string; // Stored encrypted for premium users
}

export interface MessageHistory {
  messages: EncryptedMessage[];
  totalCount: number;
  lastCleanup: number;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type PremiumTheme = 'gradient' | 'neon' | 'minimal';

// Tab types
export type ActiveTab = 'encrypt' | 'decrypt' | 'history' | 'settings';

// Settings types
export interface AppSettings {
  theme: Theme;
  premiumTheme?: PremiumTheme;
  defaultAlgorithm: EncryptionAlgorithm;
  autoSaveHistory: boolean;
  historyLimit: number;
  keyDerivation: KeyDerivationInfo;
  premiumMode: boolean;
  animations: boolean;
  soundEffects: boolean;
  autoClipboard: boolean;
}

// File handling types
export interface FileProcessingOptions {
  chunkSize: number;
  maxFileSize: number;
  supportedTypes: string[];
}

export interface FileEncryptionResult {
  success: boolean;
  fileName: string;
  originalSize: number;
  encryptedSize: number;
  processingTime: number;
  chunks: number;
  error?: string;
}

// Progress tracking
export interface ProgressInfo {
  stage: 'preparing' | 'processing' | 'finalizing' | 'complete';
  progress: number; // 0-100
  message: string;
  estimatedTime?: number;
}

// Export/Import types
export interface ExportData {
  version: string;
  settings: AppSettings;
  history: MessageHistory;
  exportDate: number;
  checksum: string;
}

// CLI types
export interface CLIOptions {
  algorithm: EncryptionAlgorithm;
  input: string;
  output?: string;
  password?: string;
  keyDerivation: KeyDerivationInfo;
  verbose: boolean;
  batch: boolean;
}

// Error types
export class CryptoError extends Error {
  constructor(
    message: string,
    public code: string,
    public algorithm?: string,
    public context?: any
  ) {
    super(message);
    this.name = 'CryptoError';
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}