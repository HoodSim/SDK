import { type Hex, isHex, pad, hexToBytes, bytesToHex } from "viem";

/**
 * Order ids are UUIDv4 strings off-chain and `bytes32` on-chain. The mapping
 * is a left-padded hex encoding of the 16 UUID bytes — lossless in both
 * directions, and idempotent everywhere (the same key on-chain, in the
 * database, and at the supplier).
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Convert a UUID string to a `bytes32` order id. */
export function uuidToOrderId(uuid: string): Hex {
  if (!UUID_RE.test(uuid)) {
    throw new Error(`Invalid UUID: ${uuid}`);
  }
  const hex = `0x${uuid.replace(/-/g, "")}` as Hex;
  return pad(hex, { size: 32 });
}

/** Convert a `bytes32` order id back to its UUID string. */
export function orderIdToUuid(orderId: Hex): string {
  if (!isOrderId(orderId)) {
    throw new Error(`Invalid order id: ${orderId}`);
  }
  // The UUID lives in the low 16 bytes.
  const bytes = hexToBytes(orderId).slice(16);
  const h = bytesToHex(bytes).slice(2);
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    h.slice(12, 16),
    h.slice(16, 20),
    h.slice(20, 32),
  ].join("-");
}

/** True when `value` is a well-formed `bytes32` order id. */
export function isOrderId(value: unknown): value is Hex {
  return typeof value === "string" && isHex(value) && value.length === 66;
}
