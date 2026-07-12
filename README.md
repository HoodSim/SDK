<div align="center">

<img src="./brand/logo.png" alt="HoodSIM" width="120" height="120" />

# @hoodsim/sdk

**A typed toolkit for building on HoodSIM and Robinhood Chain.**
Chains, the payments contract, and order helpers — powered by [viem](https://viem.sh).

[![npm](https://img.shields.io/badge/npm-%40hoodsim%2Fsdk-C6F23A?style=flat-square)](https://www.npmjs.com/package/@hoodsim/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-C6F23A.svg?style=flat-square)](./LICENSE)
[![Types](https://img.shields.io/badge/types-included-black?style=flat-square)](#)
[![Tests](https://img.shields.io/badge/tests-13%20passing-C6F23A?style=flat-square)](./test)
[![viem](https://img.shields.io/badge/peer-viem%20%5E2-black?style=flat-square)](https://viem.sh)

[Website](https://hoodsim.cc) · [Docs](https://github.com/HoodSim/HoodSIM/tree/main/docs) · [X](https://x.com/hoodsimcc) · [Telegram](https://t.me/HoodSIM)

</div>

---

## Install

```bash
npm install @hoodsim/sdk viem
```

`viem` is a peer dependency.

## Quick start

```ts
import { createPublicClient, http } from "viem";
import { HoodSimPayments, robinhoodChain, uuidToOrderId } from "@hoodsim/sdk";

const publicClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(),
});

const payments = new HoodSimPayments({
  address: "0x…",
  settlementToken: "0x…",
  publicClient,
});

const orderId = uuidToOrderId("3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8");
const payment = await payments.getPayment(orderId);
// { payer, amount, refunded, isEmpty }
```

## What's inside

### Chains
`robinhoodChain` and `robinhoodChainTestnet` as ready-to-use viem `Chain` objects, plus canonical `tokens` (USDG, WETH).

### Order ids
Order ids are UUIDs off-chain and `bytes32` on-chain. The mapping is lossless and idempotent:

```ts
import { uuidToOrderId, orderIdToUuid, isOrderId } from "@hoodsim/sdk";

const id = uuidToOrderId("3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8");
orderIdToUuid(id); // "3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8"
```

### Amounts & quotes
```ts
import {
  usdToSettlementAmount,
  settlementAmountToUsd,
  quoteSecondsLeft,
  isQuoteExpired,
} from "@hoodsim/sdk";

usdToSettlementAmount("18.99"); // 18990000n (6dp)
quoteSecondsLeft(lockedAtMs);   // counts down from 300s
```

### Payments contract
```ts
const payments = new HoodSimPayments({ address, settlementToken, publicClient, walletClient });

await payments.getPayment(orderId);        // read the payment record
await payments.paused();                    // is the contract paused?
const unwatch = payments.watchOrderPaid(fn);// stream OrderPaid events
await payments.approveAndPay(orderId, amt); // approve + payOrder (needs a wallet)
```

## Examples

- [`examples/read-order-status.ts`](./examples/read-order-status.ts) — read a payment record
- [`examples/watch-orders.ts`](./examples/watch-orders.ts) — stream `OrderPaid` events
- [`examples/pay-order.ts`](./examples/pay-order.ts) — approve and pay from a browser wallet

## API

| Export | |
|---|---|
| `robinhoodChain`, `robinhoodChainTestnet` | viem `Chain` objects |
| `tokens` | canonical token addresses |
| `hoodSimPaymentsAbi` | the contract ABI (`as const`) |
| `uuidToOrderId`, `orderIdToUuid`, `isOrderId` | order id ↔ uuid |
| `usdToSettlementAmount`, `settlementAmountToUsd` | amount conversion |
| `quoteSecondsLeft`, `isQuoteExpired` | 5-minute quote lock |
| `HoodSimPayments` | typed contract client |

## Develop

```bash
npm install
npm test          # vitest
npm run build     # tsup → ESM + CJS + d.ts
```

## License

[MIT](./LICENSE) © 2026 HoodSIM

---

<div align="center">

_HoodSIM is an independent project built on Robinhood Chain._
_Not affiliated with, endorsed by, or sponsored by Robinhood Markets, Inc._

</div>
