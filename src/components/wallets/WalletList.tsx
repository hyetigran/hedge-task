import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Card, Input } from "antd";

import "./Wallets.css";
import { thunkCreateWallet } from "../../store/actions/walletActions";

const WalletList: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [walletName, setWalletName] = useState("");
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    dispatch(thunkCreateWallet());
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const walletNameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setWalletName(e.currentTarget.value);
  };

  return (
    <>
      <Card
        title="My Wallets"
        extra={
          <div onClick={showModal}>
            <PlusOutlined />
          </div>
        }
        className="cardContainer"
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Modal
        title="Create Wallet"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Personal wallet"
          onChange={walletNameHandler}
          value={walletName}
        />
      </Modal>
    </>
  );
};

export default WalletList;
