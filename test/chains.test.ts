import { describe, it, expect } from "vitest";
import { robinhoodChain, robinhoodChainTestnet, tokens } from "../src/chains.js";

describe("chains", () => {
  it("pins mainnet parameters", () => {
    expect(robinhoodChain.id).toBe(4663);
    expect(robinhoodChain.nativeCurrency.symbol).toBe("ETH");
    expect(robinhoodChain.rpcUrls.default.http[0]).toContain("robinhood.com");
  });

  it("pins testnet parameters", () => {
    expect(robinhoodChainTestnet.id).toBe(46630);
    expect(robinhoodChainTestnet.testnet).toBe(true);
  });

  it("exposes canonical token addresses", () => {
    expect(tokens.usdg).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(tokens.weth).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });
});
