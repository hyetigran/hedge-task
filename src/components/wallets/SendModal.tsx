import React, { FC, useState } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";

import "./Wallets.css";

interface ActionProps {
  toAddress: string;
  amount: string;
  addressHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  amountHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SendModal: FC<ActionProps> = ({
  toAddress,
  amount,
  addressHandler,
  amountHandler,
}) => {
  return (
    <div className="sendForm">
      <Input
        placeholder="Send to address"
        value={toAddress}
        onChange={addressHandler}
      />
      <Input placeholder="0 SOL" value={amount} onChange={amountHandler} />
    </div>
  );
};

export default SendModal;
