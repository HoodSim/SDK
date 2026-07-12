import { createPublicClient, createWalletClient, custom, http } from "viem";
import {
  HoodSimPayments,
  robinhoodChain,
  uuidToOrderId,
  usdToSettlementAmount,
} from "@hoodsim/sdk";

// Approve (if needed) and pay for a quoted order from a browser wallet.
// Note: any-token → stablecoin routing (0x) happens before this call; the
// contract only ever receives the settlement stablecoin.
const publicClient = createPublicClient({ chain: robinhoodChain, transport: http() });
const walletClient = createWalletClient({
  chain: robinhoodChain,
  transport: custom((window as any).ethereum),
});
const [account] = await walletClient.requestAddresses();

const payments = new HoodSimPayments({
  address: "0x…", // mainnet deployment
  settlementToken: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168", // USDG
  publicClient,
  walletClient: { ...walletClient, account } as never,
});

const orderId = uuidToOrderId("3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8");
const amount = usdToSettlementAmount("18.99");
const hash = await payments.approveAndPay(orderId, amount);
console.log(`payOrder submitted: ${hash}`);
