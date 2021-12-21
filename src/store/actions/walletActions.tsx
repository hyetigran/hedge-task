import axios from "axios";
import { Action } from "redux";
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { ThunkAction } from "redux-thunk";

import { RootState } from "../index";
import {
  CREATE_WALLET_SUCCESS,
  FETCH_WALLETS_SUCCESS,
  TOGGLE_SELECT_WALLET,
  CREATE_AIRDROP_SUCCESS,
  Wallets,
} from "../types/walletTypes";
import { createWallet, readAllWallets } from "../../localDB/utilities";
import { db, Wallet } from "../../localDB/db";

const VALIDATOR_API_URL = "https://api.devnet.solana.com";

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
        keypairedWallets = [];

        for (let i = 0; i < wallets.length; i++) {
          let wallet = wallets[i];
          let seed = new Uint8Array(wallet.seed).slice(0, 32);
          let keypair = Keypair.fromSeed(seed);
          const balance = await fetchAccountBalance(keypair);
          keypairedWallets.push({
            ...wallet,
            keypair,
            isSelected: false,
            balance,
          });
        }
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

const fetchAccountBalance = async (keypair: any) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const account = await connection.getAccountInfo(keypair.publicKey);

  return account ? account.lamports / 100000000 : 0;
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

export const thunkAirdropToAccount =
  (gid: string): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { wallets } = getState();
      const [selectedWallet] = wallets.filter((wallet) => wallet.gid === gid);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const airdropSignature = await connection.requestAirdrop(
        selectedWallet.keypair.publicKey,
        LAMPORTS_PER_SOL
      );

      const result = await connection.confirmTransaction(airdropSignature);

      let account = await connection.getAccountInfo(
        selectedWallet.keypair.publicKey
      );

      const balance = account ? account.lamports / 100000000 : 0;
      const updatedWalletState = wallets.map((wallet) => {
        if (wallet.gid === gid) {
          return {
            ...wallet,
            balance,
          };
        }
        return wallet;
      });
      dispatch(airdropToAccount(updatedWalletState));
    } catch (error) {
      console.log(error);
    }
  };

const airdropToAccount = (updatedWalletState: Wallets[]) => {
  return {
    type: CREATE_AIRDROP_SUCCESS,
    payload: updatedWalletState,
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
