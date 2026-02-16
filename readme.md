<div align="center">
  <h1>🩺 env-rx</h1>
  <p>Keep your <code>.env</code> and <code>.env.example</code> perfectly in sync. Zero config. CI-ready.</p>
</div>

## The Problem

We've all been there: a teammate adds a new `STRIPE_API_KEY` to their local `.env`, forgets to update `.env.example`, and pushes the code. The next day, the CI pipeline breaks, or a new developer spends hours figuring out why the app crashes on boot.


## The Solution

**env-rx** is a lightning-fast CLI tool that analyzes your environment files, finds missing variables, and interactively fixes them for you.


```bash
npx env-rx
```

<div align="center">
  <img src="assets/demo.gif" alt="env-rx demo" width="600" />
</div>

## ✨ Features

- **Interactive Autofix:** Detects missing keys and offers to safely append them to your files.
- **Zero Configuration:** Works out of the box. Just run it in your project root.
- **CI/CD Ready:** Use the `--ci` flag to automatically fail builds if files are out of sync.
- **Blazing Fast:** Ships as a single dependency-free bundle. Starts in milliseconds.
- **Run Anywhere (Any OS, Any Hardware):** Whether it's a modern M-series Mac, a Windows machine, or a legacy CI server running Node.js 14+ — it just works flawlessly.

## 🚀 Quick Start

You don't even need to install it. Just run it via `npx` in any Node.js project:

```bash
npx env-rx
```

Or install it as a dev dependency to use it in your scripts:

```bash
npm install -D env-rx
```

## 🛠 Usage & Commands

By default, `env-rx` looks for `.env` and `.env.example` in your current directory.

```bash
# Standard interactive check
npx env-rx

# Use custom paths (perfect for monorepos or custom setups)
npx env-rx --env ./config/.env.local --example ./config/.env.template

# Run in CI mode (Disables prompts, fails with exit code 1 if mismatch found)
npx env-rx --ci
```

## 🤖 CI/CD Integration

`env-rx` shines when added to your automated workflows. Protect your `main` branch from undocumented environment variables.

### GitHub Actions
Add this step to your PR validation workflow:

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'
  
  - name: Check Environment Variables Sync
    run: npx env-rx --ci
```

### Husky (Pre-commit hook)
Prevent commits if `.env.example` is outdated:

```bash
npx husky add .husky/pre-commit "npx env-rx --ci"
```

## 📝 License

MIT © xserio