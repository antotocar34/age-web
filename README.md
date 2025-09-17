# AGE Web Decryptor 🚀

A 100% client-side AGE decryption web app that runs entirely in your browser. Decrypt AGE-encrypted files using either a passphrase or X25519 private key without any data leaving your device.

## 🔒 Security & Privacy

- **100% Client-side**: All decryption happens in your browser
- **No Network Calls**: No data is sent to any server
- **Memory Safe**: Uses WebAssembly for cryptographic operations
- **Strict CSP**: Content Security Policy prevents any external requests
- **Offline by Default**: Works without internet connection

## 🚀 Features

- **Passphrase Decryption**: Decrypt files encrypted with a passphrase
- **X25519 Key Decryption**: Decrypt files encrypted with X25519 public keys
- **Drag & Drop**: Easy file upload with drag and drop support
- **Modern UI**: Clean, responsive interface that works on all devices
- **WebAssembly**: Fast, secure cryptographic operations using rage-wasm

## 🌐 Live Demo

Visit the live demo at: [https://yourusername.github.io/age-web/](https://yourusername.github.io/age-web/)

## 🛠️ Local Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/age-web.git
cd age-web
```

2. Install dependencies:
```bash
cd web
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage

1. **Upload a .age file**: Drag and drop or click to select an AGE-encrypted file
2. **Choose decryption method**:
   - **Passphrase**: Enter the passphrase used to encrypt the file
   - **X25519 Private Key**: Paste your private key in AGE-SECRET-KEY-1... format
3. **Decrypt**: Click the "Decrypt File" button
4. **Download**: Once decrypted, download the plaintext file

## �� Technical Details

### Architecture

- **Frontend**: Vite + TypeScript
- **Cryptography**: @kanru/rage-wasm (WebAssembly wrapper of rage)
- **Worker**: Web Worker for non-blocking decryption
- **Hosting**: GitHub Pages

### Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 16+
- Edge 80+

### File Size Limits

- Small files (< 1MB): Instant decryption
- Medium files (1-100MB): May take a few seconds
- Large files (> 100MB): May take longer, consider using the desktop rage tool

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

The app includes integration tests that verify:
- File upload and validation
- Passphrase decryption
- X25519 key decryption
- Error handling
- UI interactions

## 🚀 Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

1. Build the project:
```bash
cd web
npm run build
```

2. Deploy the `dist` directory to your hosting provider

## 🔍 Threat Model

This application is designed for scenarios where:

- You trust the website hosting the application
- You want to decrypt AGE files without installing software
- You need to decrypt files on a shared/public computer
- You want to verify that decryption works before installing tools

**Important**: While the application runs entirely client-side, you should still verify the source code and build process if security is critical.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [rage](https://github.com/str4d/rage) - The Rust implementation of age
- [@kanru/rage-wasm](https://www.npmjs.com/package/@kanru/rage-wasm) - WebAssembly wrapper
- [age-encryption.org](https://age-encryption.org/) - The age encryption format specification

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/age-web/issues) page
2. Create a new issue with detailed information
3. For security issues, please email directly instead of creating a public issue

## 🔄 Changelog

### v1.0.0
- Initial release
- Passphrase decryption support
- X25519 key decryption support
- Modern UI with drag & drop
- WebAssembly integration
- GitHub Pages deployment
