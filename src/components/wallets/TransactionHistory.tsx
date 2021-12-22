import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Card, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import "./Wallets.css";
import { RootState } from "../../store";
import TransactionItem from "./TransactionItem";

const TransactionHistory: FC = () => {
  const [wallet] = useSelector((state: RootState) =>
    state.wallets.filter((wallet) => wallet.isSelected)
  );
  return (
    <Card
      title="Latest Transactions"
      extra={
        <div>
          <ReloadOutlined />
        </div>
      }
      className="cardContainer"
      style={{ minHeight: "100%", maxHeight: "600px", width: "400px" }}
      bodyStyle={{
        overflow: "auto",
        maxHeight: "inherit",
        minHeight: "inherit",
      }}
    >
      {wallet && wallet.transactions ? (
        wallet.transactions.length ? (
          wallet.transactions?.map((txn) => (
            <TransactionItem key={txn.blockTime} transaction={txn} />
          ))
        ) : (
          <p>No transaction history</p>
        )
      ) : (
        <Spin size="large" />
      )}
    </Card>
  );
};

export default TransactionHistory;
