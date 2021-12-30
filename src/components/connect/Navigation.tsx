import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { FC, useEffect } from "react";

interface ActionProps {
  setConnectWallet: (pk: PublicKey) => void;
}

export const Navigation: FC<ActionProps> = ({ setConnectWallet }) => {
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      setConnectWallet(publicKey);
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
