export type DecryptOptions =
  | { kind: 'passphrase'; passphrase: string }
  | { kind: 'x25519'; keyBytes: Uint8Array };

export interface RageWasm {
  init(): Promise<void>;
  decryptBytes(cipher: Uint8Array, opts: DecryptOptions): Promise<Uint8Array>;
  decryptStream?(
    readable: ReadableStream<Uint8Array>,
    opts: DecryptOptions
  ): Promise<ReadableStream<Uint8Array>>;
}

export type InputSource = 'file' | 'paste';

export type WorkerMessage =
  | {
      inputSource: 'file';
      file: File;
      mode: 'passphrase' | 'x25519';
      passphrase: string;
      keyBytes?: Uint8Array;
      showTextPreview: boolean;
    }
  | {
      inputSource: 'paste';
      cipherText: string; // ASCII-armored or raw text
      mode: 'passphrase' | 'x25519';
      passphrase: string;
      keyBytes?: Uint8Array;
      showTextPreview: boolean;
    };

export interface DecryptResult {
  ok: boolean;
  url?: string;
  error?: string;
  textContent?: string;
}

export function validateAgePrivateKey(keyText: string): { key?: string; error?: string } {
  const lines = keyText.split('\n');
  const keyLine = lines.map(line => line.trim())
                       .filter(line => line.length > 0 && !line.startsWith('#'))
                       .find(line => line.startsWith('AGE-SECRET-KEY-1'));

  if (keyLine) {
    return { key: keyLine };
  }
  return { error: 'Invalid AGE secret key format. Please use AGE-SECRET-KEY-1 format.' };
}
