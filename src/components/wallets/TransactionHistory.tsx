import React, { FC } from "react";
import { Card } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import "./Wallets.css";

const TransactionHistory: FC = () => {
  return (
    <Card
      title="Latest Transactions"
      extra={
        <div>
          <ReloadOutlined />
        </div>
      }
      className="cardContainer"
      style={{ minHeight: "100%" }}
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
};

export default TransactionHistory;
