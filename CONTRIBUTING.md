# Contributing to @hoodsim/sdk

Thanks for helping build the HoodSIM SDK.

## Setup

```bash
git clone https://github.com/HoodSim/SDK
cd SDK
npm install
npm test          # vitest
npm run build     # tsup → dist (ESM + CJS + d.ts)
```

## Guidelines

- Keep the public surface small and typed. Every export is documented in the README.
- Pure helpers (order ids, formatting) must have unit tests.
- `viem` is a **peer dependency** — never bundle it.
- Run `npm run typecheck && npm test && npm run build` before opening a PR.

By contributing you agree your work is licensed under the [MIT License](./LICENSE).
