import { createUI } from './ui.js';
import { validateAgePrivateKey } from './types.js';
import type { WorkerMessage, DecryptResult } from './types.js';

class AgeDecryptor {
  private worker: Worker;
  private fileInput!: HTMLInputElement;
  private decryptBtn!: HTMLButtonElement;
  private uploadArea!: HTMLElement;
  private resultArea!: HTMLElement;
  private errorArea!: HTMLElement;
  private downloadLink!: HTMLAnchorElement;
  private passphraseGroup!: HTMLElement;
  private keyGroup!: HTMLElement;
  private passphraseInput!: HTMLInputElement;
  private keyInput!: HTMLTextAreaElement;
  private modeRadios!: NodeListOf<HTMLInputElement>;
  private inputSourceRadios!: NodeListOf<HTMLInputElement>;
  private cipherTextGroup!: HTMLElement;
  private cipherTextInput!: HTMLTextAreaElement;
  private currentFile: File | null = null;
  private btnText!: HTMLElement;
  private showTextPreview!: HTMLInputElement;
  private textPreview!: HTMLElement;
  private textContent!: HTMLElement;
  private copyTextBtn!: HTMLButtonElement;

  constructor() {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    this.setupWorker();
    this.initializeUI();
  }

  private setupWorker() {
    this.worker.onmessage = (e: MessageEvent<DecryptResult>) => {
      const { ok, url, error, textContent } = e.data;
      
      if (ok && url) {
        this.showSuccess(url, textContent);
      } else {
        this.showError(error || 'Unknown error occurred');
      }
      
      this.setButtonState(false, 'Decrypt File');
    };
  }

  private initializeUI() {
    const container = createUI();
    document.body.appendChild(container);

    // Get references to UI elements
    this.fileInput = document.getElementById('fileInput') as HTMLInputElement;
    this.decryptBtn = document.getElementById('decryptBtn') as HTMLButtonElement;
    this.uploadArea = document.getElementById('uploadArea') as HTMLElement;
    this.resultArea = document.getElementById('resultArea') as HTMLElement;
    this.errorArea = document.getElementById('errorArea') as HTMLElement;
    this.downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;
    this.passphraseGroup = document.getElementById('passphraseGroup') as HTMLElement;
    this.keyGroup = document.getElementById('keyGroup') as HTMLElement;
    this.passphraseInput = document.getElementById('passphrase') as HTMLInputElement;
    this.keyInput = document.getElementById('privateKey') as HTMLTextAreaElement;
    this.modeRadios = document.querySelectorAll('input[name="mode"]') as NodeListOf<HTMLInputElement>;
    this.inputSourceRadios = document.querySelectorAll('input[name="inputSource"]') as NodeListOf<HTMLInputElement>;
    this.cipherTextGroup = document.getElementById('cipherTextGroup') as HTMLElement;
    this.cipherTextInput = document.getElementById('cipherText') as HTMLTextAreaElement;
    this.btnText = this.decryptBtn.querySelector('.btn-text') as HTMLElement;
    this.showTextPreview = document.getElementById('showTextPreview') as HTMLInputElement;
    this.textPreview = document.getElementById('textPreview') as HTMLElement;
    this.textContent = document.getElementById('textContent') as HTMLElement;
    this.copyTextBtn = document.getElementById('copyText') as HTMLButtonElement;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // File input
    this.fileInput.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.handleFileSelect(file);
      }
    });

    // Upload area click
    this.uploadArea.addEventListener('click', () => {
      this.fileInput.click();
    });

    // Drag and drop
    this.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadArea.classList.add('drag-over');
    });

    this.uploadArea.addEventListener('dragleave', () => {
      this.uploadArea.classList.remove('drag-over');
    });

    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('drag-over');
      const file = e.dataTransfer?.files[0];
      if (file && file.name.endsWith('.age')) {
        this.handleFileSelect(file);
      }
    });

    // Mode radio buttons
    this.modeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateModeVisibility();
        this.updateDecryptButtonState();
      });
    });

    // Input source toggles
    this.inputSourceRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateInputSourceVisibility();
        this.updateDecryptButtonState();
      });
    });

    // Input validation
    this.passphraseInput.addEventListener('input', () => {
      this.updateDecryptButtonState();
    });

    this.keyInput.addEventListener('input', () => {
      this.handleKeyInput();
    });

    // Paste textarea input
    this.cipherTextInput.addEventListener('input', () => {
      this.updateDecryptButtonState();
    });

    // Decrypt button
    this.decryptBtn.addEventListener('click', () => {
      this.handleDecrypt();
    });

    // Copy text button
    this.copyTextBtn.addEventListener('click', () => {
      this.copyTextToClipboard();
    });
  }

  private handleFileSelect(file: File) {
    this.currentFile = file;
    this.updateUploadArea(file);
    this.updateDecryptButtonState();
  }

  private updateUploadArea(file: File | null) {
    if (file) {
      const fileSize = this.formatFileSize(file.size);
      this.uploadArea.innerHTML = `
        <div class="upload-content">
          <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="
            width: 48px;
            height: 48px;
            color: #28a745;
            margin-bottom: 1rem;
          ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p style="font-size: 1.1rem; color: #495057; margin: 0 0 0.5rem 0; font-weight: 500;">${file.name}</p>
          <small style="font-size: 0.9rem; color: #6c757d; margin: 0;">${fileSize}</small>
          <button id="removeFile" type="button" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
            margin-top: 1rem;
          ">Remove File</button>
        </div>
      `;
      
      // Add remove file listener
      const removeBtn = this.uploadArea.querySelector('#removeFile');
      removeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentFile = null;
        this.fileInput.value = '';
        this.updateUploadArea(null);
        this.updateDecryptButtonState();
      });
    } else {
      this.uploadArea.innerHTML = `
        <div class="upload-content">
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="
            width: 48px;
            height: 48px;
            color: #6c757d;
            margin-bottom: 1rem;
          ">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7,10 12,15 17,10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <p style="font-size: 1.1rem; color: #495057; margin: 0 0 0.5rem 0; font-weight: 500;">Drop your .age file here or click to browse</p>
          <small style="font-size: 0.9rem; color: #6c757d; margin: 0;">Supports files encrypted with passphrases or X25519 keys</small>
        </div>
      `;
    }
  }

  private updateModeVisibility() {
    const selectedMode = (document.querySelector('input[name="mode"]:checked') as HTMLInputElement).value;
    
    if (selectedMode === 'passphrase') {
      this.passphraseGroup.style.display = 'block';
      this.keyGroup.style.display = 'none';
    } else {
      this.passphraseGroup.style.display = 'none';
      this.keyGroup.style.display = 'block';
    }
  }

  private updateInputSourceVisibility() {
    const source = (document.querySelector('input[name="inputSource"]:checked') as HTMLInputElement).value;
    if (source === 'file') {
      this.uploadArea.style.display = 'block';
      this.cipherTextGroup.style.display = 'none';
    } else {
      this.uploadArea.style.display = 'none';
      this.cipherTextGroup.style.display = 'block';
    }
  }

  private handleKeyInput() {
    const keyText = this.keyInput.value;
    const { key, error } = validateAgePrivateKey(keyText);

    if (key) {
      this.keyInput.style.borderColor = '#28a745';
      this.keyInput.setCustomValidity('');
    } else {
      this.keyInput.style.borderColor = '#dc3545';
      this.keyInput.setCustomValidity(error || 'Invalid key');
    }
    this.updateDecryptButtonState();
  }

  private normalizeCipherText(value: string): string {
    const normalizedNewlines = value.replace(/\r\n?/g, '\n');
    const blockRegex = /(-*\s*BEGIN\s+AGE\s+ENCRYPTED\s+FILE-*\s*)([\s\S]*?)(\s*-*\s*END\s+AGE\s+ENCRYPTED\s+FILE-*)/gi;
    return normalizedNewlines.replace(blockRegex, (match: string, header: string, body: string, footer: string) => {
      if (typeof header !== 'string' || typeof body !== 'string' || typeof footer !== 'string') {
        return match;
      }

      const prefixWhitespace = header.match(/^\s*/)?.[0] ?? '';
      const suffixWhitespace = footer.match(/\s*$/)?.[0] ?? '';
      const normalizedBody = this.formatArmorBody(body);

      if (!normalizedBody) {
        return match;
      }

      return `${prefixWhitespace}-----BEGIN AGE ENCRYPTED FILE-----\n${normalizedBody}\n-----END AGE ENCRYPTED FILE-----${suffixWhitespace}`;
    });
  }

  private formatArmorBody(body: string): string {
    const contiguous = body.replace(/[\s\r\n]+/g, '');
    if (contiguous.length === 0) {
      return '';
    }

    const wrappedLines = contiguous.match(/.{1,64}/g) ?? [contiguous];
    return wrappedLines.join('\n');
  }

  private updateDecryptButtonState() {
    const inputSource = (document.querySelector('input[name="inputSource"]:checked') as HTMLInputElement).value;
    const hasFile = this.currentFile !== null;
    const hasCiphertext = this.cipherTextInput.value.trim().length > 0;

    const selectedMode = (document.querySelector('input[name="mode"]:checked') as HTMLInputElement).value;

    let hasValidCreds = false;
    if (selectedMode === 'passphrase') {
      hasValidCreds = this.passphraseInput.value.trim().length > 0;
    } else {
      hasValidCreds = this.keyInput.value.trim().length > 0 && this.keyInput.checkValidity();
    }

    const hasValidSource = inputSource === 'file' ? hasFile : hasCiphertext;
    this.decryptBtn.disabled = !(hasValidSource && hasValidCreds);
  }

  private async handleDecrypt() {
    const inputSource = (document.querySelector('input[name="inputSource"]:checked') as HTMLInputElement).value as 'file'|'paste';
    if (inputSource === 'file' && !this.currentFile) return;

    this.setButtonState(true, 'Decrypting...');
    this.hideMessages();

    const selectedMode = (document.querySelector('input[name="mode"]:checked') as HTMLInputElement).value;
    const passphrase = this.passphraseInput.value;
    const keyText = this.keyInput.value;

    let keyBytes: Uint8Array | undefined;
    if (selectedMode === 'x25519') {
      const { key, error } = validateAgePrivateKey(keyText);
      if (!key) {
        this.showError(error || 'Invalid AGE secret key.');
        this.setButtonState(false, 'Decrypt File');
        return;
      }
      keyBytes = new TextEncoder().encode(key);
    }

    let message: WorkerMessage;
    if (inputSource === 'file') {
      message = {
        inputSource: 'file',
        mode: selectedMode as 'passphrase' | 'x25519',
        file: this.currentFile!, // checked above
        passphrase,
        keyBytes,
        showTextPreview: this.showTextPreview.checked
      };
    } else {
      const normalizedCipherText = this.normalizeCipherText(this.cipherTextInput.value);
      if (normalizedCipherText !== this.cipherTextInput.value) {
        this.cipherTextInput.value = normalizedCipherText;
      }
      message = {
        inputSource: 'paste',
        mode: selectedMode as 'passphrase' | 'x25519',
        cipherText: normalizedCipherText,
        passphrase,
        keyBytes,
        showTextPreview: this.showTextPreview.checked
      };
    }

    console.log('Sending message to worker:', message);
    this.worker.postMessage(message);
  }

  private setButtonState(loading: boolean, text: string) {
    this.btnText.textContent = text;
    this.decryptBtn.disabled = loading;
    if (loading) {
      this.decryptBtn.style.background = '#6c757d';
    } else {
      this.decryptBtn.style.background = '#007bff';
    }
  }

  private showSuccess(url: string, textContent?: string) {
    this.errorArea.style.display = 'none';
    this.resultArea.style.display = 'block';

    if (textContent && this.showTextPreview.checked) {
      // Show text preview
      this.textContent.textContent = textContent;
      this.textPreview.style.display = 'block';
      this.downloadLink.style.display = 'none';
    } else {
      // Show download link
      this.downloadLink.href = url;
      this.downloadLink.style.display = 'inline-block';
      this.textPreview.style.display = 'none';
    }
  }

  private showError(message: string) {
    this.resultArea.style.display = 'none';
    this.errorArea.style.display = 'block';
    const errorText = document.getElementById('errorText');
    if (errorText) {
      errorText.textContent = message;
    }
  }

  private hideMessages() {
    this.resultArea.style.display = 'none';
    this.errorArea.style.display = 'none';
  }

  private async copyTextToClipboard() {
    try {
      await navigator.clipboard.writeText(this.textContent.textContent || '');
      
      // Store original content
      const originalHTML = this.copyTextBtn.innerHTML;
      
      // Show success state
      this.copyTextBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
      this.copyTextBtn.style.background = '#28a745';
      this.copyTextBtn.style.transform = 'scale(0.95)';
      
      // Reset after 2 seconds
      setTimeout(() => {
        this.copyTextBtn.innerHTML = originalHTML;
        this.copyTextBtn.style.background = '#007bff';
        this.copyTextBtn.style.transform = 'scale(1)';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Show error state briefly
      const originalHTML = this.copyTextBtn.innerHTML;
      this.copyTextBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        Failed
      `;
      this.copyTextBtn.style.background = '#dc3545';
      setTimeout(() => {
        this.copyTextBtn.innerHTML = originalHTML;
        this.copyTextBtn.style.background = '#007bff';
      }, 2000);
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AgeDecryptor();
});
