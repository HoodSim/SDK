import { createPublicClient, http } from "viem";
import { HoodSimPayments, robinhoodChainTestnet, uuidToOrderId } from "@hoodsim/sdk";

// Read the on-chain payment record for an order.
const publicClient = createPublicClient({
  chain: robinhoodChainTestnet,
  transport: http(),
});

const payments = new HoodSimPayments({
  address: "0xbF04202285B003a51481E8b8BAb7B39a890198A7", // testnet deployment
  settlementToken: "0x40c7B031E70731e548f8ff35e12AEcC58014277c",
  publicClient,
});

const orderId = uuidToOrderId("3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8");
const payment = await payments.getPayment(orderId);

if (payment.isEmpty) {
  console.log("No payment yet for this order.");
} else {
  console.log(`Paid by ${payment.payer}`);
  console.log(`Amount:  ${payment.amount} base units`);
  console.log(`Refunded: ${payment.refunded}`);
}
