import React, { FC } from "react";
import { Row, Col } from "antd";
import TransactionHistory from "../components/wallets/TransactionHistory";
import WalletBalance from "../components/wallets/WalletBalance";
import WalletList from "../components/wallets/WalletList";

const Wallets: FC = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col flex={3} span={12}>
        <WalletBalance />
        <WalletList />
      </Col>
      <Col flex={2} span={12}>
        <TransactionHistory />
      </Col>
    </Row>
  );
};

export default Wallets;
