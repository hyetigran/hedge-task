import React, { FC } from "react";
import dayjs from "dayjs";
import { Tooltip } from "antd";
import { UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";
import { Transactions } from "../../store/types/walletTypes";

import "./Wallets.css";

interface ActionProps {
  transaction: Transactions;
}

const TransactionItem: FC<ActionProps> = ({
  transaction: { amount, fee, blockTime, slot },
}) => {
  const date = dayjs.unix(blockTime!).format("MM-DD-YY, HH:mm");
  return (
    <div className="transactionItem">
      <div className="topTransactionDetail">
        <p>{`Date: ${date}`}</p>
        <p>{`Slot: ${slot}`}</p>
      </div>
      <div className="topTransactionDetail">
        <p>{`Amount: ${amount} SOL`}</p>
        <Tooltip placement="right" title={amount < 0 ? "Sent" : "Received"}>
          {amount < 0 ? (
            <UpCircleOutlined style={{ fontSize: "1.5rem", color: "red" }} />
          ) : (
            <DownCircleOutlined
              style={{ fontSize: "1.5rem", color: "green" }}
            />
          )}
        </Tooltip>
      </div>
    </div>
  );
};

export default TransactionItem;
