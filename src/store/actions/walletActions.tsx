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
  CREATE_MINT_SUCCESS,
  Wallets,
  Transactions,
} from "../types/walletTypes";
import {
  createMint,
  createWallet,
  loadWalletMints,
  readAllWallets,
} from "../../localDB/utilities";
import { db, Mint, Wallet } from "../../localDB/db";

// Interfaces

interface lWallet {
  walletName: string;
  seed: Uint8Array;
  balance: number;
}

interface lMint {
  mint: string;
  owner: string;
  address: string;
}
export const thunkCreateWallet =
  (walletName: string): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    try {
      let keypair = Keypair.generate();

      const newWallet = {
        walletName,
        balance: 0,
        seed: keypair.secretKey,
      };
      const result = await saveWallet(newWallet);
      const { wallets } = getState();
      const updatedWallets = wallets.map((wallet) => {
        if (wallet.isSelected) {
          return {
            ...wallet,
            isSelected: false,
          };
        }
        return wallet;
      });
      updatedWallets.push({
        gid: result,
        ...newWallet,
        keypair,
        isSelected: true,
      });
      dispatch(createWalletAction(updatedWallets));
    } catch (err) {
      console.log(err);
    }
  };

const createWalletAction = (payload: Wallets[]) => {
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
    const { wallets } = getState();
    const updatedWallets = wallets.map((wallet) => {
      if (wallet.isSelected) {
        return {
          ...wallet,
          balance: wallet.balance - parseInt(amount),
        };
      }
      return wallet;
    });
    dispatch(createTransaction(updatedWallets));
    try {
    } catch (error) {
      console.log(error);
    }
  };

const createTransaction = (payload: Wallets[]) => {
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
          meta: { fee, postBalances, preBalances, postTokenBalances },
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
          isToken: postTokenBalances && postTokenBalances.length ? true : false,
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

export const thunkCreateAndSendMint =
  (toAddress: string): ThunkAction<void, RootState, unknown, Action<string>> =>
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
        2,
        TOKEN_PROGRAM_ID
      );

      // Get the token account of the fromWallet Solana address, if it does not exist, create it
      const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        selectedWallet.keypair.publicKey
      );

      //get the token account of the toWallet Solana address, if it does not exist, create it
      const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        new PublicKey(toAddress)
      );

      // Minting 1 new token to the "fromTokenAccount" account we just returned/created
      await mint.mintTo(
        fromTokenAccount.address,
        selectedWallet.keypair.publicKey,
        [],
        1000000000
      );

      // Add token transfer instructions to transaction
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          selectedWallet.keypair.publicKey,
          [],
          1
        )
      );

      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [selectedWallet.keypair],
        { commitment: "confirmed" }
      );

      // Persist in local DB
      const newMint = {
        mint: new PublicKey(fromTokenAccount.mint).toBase58(),
        owner: new PublicKey(fromTokenAccount.owner).toBase58(),
        address: new PublicKey(fromTokenAccount.address).toBase58(),
      };
      if (!selectedWallet.gid) {
        throw new Error("Wallet gid missing");
      }
      await saveMint(selectedWallet.gid, newMint);
      const updatedWallets = wallets.map((wallet) => {
        if (wallet.isSelected) {
          return {
            ...wallet,
            mintObject: mint,
          };
        }
        return wallet;
      });
      dispatch(createMintAction(updatedWallets));
    } catch (error) {
      console.log(error);
    }
  };

const createMintAction = (wallets: Wallets[]) => {
  return {
    type: CREATE_MINT_SUCCESS,
    payload: wallets,
  };
};

// NOT INVOKED
export const thunkFetchTokens =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { wallets } = getState();
      const [selectedWallet] = wallets.filter((wallet) => wallet.isSelected);
      const savedMints = await getSavedMints(selectedWallet.gid!);

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      //   const tokenList = [];
      //   for (let i = 0; i < savedMints.length; i++) {
      //     const token = await Token.getAssociatedTokenAddress(
      //       selectedWallet.keypair.publicKey,
      //       selectedWallet.keypair.publicKey,
      //       new PublicKey(savedMints[i].mint),
      //       new PublicKey(savedMints[i].owner)
      //     );
      //     tokenList.push(token);
      //     console.log("TOKEN", token);
      //   }
      const tokenSupply = await connection.getTokenSupply(
        new PublicKey(savedMints[0].mint)
      );

      const tokenAccounts = await connection.getProgramAccounts(
        selectedWallet.keypair.publicKey
      );
    } catch (error) {
      console.log(error);
    }
  };

// NOT INVOKED
export const thunkSendTokens =
  (toAddress: string): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    try {
      const { wallets } = getState();
      const [selectedWallet] = wallets.filter((wallet) => wallet.isSelected);

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      //   const mint = await new Token(
      //     connection,
      //     selectedWallet.keypair.publicKey,
      //     selectedWallet.keypair.publicKey,
      //     selectedWallet.keypair
      //   );
      //   const mint = selectedWallet.mintObject;
      //   // Get the token account of the fromWallet Solana address, if it does not exist, create it
      //   const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
      //     selectedWallet.keypair.publicKey
      //   );
      //   console.log("FROM", fromTokenAccount);

      //   //get the token account of the toWallet Solana address, if it does not exist, create it
      //   const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
      //     new PublicKey(toAddress)
      //   );
      //   const accountInfo = await connection.getAccountInfo(
      //     new PublicKey(toAddress)
      //   );
      //   console.log("TO", toTokenAccount);
      //   console.log("TO2", accountInfo);

      // Add token transfer instructions to transaction
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          selectedWallet.keypair.publicKey,
          new PublicKey(toAddress),
          selectedWallet.keypair.publicKey,
          [],
          1
        )
      );
      // Sign transaction, broadcast, and confirm
      await sendAndConfirmTransaction(
        connection,
        transaction,
        [selectedWallet.keypair],
        { commitment: "confirmed" }
      );
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

async function saveMint(id: string, mintObject: lMint) {
  await db.transaction("rw", db.wallets, db.mints, async () => {
    const { mint, owner, address } = mintObject;
    await createMint(db, new Mint(id, mint, owner, address));
  });
}
async function getSavedWallets(): Promise<Wallet[]> {
  return await db.transaction("rw", db.wallets, async (): Promise<Wallet[]> => {
    return await readAllWallets(db);
  });
}

async function getSavedMints(walletId: string): Promise<Mint[]> {
  return await db.transaction(
    "rw",
    db.wallets,
    db.mints,
    async (): Promise<Mint[]> => {
      return await loadWalletMints(walletId, db);
    }
  );
}
