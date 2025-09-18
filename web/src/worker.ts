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

function isSmallFile(data: Uint8Array, maxSize: number = 100 * 1024): boolean {
  return data.length <= maxSize;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  try {
    const wasm = await Promise.race([
      getWasm(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('WASM loading timeout after 10 seconds')), 10000))
    ]) as any;

    const { mode, passphrase, keyBytes, showTextPreview } = e.data;
    const opts: DecryptOptions =
      mode === 'passphrase'
        ? { kind: 'passphrase', passphrase }
        : { kind: 'x25519', keyBytes: new Uint8Array(keyBytes!) };

    let cipherU8: Uint8Array;
    if (e.data.inputSource === 'file') {
      cipherU8 = new Uint8Array(await e.data.file.arrayBuffer());
    } else {
      // Treat as UTF-8 text; AGE ASCII armor is text. If users paste binary, this won't work (documented).
      cipherU8 = new TextEncoder().encode(e.data.cipherText);
    }

    const decrypted = await wasm.decryptBytes(cipherU8, opts);

    let textContent: string | undefined;
    if (showTextPreview && isSmallFile(decrypted) && isTextFile(decrypted)) {
      textContent = new TextDecoder('utf-8').decode(decrypted);
    }

    const url = URL.createObjectURL(new Blob([decrypted]));
    self.postMessage({ ok: true, url, textContent } satisfies DecryptResult);
  } catch (err: any) {
    self.postMessage({ ok: false, error: err?.message || String(err) } satisfies DecryptResult);
  }
};
