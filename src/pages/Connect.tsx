import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import { Wallet as ConnectWallet } from "../components/connect/ConnectWallet";
import ConnectHistory from "../components/connect/ConnectHistory";
import { Transactions } from "../store/types/walletTypes";
import { Wallet } from "@solana/wallet-adapter-base";

const Connect = () => {
  const [connectWallet, setConnectWallet] =
    useState<{ publicKey: PublicKey; wallet: Wallet }>();
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const handleConnectWalletData = (payload: {
    publicKey: PublicKey;
    wallet: Wallet;
  }) => {
    setConnectWallet(payload);
  };
  //   console.log("conn", connectWallet);
  useEffect(() => {
    if (connectWallet) {
      fetchTransactions(connectWallet.publicKey);
      fetchTokensforAccount(connectWallet.publicKey);
    } else if (!connectWallet) {
      setTransactions([]);
    }
  }, [connectWallet]);

  // ACTIONS
  const fetchTransactions = async (publicKey: PublicKey) => {
    try {
      let connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const signatures = await connection.getSignaturesForAddress(publicKey);
      const signatureArray = signatures.map((sig) => sig.signature);
      let transactions = [];
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
            new PublicKey(key).equals(publicKey)
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
      setTransactions(transactions);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTokensforAccount = async (pulicKey: PublicKey) => {
    try {
      let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const result = await connection.getProgramAccounts(pulicKey);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ConnectWallet setConnectWallet={handleConnectWalletData} />
      <ConnectHistory transactions={transactions} />
    </>
  );
};

export default Connect;
