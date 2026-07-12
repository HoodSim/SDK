import { formatUnits, parseUnits } from "viem";

/** USDC/USDG-class stablecoins settle in 6 decimals. */
export const SETTLEMENT_DECIMALS = 6;

/** Quotes lock for five minutes (see the payments flow). */
export const QUOTE_TTL_SECONDS = 300;

/** USD price (e.g. 18.99) → settlement base units (bigint). */
export function usdToSettlementAmount(
  usd: number | string,
  decimals: number = SETTLEMENT_DECIMALS,
): bigint {
  return parseUnits(String(usd), decimals);
}

/** Settlement base units → a fixed-2 USD string. */
export function settlementAmountToUsd(
  amount: bigint,
  decimals: number = SETTLEMENT_DECIMALS,
): string {
  return Number(formatUnits(amount, decimals)).toFixed(2);
}

/** Seconds remaining on a quote given its lock time (ms epoch). */
export function quoteSecondsLeft(
  lockedAtMs: number,
  nowMs: number = Date.now(),
): number {
  const elapsed = Math.floor((nowMs - lockedAtMs) / 1000);
  return Math.max(0, QUOTE_TTL_SECONDS - elapsed);
}

/** True once a quote has passed its five-minute lock. */
export function isQuoteExpired(lockedAtMs: number, nowMs = Date.now()): boolean {
  return quoteSecondsLeft(lockedAtMs, nowMs) <= 0;
}
