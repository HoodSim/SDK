import { describe, it, expect } from "vitest";
import {
  usdToSettlementAmount,
  settlementAmountToUsd,
  quoteSecondsLeft,
  isQuoteExpired,
  QUOTE_TTL_SECONDS,
} from "../src/format.js";

describe("settlement amounts", () => {
  it("converts USD to 6-decimal base units", () => {
    expect(usdToSettlementAmount("18.99")).toBe(18_990_000n);
    expect(usdToSettlementAmount(5)).toBe(5_000_000n);
  });

  it("round-trips to a fixed-2 USD string", () => {
    expect(settlementAmountToUsd(18_990_000n)).toBe("18.99");
    expect(settlementAmountToUsd(usdToSettlementAmount("34.99"))).toBe("34.99");
  });
});

describe("quote lock (5 minutes)", () => {
  const now = 1_000_000_000_000;

  it("counts down from the ttl", () => {
    expect(quoteSecondsLeft(now, now)).toBe(QUOTE_TTL_SECONDS);
    expect(quoteSecondsLeft(now, now + 60_000)).toBe(QUOTE_TTL_SECONDS - 60);
  });

  it("floors at zero and reports expiry", () => {
    expect(quoteSecondsLeft(now, now + 10 * 60_000)).toBe(0);
    expect(isQuoteExpired(now, now + 4 * 60_000)).toBe(false);
    expect(isQuoteExpired(now, now + 6 * 60_000)).toBe(true);
  });
});
