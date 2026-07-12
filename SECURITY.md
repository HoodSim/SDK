# Security Policy

## Reporting a vulnerability

Please report security issues **privately** — do not open a public issue or PR.

- **Email:** team@hoodsim.cc

Include a clear description, reproduction steps, and the impact. We aim to acknowledge within 72 hours and will keep you updated through resolution. Responsible disclosure is appreciated; please give us reasonable time to ship a fix before any public write-up.

## Supported

The `main` branch and the latest tagged release.

## Scope

| In scope | Out of scope |
|---|---|
| `HoodSIMPayments.sol` + scripts | Third-party RPC / infra providers |
| Order service + webhooks | The fulfillment partner's systems |
| The frontend app | Wallet software, social engineering, physical access |

Funds safety is the priority: anything affecting the payment or refund path is treated as critical.
