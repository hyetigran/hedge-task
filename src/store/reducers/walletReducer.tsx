import { CREATE_WALLET_SUCCESS, WalletActionTypes } from "../types/walletTypes";

const initialState: any = [];

export const walletReducer = (
  state = initialState,
  action: WalletActionTypes
) => {
  switch (action.type) {
    case CREATE_WALLET_SUCCESS:
      return [action.payload];
    default:
      return state;
  }
};
