import { describe, it, expect } from "vitest";
import { uuidToOrderId, orderIdToUuid, isOrderId } from "../src/order-id.js";

describe("order id ↔ uuid", () => {
  const uuid = "3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8";
  const orderId =
    "0x000000000000000000000000000000003f1a2b3c4d5e6f708192a3b4c5d6e7f8";

  it("maps a uuid to a left-padded bytes32", () => {
    expect(uuidToOrderId(uuid)).toBe(orderId);
    expect(isOrderId(uuidToOrderId(uuid))).toBe(true);
  });

  it("round-trips losslessly", () => {
    expect(orderIdToUuid(uuidToOrderId(uuid))).toBe(uuid);
  });

  it("is case-insensitive on input, lowercase on output", () => {
    expect(orderIdToUuid(uuidToOrderId(uuid.toUpperCase()))).toBe(uuid);
  });

  it("rejects malformed uuids", () => {
    expect(() => uuidToOrderId("not-a-uuid")).toThrow();
    expect(() => uuidToOrderId("3f1a2b3c4d5e6f708192a3b4c5d6e7f8")).toThrow();
  });

  it("validates order ids", () => {
    expect(isOrderId(orderId)).toBe(true);
    expect(isOrderId("0x1234")).toBe(false);
    expect(isOrderId(42)).toBe(false);
    expect(isOrderId(undefined)).toBe(false);
  });

  it("rejects a bad order id on reverse conversion", () => {
    expect(() => orderIdToUuid("0xabc" as `0x${string}`)).toThrow();
  });
});
