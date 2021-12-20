import React, { FC } from "react";
import { Card, Button, Space } from "antd";

import "./Wallets.css";

const WalletBalance = () => {
  return (
    <Card title="Balance" extra={<p>0 SOL</p>} className="cardContainer">
      <div className="buttonContainer">
        <Button block type="primary" style={{ margin: "10px" }}>
          Receive
        </Button>

        <Button block type="primary" style={{ margin: "10px" }}>
          Send
        </Button>
      </div>
    </Card>
  );
};

export default WalletBalance;
