export type EncryptionMethod = 'base64' | 'caesar' | 'reverse' | 'aes';

export interface Message {
  original: string;
  transformed: string;
  type: 'encrypt' | 'decrypt';
  method: EncryptionMethod;
  timestamp: string;
}

export { };