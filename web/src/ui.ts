export function createUI() {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="
      background: #f8f9fa;
      min-height: 100vh;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    ">
      <header style="text-align: center; margin-bottom: 3rem;">
        <h1 style="
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        ">🔓 AGE Decryptor</h1>
        <p style="font-size: 1.1rem; color: #666; margin: 0;">Decrypt AGE-encrypted files securely in your browser</p>
      </header>
      
      <main style="
        background: white;
        border-radius: 12px;
        padding: 2.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #e9ecef;
      ">
        <!-- Upload Area -->
        <div class="upload-area" id="uploadArea" style="
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          margin-bottom: 2rem;
          background: #fafbfc;
          transition: all 0.2s ease;
        ">
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
            <p style="
              font-size: 1.1rem;
              color: #495057;
              margin: 0 0 0.5rem 0;
              font-weight: 500;
            ">Drop your .age file here or click to browse</p>
            <small style="
              font-size: 0.9rem;
              color: #6c757d;
              margin: 0;
            ">Supports files encrypted with passphrases or X25519 keys</small>
            <input type="file" id="fileInput" accept=".age" style="display: none;">
          </div>
        </div>
        
        <!-- Decrypt Options -->
        <div class="decrypt-options">
          <!-- Mode Selection -->
          <div class="option-group" style="
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          ">
            <label style="
              display: flex;
              align-items: center;
              gap: 0.5rem;
              cursor: pointer;
              font-weight: 500;
              color: #495057;
              padding: 0.75rem 1rem;
              border-radius: 6px;
              flex: 1;
              justify-content: center;
              font-size: 0.95rem;
              background: white;
              border: 1px solid #dee2e6;
            ">
              <input type="radio" name="mode" value="passphrase" checked style="
                width: 16px;
                height: 16px;
                accent-color: #007bff;
              ">
              <span>Passphrase</span>
            </label>
            <label style="
              display: flex;
              align-items: center;
              gap: 0.5rem;
              cursor: pointer;
              font-weight: 500;
              color: #495057;
              padding: 0.75rem 1rem;
              border-radius: 6px;
              flex: 1;
              justify-content: center;
              font-size: 0.95rem;
              background: white;
              border: 1px solid #dee2e6;
            ">
              <input type="radio" name="mode" value="x25519" style="
                width: 16px;
                height: 16px;
                accent-color: #007bff;
              ">
              <span>Age Private Key</span>
            </label>
          </div>
          
          <!-- Passphrase Input -->
          <div class="input-group" id="passphraseGroup" style="margin-bottom: 2rem;">
            <label for="passphrase" style="
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 600;
              color: #495057;
              font-size: 1rem;
            ">Passphrase:</label>
            <input type="password" id="passphrase" placeholder="Enter the passphrase used to encrypt the file" style="
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #ced4da;
              border-radius: 6px;
              font-size: 1rem;
              background: white;
              box-sizing: border-box;
            ">
            <small style="
              display: block;
              margin-top: 0.5rem;
              color: #6c757d;
              font-size: 0.85rem;
            ">Enter the same passphrase that was used to encrypt the file</small>
          </div>
          
          <!-- Private Key Input -->
          <div class="input-group" id="keyGroup" style="display: none; margin-bottom: 2rem;">
            <label for="privateKey" style="
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 600;
              color: #495057;
              font-size: 1rem;
            ">Private Key:</label>
            <textarea id="privateKey" placeholder="Paste your AGE private key here (comments will be automatically removed)" style="
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #ced4da;
              border-radius: 6px;
              font-size: 0.9rem;
              background: white;
              min-height: 100px;
              font-family: 'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              line-height: 1.4;
              box-sizing: border-box;
              resize: vertical;
            "></textarea>
            <small style="
              display: block;
              margin-top: 0.5rem;
              color: #6c757d;
              font-size: 0.85rem;
            ">Paste your private key in AGE-SECRET-KEY-1... format. Comments will be automatically removed.</small>
            
            <div class="key-format-example" style="
              margin-top: 1rem;
              padding: 1rem;
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              border-radius: 6px;
              font-size: 0.85rem;
            ">
              <strong style="color: #495057; display: block; margin-bottom: 0.5rem;">Example format:</strong>
              <pre style="
                background: #e9ecef;
                padding: 0.75rem;
                border-radius: 4px;
                font-family: 'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.75rem;
                line-height: 1.4;
                margin: 0;
                overflow-x: auto;
                color: #495057;
              "># created: 2025-09-17T21:53:15+01:00
# public key: age1rcjvx76apckral0teuveyw4q67ad0vj6ygsksqhlfgqhxj4x692s0pturs
AGE-SECRET-KEY-1JTL3FX407H4SJL66A0YAX8J26V6G0EE5HA83JRQVNDVW0K9JCSWSAQ3ER6</pre>
            </div>
          </div>
          
          <!-- Output Options -->
          <div class="output-options" style="margin-bottom: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #495057; font-size: 1rem;">Output Options:</label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem; color: #495057;">
              <input type="checkbox" id="showTextPreview" checked style="width: 16px; height: 16px; accent-color: #007bff;">
              <span>Show text preview for small files (default for text files under 1MB)</span>
            </label>
            <small style="display: block; margin-top: 0.5rem; color: #6c757d; font-size: 0.85rem;">
              If the decrypted file is small and contains valid UTF-8 text, it will be displayed in the browser instead of downloaded.
            </small>
          </div>
          
          <!-- Decrypt Button -->
          <button id="decryptBtn" disabled style="
            width: 100%;
            background: #007bff;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 6px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 2rem;
            transition: background-color 0.2s ease;
          ">
            <span class="btn-text">Decrypt File</span>
          </button>
        </div>
        
        <!-- Result Area -->
        <div class="result-area" id="resultArea" style="
          display: none;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          background: #d4edda;
          border: 1px solid #c3e6cb;
        ">
          <div class="success-message" style="display: flex; align-items: flex-start; gap: 1rem;">
            <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="
              width: 20px;
              height: 20px;
              color: #28a745;
              flex-shrink: 0;
              margin-top: 0.2rem;
            ">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
            <div style="flex: 1;">
              <p style="
                margin: 0 0 1rem 0;
                font-weight: 600;
                font-size: 1rem;
                color: #155724;
              ">File decrypted successfully!</p>
              
              <!-- Text Preview -->
              <div id="textPreview" style="
                display: none;
                margin-bottom: 1rem;
                padding: 1rem;
                background: white;
                border: 1px solid #c3e6cb;
                border-radius: 6px;
                max-height: 300px;
                overflow-y: auto;
              ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="color: #495057; font-size: 0.9rem;">Text Preview:</strong>
                  <button id="copyText" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    transition: all 0.2s ease;
                  ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy Text
                  </button>
                </div>
                <pre id="textContent" style="
                  margin: 0;
                  font-family: 'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                  font-size: 0.85rem;
                  line-height: 1.4;
                  color: #495057;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                "></pre>
              </div>
              
              <!-- Download Link -->
              <a id="downloadLink" class="download-btn" style="
                display: none;
                background: #28a745;
                color: white;
                text-decoration: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 600;
                font-size: 0.9rem;
                transition: background-color 0.2s ease;
              ">Download Decrypted File</a>
            </div>
          </div>
        </div>
        
        <!-- Error Area -->
        <div class="error-area" id="errorArea" style="
          display: none;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
        ">
          <div class="error-message" style="display: flex; align-items: flex-start; gap: 1rem;">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="
              width: 20px;
              height: 20px;
              color: #dc3545;
              flex-shrink: 0;
              margin-top: 0.2rem;
            ">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <div>
              <p id="errorText" style="
                margin: 0 0 0.5rem 0;
                font-weight: 600;
                font-size: 1rem;
                color: #721c24;
              ">Decryption failed</p>
              <small style="
                color: #6c757d;
                font-size: 0.85rem;
                margin: 0;
              ">Please check your passphrase or private key and try again</small>
            </div>
          </div>
        </div>
      </main>
      
      <footer style="
        text-align: center;
        margin-top: 3rem;
        color: #6c757d;
      ">
        <p style="
          font-size: 0.9rem;
          margin: 0.5rem 0;
        ">All decryption happens in your browser. No data is sent to any server.</p>
        <p style="
          font-size: 0.9rem;
          margin: 0.5rem 0;
        ">Built with WebAssembly and modern web technologies</p>
      </footer>
    </div>
  `;
  
  return container;
}
