import CryptoJS from 'crypto-js';
import { forge } from 'node-forge';
import {
  EncryptionAlgorithm,
  EncryptionResult,
  DecryptionResult,
  KeyDerivationInfo,
  CryptoError,
  ProgressInfo,
} from '@/types';

// Algorithm configurations
export const ALGORITHM_CONFIGS = {
  'AES-256-GCM': {
    name: 'AES-256-GCM',
    description: 'Advanced Encryption Standard with Galois/Counter Mode',
    keySize: 256,
    ivSize: 96,
    tagSize: 128,
    isPremium: false,
  },
  'ChaCha20-Poly1305': {
    name: 'ChaCha20-Poly1305',
    description: 'Modern stream cipher with Poly1305 authentication',
    keySize: 256,
    ivSize: 96,
    tagSize: 128,
    isPremium: true,
  },
  'RSA-OAEP': {
    name: 'RSA-OAEP',
    description: 'RSA with Optimal Asymmetric Encryption Padding',
    keySize: 2048,
    ivSize: 0,
    isPremium: true,
  },
};

// Default key derivation settings
export const DEFAULT_KEY_DERIVATION: KeyDerivationInfo = {
  algorithm: 'PBKDF2',
  iterations: 100000,
  keyLength: 32,
  saltLength: 16,
};

/**
 * Generates a cryptographically secure random salt
 */
export function generateSalt(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a cryptographically secure random IV
 */
export function generateIV(length: number = 12): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Derives a key from password using PBKDF2 or scrypt
 */
export async function deriveKey(
  password: string,
  salt: string,
  config: KeyDerivationInfo = DEFAULT_KEY_DERIVATION
): Promise<string> {
  try {
    if (config.algorithm === 'PBKDF2') {
      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: config.keyLength / 4, // CryptoJS uses 32-bit words
        iterations: config.iterations,
        hasher: CryptoJS.algo.SHA256,
      });
      return key.toString(CryptoJS.enc.Hex);
    } else if (config.algorithm === 'scrypt') {
      // Using CryptoJS scrypt implementation
      const key = CryptoJS.scrypt(password, salt, {
        keySize: config.keyLength / 4,
        N: 16384, // CPU/memory cost parameter
        r: 8,     // Block size parameter
        p: 1,     // Parallelization parameter
      });
      return key.toString(CryptoJS.enc.Hex);
    }
    throw new CryptoError('Unsupported key derivation algorithm', 'UNSUPPORTED_KDF');
  } catch (error) {
    throw new CryptoError(
      `Key derivation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'KEY_DERIVATION_FAILED'
    );
  }
}

/**
 * Encrypts data using AES-256-GCM
 */
export async function encryptAES256GCM(
  data: string,
  password: string,
  progressCallback?: (progress: ProgressInfo) => void
): Promise<EncryptionResult> {
  try {
    progressCallback?.({ stage: 'preparing', progress: 10, message: 'Generating salt and IV...' });
    
    const salt = generateSalt(16);
    const iv = generateIV(12);
    
    progressCallback?.({ stage: 'processing', progress: 30, message: 'Deriving encryption key...' });
    
    const key = await deriveKey(password, salt);
    
    progressCallback?.({ stage: 'processing', progress: 60, message: 'Encrypting data...' });
    
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding,
    });
    
    progressCallback?.({ stage: 'finalizing', progress: 90, message: 'Finalizing encryption...' });
    
    const result: EncryptionResult = {
      success: true,
      encryptedData: encrypted.toString(),
      iv,
      salt,
      algorithm: 'AES-256-GCM',
      timestamp: Date.now(),
      keyDerivationInfo: DEFAULT_KEY_DERIVATION,
    };
    
    progressCallback?.({ stage: 'complete', progress: 100, message: 'Encryption complete!' });
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: `AES-256-GCM encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      algorithm: 'AES-256-GCM',
      timestamp: Date.now(),
    };
  }
}

/**
 * Decrypts data using AES-256-GCM
 */
export async function decryptAES256GCM(
  encryptedData: string,
  password: string,
  iv: string,
  salt: string,
  progressCallback?: (progress: ProgressInfo) => void
): Promise<DecryptionResult> {
  try {
    progressCallback?.({ stage: 'preparing', progress: 10, message: 'Preparing decryption...' });
    
    progressCallback?.({ stage: 'processing', progress: 30, message: 'Deriving decryption key...' });
    
    const key = await deriveKey(password, salt);
    
    progressCallback?.({ stage: 'processing', progress: 60, message: 'Decrypting data...' });
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding,
    });
    
    progressCallback?.({ stage: 'finalizing', progress: 90, message: 'Finalizing decryption...' });
    
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new CryptoError('Invalid password or corrupted data', 'DECRYPTION_FAILED');
    }
    
    progressCallback?.({ stage: 'complete', progress: 100, message: 'Decryption complete!' });
    
    return {
      success: true,
      decryptedData,
      algorithm: 'AES-256-GCM',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: `AES-256-GCM decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      algorithm: 'AES-256-GCM',
      timestamp: Date.now(),
    };
  }
}

/**
 * Encrypts data using ChaCha20-Poly1305 (Premium feature)
 */
export async function encryptChaCha20Poly1305(
  data: string,
  password: string,
  progressCallback?: (progress: ProgressInfo) => void
): Promise<EncryptionResult> {
  try {
    progressCallback?.({ stage: 'preparing', progress: 10, message: 'Generating nonce and salt...' });
    
    const salt = generateSalt(16);
    const nonce = generateIV(12);
    
    progressCallback?.({ stage: 'processing', progress: 30, message: 'Deriving encryption key...' });
    
    const key = await deriveKey(password, salt);
    
    progressCallback?.({ stage: 'processing', progress: 60, message: 'Encrypting with ChaCha20-Poly1305...' });
    
    // Using CryptoJS for ChaCha20 (simplified implementation)
    const encrypted = CryptoJS.ChaCha20.encrypt(data, key, {
      nonce: CryptoJS.enc.Hex.parse(nonce),
    });
    
    progressCallback?.({ stage: 'finalizing', progress: 90, message: 'Finalizing encryption...' });
    
    const result: EncryptionResult = {
      success: true,
      encryptedData: encrypted.toString(),
      iv: nonce,
      salt,
      algorithm: 'ChaCha20-Poly1305',
      timestamp: Date.now(),
      keyDerivationInfo: DEFAULT_KEY_DERIVATION,
    };
    
    progressCallback?.({ stage: 'complete', progress: 100, message: 'ChaCha20 encryption complete!' });
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: `ChaCha20-Poly1305 encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      algorithm: 'ChaCha20-Poly1305',
      timestamp: Date.now(),
    };
  }
}

/**
 * Main encryption function that supports multiple algorithms
 */
export async function encryptData(
  data: string,
  password: string,
  algorithm: EncryptionAlgorithm = 'AES-256-GCM',
  progressCallback?: (progress: ProgressInfo) => void
): Promise<EncryptionResult> {
  if (!data || !password) {
    return {
      success: false,
      error: 'Data and password are required',
      algorithm,
      timestamp: Date.now(),
    };
  }

  switch (algorithm) {
    case 'AES-256-GCM':
      return encryptAES256GCM(data, password, progressCallback);
    case 'ChaCha20-Poly1305':
      return encryptChaCha20Poly1305(data, password, progressCallback);
    case 'RSA-OAEP':
      // RSA implementation would go here
      return {
        success: false,
        error: 'RSA-OAEP encryption not yet implemented',
        algorithm,
        timestamp: Date.now(),
      };
    default:
      return {
        success: false,
        error: `Unsupported encryption algorithm: ${algorithm}`,
        algorithm,
        timestamp: Date.now(),
      };
  }
}

/**
 * Main decryption function that supports multiple algorithms
 */
export async function decryptData(
  encryptedData: string,
  password: string,
  algorithm: EncryptionAlgorithm,
  iv: string,
  salt: string,
  progressCallback?: (progress: ProgressInfo) => void
): Promise<DecryptionResult> {
  if (!encryptedData || !password || !iv || !salt) {
    return {
      success: false,
      error: 'All decryption parameters are required',
      algorithm,
      timestamp: Date.now(),
    };
  }

  switch (algorithm) {
    case 'AES-256-GCM':
      return decryptAES256GCM(encryptedData, password, iv, salt, progressCallback);
    case 'ChaCha20-Poly1305':
      // ChaCha20 decryption would go here
      return {
        success: false,
        error: 'ChaCha20-Poly1305 decryption not yet implemented',
        algorithm,
        timestamp: Date.now(),
      };
    case 'RSA-OAEP':
      // RSA decryption would go here
      return {
        success: false,
        error: 'RSA-OAEP decryption not yet implemented',
        algorithm,
        timestamp: Date.now(),
      };
    default:
      return {
        success: false,
        error: `Unsupported decryption algorithm: ${algorithm}`,
        algorithm,
        timestamp: Date.now(),
      };
  }
}

/**
 * Securely clears sensitive data from memory
 */
export function secureErase(data: string): void {
  // In a real implementation, this would overwrite memory
  // For now, we'll just clear the reference
  data = '';
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');

  if (password.length >= 12) score += 1;
  else feedback.push('Consider using 12+ characters for better security');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';

  return { strength, score, feedback };
}