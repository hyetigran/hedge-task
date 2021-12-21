// import axios from "axios";
import { Action } from "redux";
import { Keypair } from "@solana/web3.js";
import { ThunkAction } from "redux-thunk";

import { RootState } from "../index";
import {
  CREATE_WALLET_SUCCESS,
  FETCH_WALLETS_SUCCESS,
  TOGGLE_SELECT_WALLET,
  Wallets,
} from "../types/walletTypes";
import { createWallet, readAllWallets } from "../../localDB/utilities";
import { db, Wallet } from "../../localDB/db";

export const thunkCreateWallet =
  (walletName: string): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      let keypair = Keypair.generate();

      const newWallet = {
        walletName,
        balance: 0,
        seed: keypair.secretKey,
      };
      const result = await saveWallet(newWallet);

      dispatch(createWalletAction({ gid: result, ...newWallet, keypair }));
    } catch (err) {
      console.log(err);
    }
  };

const createWalletAction = (payload: any) => {
  return {
    type: CREATE_WALLET_SUCCESS,
    payload,
  };
};

export const thunkFetchWallets =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      const wallets = await getSavedWallets();
      let keypairedWallets: Wallets[];
      if (wallets.length) {
        // Generate keypair from seed
        keypairedWallets = wallets.map((wallet) => {
          let seed = new Uint8Array(wallet.seed).slice(0, 32);
          return {
            ...wallet,
            keypair: Keypair.fromSeed(seed),
            isSelected: false,
          };
        });
        // Toggle first wallet as selected
        keypairedWallets[0].isSelected = true;
        dispatch(fetchWallets(keypairedWallets));
      } else {
        dispatch(thunkCreateWallet("First Wallet"));
      }
    } catch (error) {
      console.log(error);
    }
  };

const fetchWallets = (wallets: Wallets[]) => {
  return {
    type: FETCH_WALLETS_SUCCESS,
    payload: wallets,
  };
};

export const selectWalletAction = (gid: string) => {
  return {
    type: TOGGLE_SELECT_WALLET,
    payload: gid,
  };
};

// Local DB functions

async function saveWallet(wallet: lWallet): Promise<string> {
  return await db.transaction("rw", db.wallets, async (): Promise<string> => {
    const { walletName, seed, balance } = wallet;
    const newWallet = new Wallet(walletName, balance, seed);

    return await createWallet(db, newWallet);
  });
}
async function getSavedWallets(): Promise<Wallet[]> {
  return await db.transaction("rw", db.wallets, async (): Promise<Wallet[]> => {
    return await readAllWallets(db);
  });
}

// Interfaces

interface lWallet {
  walletName: string;
  seed: Uint8Array;
  balance: number;
}
