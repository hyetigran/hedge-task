import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Button, Menu, Row, Col } from "antd";
import { DownOutlined, WalletOutlined } from "@ant-design/icons";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import "./Mint.css";
import { Wallets } from "../../store/types/walletTypes";
import { selectWalletAction } from "../../store/actions/walletActions";

interface ActionProps {
  wallets: Wallets[];
}

const WalletDropdown: FC<ActionProps> = ({ wallets }) => {
  const dispatch = useDispatch();

  const handleMenuClick: MenuClickEventHandler = (e) => {
    dispatch(selectWalletAction(e.key));
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {wallets.map((wallet) => {
        return (
          <Menu.Item key={wallet.gid} icon={<WalletOutlined />}>
            {`${wallet.walletName} ${wallet.balance} SOL`}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const [selectedWallet] = wallets.filter((wallet) => wallet.isSelected);

  return (
    <Row className="mintWalletDropdown">
      <Col span={12} offset={6}>
        <Dropdown overlay={menu}>
          <Button block>
            {selectedWallet
              ? `${selectedWallet.walletName} ${selectedWallet.balance} SOL`
              : "Select Wallet"}
            <DownOutlined />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default WalletDropdown;
