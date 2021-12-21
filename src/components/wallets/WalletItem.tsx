import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { selectWalletAction } from "../../store/actions/walletActions";

import "./Wallets.css";

interface ActionProps {
  walletName: string;
  //   keypair: any;
  gid: string;
  balance: number;
  isSelected: boolean;
}

const WalletItem: FC<ActionProps> = ({
  gid,
  balance,
  walletName,
  isSelected,
}) => {
  const dispatch = useDispatch();

  return (
    <div
      className={isSelected ? "walletItem selectedWalletItem" : "walletItem"}
      onClick={() => dispatch(selectWalletAction(gid))}
    >
      <p>{walletName}</p>
      <CloudDownloadOutlined />
    </div>
  );
};

export default WalletItem;
