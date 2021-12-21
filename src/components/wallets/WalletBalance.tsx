import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Card, Button, Spin } from "antd";

import { RootState } from "../../store";
import "./Wallets.css";

const WalletBalance: FC = () => {
  const wallet = useSelector((state: RootState) =>
    state.wallets.filter((wallet) => wallet.isSelected)
  );

  let extra;
  if (!wallet.length) {
    extra = <Spin size="large" />;
  } else {
    extra = <p>{`${wallet[0].balance} SOL`}</p>;
  }
  return (
    <Card title="Balance" extra={extra} className="cardContainer">
      <div className="buttonContainer">
        <Button
          disabled={!wallet.length}
          block
          type="primary"
          style={{ margin: "10px" }}
        >
          Receive
        </Button>

        <Button
          disabled={!wallet.length}
          block
          type="primary"
          style={{ margin: "10px" }}
        >
          Send
        </Button>
      </div>
    </Card>
  );
};

export default WalletBalance;
