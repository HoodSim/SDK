/**
 * @hoodsim/sdk — a typed toolkit for building on HoodSIM and Robinhood Chain.
 *
 * @example
 * ```ts
 * import { createPublicClient, http } from "viem";
 * import { HoodSimPayments, robinhoodChain, uuidToOrderId } from "@hoodsim/sdk";
 *
 * const publicClient = createPublicClient({
 *   chain: robinhoodChain,
 *   transport: http(),
 * });
 *
 * const payments = new HoodSimPayments({
 *   address: "0x…",
 *   settlementToken: "0x…",
 *   publicClient,
 * });
 *
 * const orderId = uuidToOrderId("3f1a…-…");
 * const payment = await payments.getPayment(orderId);
 * ```
 */

export { robinhoodChain, robinhoodChainTestnet, tokens } from "./chains.js";
export { hoodSimPaymentsAbi } from "./abi.js";
export { uuidToOrderId, orderIdToUuid, isOrderId } from "./order-id.js";
export {
  SETTLEMENT_DECIMALS,
  QUOTE_TTL_SECONDS,
  usdToSettlementAmount,
  settlementAmountToUsd,
  quoteSecondsLeft,
  isQuoteExpired,
} from "./format.js";
export { HoodSimPayments } from "./payments.js";
export type { Payment, OrderPaidEvent } from "./payments.js";
