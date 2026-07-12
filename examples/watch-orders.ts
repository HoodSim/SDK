import { createPublicClient, http } from "viem";
import { HoodSimPayments, robinhoodChainTestnet, orderIdToUuid } from "@hoodsim/sdk";

// Stream OrderPaid events — the backend fulfills against exactly this signal.
const publicClient = createPublicClient({
  chain: robinhoodChainTestnet,
  transport: http(),
});

const payments = new HoodSimPayments({
  address: "0xbF04202285B003a51481E8b8BAb7B39a890198A7",
  settlementToken: "0x40c7B031E70731e548f8ff35e12AEcC58014277c",
  publicClient,
});

const unwatch = payments.watchOrderPaid((event) => {
  console.log(`Order ${orderIdToUuid(event.orderId)} paid`);
  console.log(`  by ${event.payer} · tx ${event.transactionHash}`);
});

// unwatch() when you're done.
process.on("SIGINT", () => {
  unwatch();
  process.exit(0);
});
