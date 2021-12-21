import {
  CREATE_WALLET_SUCCESS,
  FETCH_WALLETS_SUCCESS,
  TOGGLE_SELECT_WALLET,
  CREATE_AIRDROP_SUCCESS,
  WalletActionTypes,
  Wallets,
} from "../types/walletTypes";

const initialState: Wallets[] = [];

export const walletReducer = (
  state = initialState,
  action: WalletActionTypes
) => {
  switch (action.type) {
    case CREATE_WALLET_SUCCESS:
      return [...state, action.payload];
    case CREATE_AIRDROP_SUCCESS:
      return action.payload;
    case FETCH_WALLETS_SUCCESS:
      return action.payload;
    case TOGGLE_SELECT_WALLET:
      const updatedState = state.map((wallet) => {
        wallet.isSelected = wallet.gid === action.payload;
        return wallet;
      });
      return updatedState;
    default:
      return state;
  }
};
