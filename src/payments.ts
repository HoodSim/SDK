import {
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
  type WatchContractEventReturnType,
  getContract,
  maxUint256,
} from "viem";
import { hoodSimPaymentsAbi } from "./abi.js";

const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

/** On-chain payment record for an order. */
export type Payment = {
  payer: Address;
  amount: bigint;
  refunded: boolean;
  /** True when no payment exists for this order id. */
  isEmpty: boolean;
};

export type OrderPaidEvent = {
  orderId: Hex;
  payer: Address;
  amount: bigint;
  transactionHash: Hex;
  blockNumber: bigint;
};

/**
 * Typed client for the HoodSIMPayments contract.
 *
 * Reads work with a `PublicClient` alone. Writes (`approveAndPay`) require a
 * `WalletClient`. The contract only ever holds the settlement stablecoin;
 * any-token → stablecoin routing happens off-chain (0x) before `payOrder`.
 */
export class HoodSimPayments {
  readonly address: Address;
  readonly settlementToken: Address;
  private readonly publicClient: PublicClient;
  private readonly walletClient?: WalletClient;

  constructor(params: {
    address: Address;
    settlementToken: Address;
    publicClient: PublicClient;
    walletClient?: WalletClient;
  }) {
    this.address = params.address;
    this.settlementToken = params.settlementToken;
    this.publicClient = params.publicClient;
    this.walletClient = params.walletClient;
  }

  private get contract() {
    return getContract({
      address: this.address,
      abi: hoodSimPaymentsAbi,
      client: { public: this.publicClient },
    });
  }

  /** Read the payment record for an order id. */
  async getPayment(orderId: Hex): Promise<Payment> {
    const [payer, amount, refunded] = (await this.contract.read.payments([
      orderId,
    ])) as [Address, bigint, boolean];
    return {
      payer,
      amount,
      refunded,
      isEmpty: payer === "0x0000000000000000000000000000000000000000",
    };
  }

  /** Whether the contract is paused (new payments blocked; refunds still live). */
  paused(): Promise<boolean> {
    return this.contract.read.paused() as Promise<boolean>;
  }

  /** The team multisig that owns the contract. */
  owner(): Promise<Address> {
    return this.contract.read.owner() as Promise<Address>;
  }

  /** Watch `OrderPaid` events; returns an unsubscribe function. */
  watchOrderPaid(
    onPaid: (event: OrderPaidEvent) => void,
  ): WatchContractEventReturnType {
    return this.publicClient.watchContractEvent({
      address: this.address,
      abi: hoodSimPaymentsAbi,
      eventName: "OrderPaid",
      onLogs: (logs) => {
        for (const log of logs) {
          const { orderId, payer, amount } = log.args as {
            orderId: Hex;
            payer: Address;
            amount: bigint;
          };
          onPaid({
            orderId,
            payer,
            amount,
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
          });
        }
      },
    });
  }

  /**
   * Approve (if needed) and pay for an order in one flow. Requires a wallet
   * client. Returns the `payOrder` transaction hash.
   */
  async approveAndPay(orderId: Hex, amount: bigint): Promise<Hex> {
    const wallet = this.requireWallet();
    const account = wallet.account;
    if (!account) throw new Error("Wallet client has no account");

    const allowance = (await this.publicClient.readContract({
      address: this.settlementToken,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [account.address, this.address],
    })) as bigint;

    if (allowance < amount) {
      const approveHash = await wallet.writeContract({
        address: this.settlementToken,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [this.address, maxUint256],
        account,
        chain: wallet.chain,
      });
      await this.publicClient.waitForTransactionReceipt({ hash: approveHash });
    }

    return wallet.writeContract({
      address: this.address,
      abi: hoodSimPaymentsAbi,
      functionName: "payOrder",
      args: [orderId, amount],
      account,
      chain: wallet.chain,
    });
  }

  private requireWallet(): WalletClient {
    if (!this.walletClient) {
      throw new Error("A WalletClient is required for write operations");
    }
    return this.walletClient;
  }
}
