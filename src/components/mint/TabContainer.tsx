import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { Tabs, Row, Col, Button, Input } from "antd";

import { thunkCreateAndSendMint } from "../../store/actions/walletActions";

import "./Mint.css";

const { TabPane } = Tabs;

const TabContainer: FC = () => {
  const [toAddress, setToAddress] = useState("");

  const dispatch = useDispatch();

  const handleCreateMint = () => {
    dispatch(thunkCreateAndSendMint(toAddress));
  };

  const addressHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // NO INPUT VALIDATION
    setToAddress(e.currentTarget.value);
  };

  return (
    <Row className="mintTabContainer">
      <Col span={12} offset={6}>
        <Tabs type="card">
          <TabPane
            tab="Create Token"
            key="1"
            style={{ background: "white", padding: "10%" }}
          >
            <Input
              placeholder="Send to address"
              value={toAddress}
              onChange={addressHandler}
              style={{ margin: "10px 0" }}
            />
            <Button block type="primary" onClick={handleCreateMint}>
              Mint and Send
            </Button>
          </TabPane>
          {/* <TabPane
            tab="Send Tokens"
            key="3"
            style={{ background: "white", padding: "10%" }}
          >
            <Input
              placeholder="Send to address"
              value={toAddress}
              onChange={addressHandler}
              style={{ margin: "10px 0" }}
            />

            <Button onClick={handleSendToken} type="primary" block>
              Send
            </Button>
          </TabPane> */}
        </Tabs>
      </Col>
    </Row>
  );
};

export default TabContainer;
