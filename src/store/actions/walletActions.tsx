//import axios from "axios";
import { Action } from "redux";
import {
  Keypair,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ThunkAction } from "redux-thunk";

import { RootState } from "../index";
import {
  CREATE_WALLET_SUCCESS,
  FETCH_WALLETS_SUCCESS,
  TOGGLE_SELECT_WALLET,
  CREATE_AIRDROP_SUCCESS,
  CREATE_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_SUCCESS,
  Wallets,
  Transactions,
} from "../types/walletTypes";
import { createWallet, readAllWallets } from "../../localDB/utilities";
import { db, Wallet } from "../../localDB/db";

// CURRENTLY UNUSED
const VALIDATOR_API_URL = "https://api.devnet.solana.com";

// Interfaces

interface lWallet {
  walletName: string;
  seed: Uint8Array;
  balance: number;
}

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
  // use getBalance method instead
  const account = await connection.getAccountInfo(keypair.publicKey);
  console.log("ACCCOUNT", account);
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

export const thunkCreateTransaction =
  (
    keypair: Keypair,
    toAddress: string,
    amount: string
  ): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // Create Simple Transaction
    let transaction = new Transaction();

    // Add an instruction to execute
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: parseInt(amount) * 100000000,
      })
    );

    // Send and confirm transaction
    const result = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    console.log("result", result);
    try {
    } catch (error) {
      console.log(error);
    }
  };

const createTransaction = (payload: any) => {
  return {
    type: CREATE_TRANSACTION_SUCCESS,
    payload,
  };
};

export const thunkFetchTransaction =
  (
    keypair: Keypair,
    gid: string
  ): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    try {
      let connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const signatures = await connection.getSignaturesForAddress(
        keypair.publicKey
      );
      const signatureArray = signatures.map((sig) => sig.signature);

      let transactions: Transactions[] = [];
      for (let i = 0; i < signatureArray.length; i++) {
        const transaction = await connection.getTransaction(signatureArray[i]);
        console.log("TXN", transaction);
        if (!transaction) {
          throw new Error(
            `Transaction is null for signature: ${signatureArray[i]}`
          );
        }
        if (!transaction.meta) {
          throw new Error(
            `Transaction meta is null for signature: ${signatureArray[i]}`
          );
        }
        const accountKeyIndex =
          transaction.transaction.message.accountKeys.findIndex((key) =>
            new PublicKey(key).equals(keypair.publicKey)
          );

        const {
          blockTime,
          slot,
          meta: { fee, postBalances, preBalances },
        } = transaction;
        const feePaid = accountKeyIndex === 0 ? fee : 0;
        const amount =
          (postBalances[accountKeyIndex] -
            preBalances[accountKeyIndex] -
            feePaid) /
          100000000;
        let newTransaction = {
          blockTime,
          fee,
          slot,
          amount,
        };
        transactions.push(newTransaction);
      }

      const { wallets } = getState();
      const updatedWallets = wallets.map((wallet) => {
        if (wallet.gid === gid) {
          return {
            ...wallet,
            transactions,
          };
        }
        return wallet;
      });
      dispatch(fetchTransaction(updatedWallets));
    } catch (error) {
      console.log(error);
    }
  };

const fetchTransaction = (payload: Wallets[]) => {
  return {
    type: FETCH_TRANSACTION_SUCCESS,
    payload,
  };
};

export const thunkCreateMint =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { wallets } = getState();
      const [selectedWallet] = wallets.filter((wallet) => wallet.isSelected);

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const mint = await Token.createMint(
        connection,
        selectedWallet.keypair,
        selectedWallet.keypair.publicKey,
        null,
        100,
        TOKEN_PROGRAM_ID
      );
      console.log("MINT", mint);

      // Get the token account of the fromWallet Solana address, if it does not exist, create it
      const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        selectedWallet.keypair.publicKey
      );
      console.log("fromTokenAccount", fromTokenAccount);

      // Minting 1 new token to the "fromTokenAccount" account we just returned/created
      const result = await mint.mintTo(
        fromTokenAccount.address,
        selectedWallet.keypair.publicKey,
        [],
        1000000000
      );

      console.log("MINT TO R", result);
    } catch (error) {
      console.log(error);
    }
  };

export const thunkFetchTokens =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { wallets } = getState();
      const [selectedWallet] = wallets.filter((wallet) => wallet.isSelected);

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      //   const token = await Token.getAssociatedTokenAddress(selectedWallet.keypair.publicKey)
      const tokenAccounts = await connection.getProgramAccounts(
        selectedWallet.keypair.publicKey
      );
      console.log("TOKEN ACCOUNTS", tokenAccounts);
    } catch (error) {
      console.log(error);
    }
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
