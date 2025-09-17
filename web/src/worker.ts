import { getWasm } from './crypto.js';
import type { DecryptOptions, WorkerMessage, DecryptResult } from './types.js';

function isTextFile(data: Uint8Array): boolean {
  // Check if the data is valid UTF-8 text
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(data);
    // Check if it contains only printable characters and common whitespace
    // Allow some control characters like newlines, tabs, etc.
    return /^[\x20-\x7E\s\n\r\t\f\v]*$/.test(text);
  } catch {
    return false;
  }
}

function isSmallFile(data: Uint8Array, maxSize: number = 1024 * 1024): boolean {
  return data.length <= maxSize;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  console.log('Worker received message:', e.data);
  console.log('Message type:', typeof e.data);
  console.log('Message keys:', Object.keys(e.data));
  
  const { mode, file, passphrase, keyBytes, showTextPreview } = e.data;
  console.log('Destructured values:', { mode, file: file?.name, passphrase: passphrase ? '[REDACTED]' : undefined, keyBytes: keyBytes?.length, showTextPreview });
  
  try {
    console.log('Getting WASM module...');
    const wasmPromise = getWasm();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('WASM loading timeout after 10 seconds')), 10000)
    );
    const wasm = await Promise.race([wasmPromise, timeoutPromise]) as any;
    console.log('WASM module loaded successfully');
    
    const opts: DecryptOptions =
      mode === 'passphrase'
        ? { kind: 'passphrase', passphrase }
        : { kind: 'x25519', keyBytes: new Uint8Array(keyBytes!) };

    console.log('Decrypting file...');
    // Decrypt the file
    const u8 = new Uint8Array(await file.arrayBuffer());
    const decrypted = await wasm.decryptBytes(u8, opts);
    
    console.log('Decrypted data length:', decrypted.length);
    console.log('Show text preview:', showTextPreview);
    console.log('Is small file:', isSmallFile(decrypted));
    console.log('Is text file:', isTextFile(decrypted));
    
    // Check if we should show text preview
    let textContent: string | undefined;
    if (showTextPreview && isSmallFile(decrypted) && isTextFile(decrypted)) {
      textContent = new TextDecoder('utf-8').decode(decrypted);
      console.log('Text content preview:', textContent.substring(0, 100) + '...');
    }
    
    // Create blob and URL for download
    const decryptedBlob = new Blob([decrypted]);
    const url = URL.createObjectURL(decryptedBlob);
    
    const result: DecryptResult = {
      ok: true,
      url,
      textContent
    };
    
    console.log('Sending result:', result);
    self.postMessage(result);
  } catch (err: any) {
    console.error('Worker error:', err);
    const result: DecryptResult = {
      ok: false,
      error: err.message || String(err)
    };
    self.postMessage(result);
  }
};
