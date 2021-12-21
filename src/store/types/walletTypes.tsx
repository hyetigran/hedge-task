export const CREATE_WALLET_SUCCESS = "CREATE_WALLET_SUCCESS";

export interface Wallets {
  id: string;
}

interface createWalletAction {
  type: typeof CREATE_WALLET_SUCCESS;
  payload: Wallets;
}

export type WalletActionTypes = createWalletAction;
