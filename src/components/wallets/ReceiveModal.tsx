import React, { FC } from "react";
import { useDispatch } from "react-redux";

interface ActionProps {
  publicKey: Uint8Array;
}

const ReceiveModal: FC<ActionProps> = ({ publicKey }) => {
  return (
    <div>
      <p>Account Address:</p>
      <p>{publicKey}</p>
    </div>
  );
};

export default ReceiveModal;
