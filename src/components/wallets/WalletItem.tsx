import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import {
  selectWalletAction,
  thunkAirdropToAccount,
} from "../../store/actions/walletActions";

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

  const airdropHandler = () => {
    dispatch(thunkAirdropToAccount(gid));
  };
  return (
    <div
      className={isSelected ? "walletItem selectedWalletItem" : "walletItem"}
      onClick={() => dispatch(selectWalletAction(gid))}
    >
      <p>{walletName}</p>
      <Tooltip placement="right" title={"Airdrop"}>
        <CloudDownloadOutlined onClick={airdropHandler} />
      </Tooltip>
    </div>
  );
};

export default WalletItem;
