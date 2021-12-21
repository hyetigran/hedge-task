// import axios from "axios";
import { Action } from "redux";
import { Keypair } from "@solana/web3.js";
import { ThunkAction } from "redux-thunk";

import { RootState } from "../index";
import { CREATE_WALLET_SUCCESS } from "../types/walletTypes";

export const thunkCreateWallet =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      let keypair = Keypair.generate();
      console.log("KEYPAIR", keypair);
      console.log(
        "NEW BLOB",
        new Blob([keypair.secretKey], { type: "application/octet-stream" })
      );
    } catch (err) {
      console.log(err);
    }
  };

const createWallet = (payload: any) => {
  return {
    type: CREATE_WALLET_SUCCESS,
    payload,
  };
};

const fetchWallets = () => {};
