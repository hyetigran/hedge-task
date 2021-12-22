import { Keypair } from "@solana/web3.js";

export const CREATE_WALLET_SUCCESS = "CREATE_WALLET_SUCCESS";
export const FETCH_WALLETS_SUCCESS = "FETCH_WALLETS_SUCCESS";
export const TOGGLE_SELECT_WALLET = "TOGGLE_SELECT_WALLET";
export const CREATE_AIRDROP_SUCCESS = "CREATE_AIRDROP_SUCCESS";
export const CREATE_TRANSACTION_SUCCESS = "CREATE_TRANSACTION_SUCCESS";
export const FETCH_TRANSACTION_SUCCESS = "FETCH_TRANSACTION_SUCCESS";
export const CREATE_MINT_SUCCESS = "CREATE_MINT_SUCCESS";

export interface Wallets {
  gid?: string;
  seed: Uint8Array;
  balance: number;
  walletName: string;
  keypair: Keypair;
  isSelected: boolean;
  transactions?: Transactions[];
  mints?: Mint[];
  mintObject?: any;
}

export interface Transactions {
  blockTime: number | null | undefined;
  slot: number;
  amount: number;
  fee: number;
  isToken: boolean;
}

export interface Mint {
  mint: string;
}

interface createWalletAction {
  type: typeof CREATE_WALLET_SUCCESS;
  payload: Wallets;
}

interface fetchWalletsAction {
  type: typeof FETCH_WALLETS_SUCCESS;
  payload: Wallets[];
}

interface toggleWalletAction {
  type: typeof TOGGLE_SELECT_WALLET;
  payload: string;
}

interface createAirdropAction {
  type: typeof CREATE_AIRDROP_SUCCESS;
  payload: Wallets[];
}

interface createTransactionAction {
  type: typeof CREATE_TRANSACTION_SUCCESS;
  payload: Wallets[];
}

interface fetchTransactionAction {
  type: typeof FETCH_TRANSACTION_SUCCESS;
  payload: Wallets[];
}

interface createMintAction {
  type: typeof CREATE_MINT_SUCCESS;
  payload: Wallets[];
}

export type WalletActionTypes =
  | createWalletAction
  | fetchWalletsAction
  | toggleWalletAction
  | createAirdropAction
  | createTransactionAction
  | fetchTransactionAction
  | createMintAction;
