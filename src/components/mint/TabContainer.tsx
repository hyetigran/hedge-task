import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Row, Col, Button } from "antd";

import {
  thunkCreateMint,
  thunkFetchTokens,
} from "../../store/actions/walletActions";

import "./Mint.css";

const { TabPane } = Tabs;

interface ActionProps {}

const TabContainer: FC<ActionProps> = () => {
  const dispatch = useDispatch();

  const handleCreateMint = () => {
    dispatch(thunkCreateMint());
  };
  const handleTokenFetch = (key: string) => {
    if (key === "2") {
      dispatch(thunkFetchTokens());
    }
  };

  return (
    <Row className="mintTabContainer">
      <Col span={12} offset={6}>
        <Tabs type="card" onTabClick={handleTokenFetch}>
          <TabPane
            tab="Create Token"
            key="1"
            style={{ background: "white", padding: "10%" }}
          >
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
            <Button block type="primary" onClick={handleCreateMint}>
              Mint
            </Button>
          </TabPane>
          <TabPane
            tab="View Tokens"
            key="2"
            style={{ background: "white", padding: "10%" }}
          >
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default TabContainer;
