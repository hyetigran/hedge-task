import { FC } from "react";
import { Card, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import "../wallets/Wallets.css";
import TransactionItem from "../wallets/TransactionItem";

interface ActionProps {
  transactions: any;
}

const ConnectHistory: FC<ActionProps> = ({ transactions }) => {
  return (
    <Card
      title="Latest Transactions"
      extra={
        <div>
          <ReloadOutlined />
        </div>
      }
      className="cardContainer"
      style={{ minHeight: "50%", maxHeight: "450px", width: "400px" }}
      bodyStyle={{
        overflow: "auto",
        maxHeight: "inherit",
        minHeight: "inherit",
      }}
    >
      {transactions ? (
        transactions.length ? (
          transactions?.map((txn: any) => (
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

export default ConnectHistory;
