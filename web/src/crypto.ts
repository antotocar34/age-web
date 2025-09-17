import * as rageWasm from '@kanru/rage-wasm';
import type { RageWasm, DecryptOptions } from './types.js';

let _wasm: RageWasm | null = null;

export async function getWasm(): Promise<RageWasm> {
  if (_wasm) return _wasm;
  
  console.log('Initializing WASM module...');
  // Initialize the WASM module
  const keygenPromise = rageWasm.keygen(); // This triggers WASM loading
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('WASM keygen timeout after 15 seconds')), 15000)
  );
  await Promise.race([keygenPromise, timeoutPromise]);
  console.log('WASM keygen completed');
  
  _wasm = {
    async init() {
      // WASM is already loaded by the keygen call above
      console.log('Rage WASM initialized');
    },
    
    async decryptBytes(cipher: Uint8Array, opts: DecryptOptions): Promise<Uint8Array> {
      if (opts.kind === 'passphrase') {
        return await rageWasm.decrypt_with_user_passphrase(opts.passphrase, cipher);
      } else {
        // Parse the X25519 key string
        const keyString = parseX25519Key(opts.keyBytes);
        return await rageWasm.decrypt_with_x25519(keyString, cipher);
      }
    },
    
    // Streaming not available in this WASM wrapper
    async decryptStream() {
      throw new Error('Streaming not supported by this WASM wrapper');
    }
  };
  
  await _wasm.init();
  return _wasm;
}

function parseX25519Key(keyBytes: Uint8Array): string {
  const keyText = new TextDecoder().decode(keyBytes).trim();
  
  // Split into lines and filter out comments and empty lines
  const lines = keyText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));
  
  // Look for AGE-SECRET-KEY-1 line
  const keyLine = lines.find(line => line.startsWith('AGE-SECRET-KEY-1'));
  
  if (keyLine) {
    return keyLine;
  }
  
  // If no AGE-SECRET-KEY-1 found, check if the entire text is a key
  if (keyText.startsWith('AGE-SECRET-KEY-1')) {
    return keyText;
  }
  
  // Check if it's PEM format
  if (keyText.includes('-----BEGIN') && keyText.includes('-----END')) {
    // For now, we'll just return the text as-is
    // In a real implementation, we'd need to parse PEM and convert to AGE format
    throw new Error('PEM format keys are not yet supported. Please use AGE-SECRET-KEY-1 format.');
  }
  
  // If it doesn't match known formats, assume it's raw key data
  // and try to use it directly
  return keyText;
}
