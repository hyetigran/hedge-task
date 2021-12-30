import { Wallet } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { FC, useEffect } from "react";

interface ActionProps {
  setConnectWallet: ({
    publicKey,
    wallet,
  }: {
    publicKey: PublicKey;
    wallet: Wallet;
  }) => void;
}

export const Navigation: FC<ActionProps> = ({ setConnectWallet }) => {
  const { publicKey, wallet } = useWallet();
  console.log("w", wallet);

  useEffect(() => {
    if (publicKey && wallet) {
      setConnectWallet({ publicKey, wallet });
    }
  }, [publicKey]);

  return (
    <div
      style={{
        display: "flex",
        margin: "10% auto",
        justifyContent: "space-around",
      }}
    >
      <WalletMultiButton />
      {publicKey && <WalletDisconnectButton />}
    </div>
  );
};
