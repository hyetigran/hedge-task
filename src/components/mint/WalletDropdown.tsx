import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Button, Menu } from "antd";
import { DownOutlined, WalletOutlined } from "@ant-design/icons";
import "./Mint.css";
import { Wallets } from "../../store/types/walletTypes";

interface ActionProps {
  wallets: Wallets[];
}

const WalletDropdown: FC<ActionProps> = ({ wallets }) => {
  const dispatch = useDispatch();

  function handleMenuClick(e: any) {
    console.log("click", e);
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      {wallets.map((wallet) => {
        return (
          <Menu.Item key={wallet.gid} icon={<WalletOutlined />}>
            {wallet.walletName}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div className="mintWalletDropdown">
      <Dropdown overlay={menu}>
        <Button>
          Button <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default WalletDropdown;
