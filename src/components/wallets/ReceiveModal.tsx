import React, { FC } from "react";

interface ActionProps {
  publicKey: string;
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
