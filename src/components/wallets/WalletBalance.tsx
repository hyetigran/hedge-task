import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Spin, Modal } from "antd";

import { RootState } from "../../store";
import { thunkCreateTransaction } from "../../store/actions/walletActions";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";

import "./Wallets.css";

const WalletBalance: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const wallet = useSelector((state: RootState) =>
    state.wallets.filter((wallet) => wallet.isSelected)
  );

  const dispatch = useDispatch();

  const showModal = (type: boolean) => {
    setIsModalVisible(true);
    setModalType(type);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (modalType) {
      dispatch(thunkCreateTransaction(wallet[0].keypair, toAddress, amount));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const addressHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // NO INPUT VALIDATION
    setToAddress(e.currentTarget.value);
  };

  const amountHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // NO INPUT VALIDATION
    setAmount(e.currentTarget.value);
  };

  let extra;
  if (!wallet.length) {
    extra = <Spin size="large" />;
  } else {
    extra = <p>{`${wallet[0].balance} SOL`}</p>;
  }
  return (
    <>
      <Card title="Balance" extra={extra} className="cardContainer">
        <div className="buttonContainer">
          <Button
            disabled={!wallet.length}
            block
            type="primary"
            style={{ margin: "10px" }}
            onClick={() => showModal(false)}
          >
            Receive
          </Button>

          <Button
            disabled={!wallet.length || wallet[0].balance <= 0}
            block
            type="primary"
            style={{ margin: "10px" }}
            onClick={() => showModal(true)}
          >
            Send
          </Button>
        </div>
      </Card>
      <Modal
        title={modalType ? "Send Funds" : "Receive Funds"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalType ? "Submit" : "Ok"}
      >
        {modalType ? (
          <SendModal
            toAddress={toAddress}
            amount={amount}
            addressHandler={addressHandler}
            amountHandler={amountHandler}
          />
        ) : (
          <ReceiveModal publicKey={wallet[0]?.keypair.publicKey.toBase58()} />
        )}
      </Modal>
    </>
  );
};

export default WalletBalance;
