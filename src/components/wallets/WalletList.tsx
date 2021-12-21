import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Card, Input } from "antd";

import "./Wallets.css";
import {
  thunkCreateWallet,
  thunkFetchWallets,
} from "../../store/actions/walletActions";
import { RootState } from "../../store";

const WalletList: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [walletName, setWalletName] = useState("");

  const wallets = useSelector((state: RootState) => state.wallets);
  const dispatch = useDispatch();

  useEffect(() => {
    initialLoad();
  }, []);

  const initialLoad = () => {
    dispatch(thunkFetchWallets());
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    dispatch(thunkCreateWallet(walletName));
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
        {wallets &&
          wallets.map((wallet) => {
            return <p key={wallet.gid}>{wallet.walletName}</p>;
          })}
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
