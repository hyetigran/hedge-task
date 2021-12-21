import {
  CREATE_WALLET_SUCCESS,
  FETCH_WALLETS_SUCCESS,
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
    case FETCH_WALLETS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
