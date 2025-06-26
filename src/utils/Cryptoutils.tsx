// Remove unused or incorrect import
// import { EncryptionMethod } from '../types';
import type { EncryptionAlgorithm, ProgressInfo } from '../types/index';

// Define EncryptionMethod type here for compatibility
export type EncryptionMethod = 'base64' | 'caesar' | 'reverse' | 'aes';

/**
 * Simple Base64 encoding
 */
const encodeBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

/**
 * Simple Base64 decoding
 */
const decodeBase64 = (str: string): string => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    throw new Error('Invalid Base64 string');
  }
};

/**
 * Caesar cipher encryption (shift characters by 3)
 */
const caesarCipher = (str: string, decode = false): string => {
  const shift = decode ? -3 : 3;
  return str
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      
      // Uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
      }
      
      // Lowercase letters
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
      }
      
      // Non-alphabetic characters remain unchanged
      return char;
    })
    .join('');
};

/**
 * Simple string reversal
 */
const reverseString = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * Mock AES encryption (in a real app you would use a proper crypto library)
 * For demo purposes, we're using a simple XOR with password
 */
const mockAES = (str: string, password: string, decode = false): string => {
  if (!password) {
    throw new Error('Password is required for AES encryption');
  }
  
  // Create a simple key from password
  let key = 0;
  for (let i = 0; i < password.length; i++) {
    key += password.charCodeAt(i);
  }
  
  // For simplicity, we'll just do base64 + a marker to simulate encryption
  const processed = decode
    ? decodeBase64(str.replace('AES:', ''))
    : 'AES:' + encodeBase64(str);
  
  return processed;
};

/**
 * Encrypt a message using the specified method
 */
export const encryptMessage = (
  message: string,
  method: EncryptionMethod,
  password: string = ''
): string => {
  switch (method) {
    case 'base64':
      return encodeBase64(message);
    case 'caesar':
      return caesarCipher(message, false);
    case 'reverse':
      return reverseString(message);
    case 'aes':
      return mockAES(message, password, false);
    default:
      return message;
  }
};

/**
 * Decrypt a message using the specified method
 */
export const decryptMessage = (
  encryptedMessage: string,
  method: EncryptionMethod,
  password: string = ''
): string => {
  switch (method) {
    case 'base64':
      return decodeBase64(encryptedMessage);
    case 'caesar':
      return caesarCipher(encryptedMessage, true);
    case 'reverse':
      return reverseString(encryptedMessage);
    case 'aes':
      return mockAES(encryptedMessage, password, true);
    default:
      return encryptedMessage;
  }
};

// Strongly type and mock the crypto/validation exports for compatibility

export interface EncryptResult {
  success: boolean;
  encryptedData?: string;
  algorithm?: EncryptionAlgorithm;
  iv?: string;
  salt?: string;
  keyDerivationInfo?: string;
  timestamp?: number;
  error?: string;
}

export const encryptData = async (
  message: string,
  password: string,
  algorithm: EncryptionAlgorithm,
  onProgress?: (progress: ProgressInfo) => void
): Promise<EncryptResult> => {
  // Mock implementation
  if (!message || !password) {
    return { success: false, error: 'Missing message or password' };
  }
  if (onProgress) onProgress({ percent: 100, message: 'Done' });
  return {
    success: true,
    encryptedData: btoa(message),
    algorithm,
    iv: 'mock-iv',
    salt: 'mock-salt',
    keyDerivationInfo: 'mock-kdf',
    timestamp: Date.now(),
  };
};

export const validatePasswordStrength = (password: string) => {
  if (!password) return { strength: 'weak', feedback: ['Password required'] };
  if (password.length < 8) return { strength: 'weak', feedback: ['Too short'] };
  return { strength: 'strong', feedback: [] };
};

export const ALGORITHM_CONFIGS: Record<EncryptionAlgorithm, { name: string; description: string; keySize: number; isPremium: boolean }> = {
  'AES-256-GCM': { name: 'AES-256-GCM', description: 'Advanced Encryption Standard', keySize: 256, isPremium: false },
  'ChaCha20-Poly1305': { name: 'ChaCha20-Poly1305', description: 'Modern stream cipher', keySize: 256, isPremium: true },
  'RSA': { name: 'RSA', description: 'Asymmetric encryption', keySize: 2048, isPremium: true },
};

// Stub for decryptData to avoid import error
export const decryptData = async (
  data: string,
  _password: string,
  _algorithm: string,
  _iv: string,
  _salt: string,
  onProgress?: (progress: { percent: number; message?: string; stage?: string }) => void
) => {
  if (onProgress) onProgress({ percent: 100, message: 'Done', stage: 'complete' });
  return { success: true, decryptedData: atob(data) };
};