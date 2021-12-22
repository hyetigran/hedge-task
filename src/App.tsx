import React, { FC } from "react";
import { Layout, Menu } from "antd";
import { BankOutlined, WalletOutlined } from "@ant-design/icons";
import { Link, Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Wallets from "./pages/Wallets";
import Mint from "./pages/Mint";
import "./App.css";

const { Sider, Content, Header } = Layout;

const App: FC = () => {
  return (
    <Router>
      <Layout className="homeContainer">
        <Sider width={300}>
          <Header className="logoTitle">Hedgehog Task</Header>
          <Menu mode="inline" theme="dark" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/">
                <WalletOutlined /> Wallets
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/mint">
                <BankOutlined /> Mint
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>
          <Routes>
            <Route path="/" element={<Wallets />} />
            <Route path="/mint" element={<Mint />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
