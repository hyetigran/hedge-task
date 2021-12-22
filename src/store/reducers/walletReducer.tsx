import {
  CREATE_WALLET_SUCCESS,
  FETCH_WALLETS_SUCCESS,
  TOGGLE_SELECT_WALLET,
  CREATE_AIRDROP_SUCCESS,
  CREATE_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_SUCCESS,
  WalletActionTypes,
  Wallets,
  CREATE_MINT_SUCCESS,
} from "../types/walletTypes";

const initialState: Wallets[] = [];

export const walletReducer = (
  state: Wallets[] = initialState,
  action: WalletActionTypes
) => {
  switch (action.type) {
    case TOGGLE_SELECT_WALLET:
      const updatedState = state.map((wallet) => {
        wallet.isSelected = wallet.gid === action.payload;
        return wallet;
      });
      return updatedState;
    case CREATE_WALLET_SUCCESS:
    case FETCH_WALLETS_SUCCESS:
    case CREATE_AIRDROP_SUCCESS:
    case CREATE_TRANSACTION_SUCCESS:
    case FETCH_TRANSACTION_SUCCESS:
    case CREATE_MINT_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
