# EncryptDecryptMessages

![Build](https://img.shields.io/github/actions/workflow/status/yourusername/encryptdecryptmessages/ci.yml?branch=main)
![License](https://img.shields.io/github/license/yourusername/encryptdecryptmessages)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

A modern, production-ready web application for encrypting and decrypting messages using multiple algorithms. Built with React, TypeScript, Vite, and Tailwind CSS, this project demonstrates secure message handling, a clean UI/UX, and extensible architecture for both personal and professional use.

---

## 🚀 Features

- **Multiple Encryption Algorithms**: Supports Base64, Caesar cipher, string reversal, and mock AES (with extensible architecture for more).
- **Password-Based Encryption**: Secure your messages with a password (AES mode).
- **Modern UI/UX**: Responsive, accessible, and beautiful interface using Tailwind CSS and custom themes.
- **Message History**: View, copy, and manage your encrypted/decrypted messages.
- **Theme Support**: Light and dark mode with smooth transitions.
- **Progress Feedback**: Visual progress bar for encryption/decryption operations.
- **Validation**: Password strength feedback and input validation.
- **Extensible**: Easily add new algorithms or UI features.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library
- **Tooling**: ESLint, Prettier, Husky, modern VS Code setup

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/encryptdecryptmessages.git
cd encryptdecryptmessages

# Install dependencies
npm install
```

### Development
```bash
# Start the development server
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

### Testing
```bash
npm run test
```

---

## 📂 Project Structure

```
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context providers
│   ├── layouts/            # App layout components
│   ├── utils/              # Crypto and helper utilities
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Tailwind and custom styles
├── public/                 # Static assets
├── package.json            # Project metadata and scripts
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── tsconfig.json           # TypeScript config
└── README.md               # Project documentation
```

---

## 🖼️ Screenshots

> **Add your screenshots here!**
> ![image](https://github.com/user-attachments/assets/2e746a37-686f-4a63-a199-51b08e231abe)
---
> ![image](https://github.com/user-attachments/assets/6c561a03-a313-4269-854f-be203a71503d)
---
> ![image](https://github.com/user-attachments/assets/971d4b5e-46ac-47d2-83c0-c30576a6028e)
---



---

## ⚠️ Problems Faced & Solutions

### 1. **TypeScript & ESLint Errors**
- **Problem:** Type mismatches, missing types, and incorrect context usage caused build failures.
- **Solution:** Refactored all files for strict typing, fixed all context providers/consumers, and updated type definitions.

### 2. **Tailwind CSS Integration**
- **Problem:** Custom color classes (e.g., `primary-500`) and `@apply` rules were not recognized due to misconfigured Tailwind setup.
- **Solution:** Updated `tailwind.config.js` to include a custom `primary` palette and ensured all Tailwind directives were at the top of `index.css`.

### 3. **Vite/PostCSS Build Errors**
- **Problem:** `@import` statements for Google Fonts were placed after Tailwind directives, causing build errors.
- **Solution:** Moved all `@import` statements to the very top of the CSS file as required by Vite/PostCSS.

### 4. **Context & Import Path Issues**
- **Problem:** Incorrect or outdated import paths and context property usage led to runtime errors.
- **Solution:** Audited and fixed all import paths and context usages to match the actual file structure and exported properties.

### 5. **Mock Crypto Implementation**
- **Problem:** For demo purposes, real cryptography was not implemented, but the architecture needed to be extensible and safe for future upgrades.
- **Solution:** Stubbed and strongly typed all crypto utility functions, with clear comments for future replacement with real crypto libraries.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 📬 Contact

For questions or support, open an issue or contact [yourname@domain.com](mailto:yourname@domain.com).

---

## 🤔 FAQ

**Q: Is this app secure for real-world sensitive data?**
> This project uses mock/stubbed crypto for demonstration. For production, integrate a real cryptography library and audit all security aspects.

**Q: How do I add a new encryption algorithm?**
> Add your algorithm to `src/utils/Cryptoutils.tsx` and update the UI in the forms/components as needed.

**Q: Why do I see Tailwind or PostCSS errors?**
> Ensure all `@import` statements are at the top of your CSS and that your Tailwind config matches the docs.

**Q: How do I run tests?**
> Use `npm run test` to run all unit and integration tests.

---

## 🗺️ Roadmap

- [ ] Replace mock crypto with real, audited cryptography
- [ ] Add user authentication and message sharing
- [ ] Export/import message history
- [ ] Add i18n (internationalization) support
- [ ] PWA support for offline use
- [ ] More encryption algorithms (RSA, ChaCha20, etc.)
- [ ] Accessibility improvements

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Contributor Covenant](https://www.contributor-covenant.org/)

---

_This project was built as a demonstration of modern React, TypeScript, and Tailwind CSS best practices._

