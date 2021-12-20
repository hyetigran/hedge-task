import React, { FC } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Card } from "antd";

import "./Wallets.css";

const WalletList: FC = () => {
  return (
    <Card
      title="My Wallets"
      extra={
        <div>
          <PlusOutlined />
        </div>
      }
      className="cardContainer"
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
};

export default WalletList;
