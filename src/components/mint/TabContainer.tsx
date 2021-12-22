import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { Tabs, Row, Col, Button, Input } from "antd";

import { thunkCreateAndSendMint } from "../../store/actions/walletActions";

import "./Mint.css";

const { TabPane } = Tabs;

const TabContainer: FC = () => {
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleCreateMint = async () => {
    setLoading(true);
    setToAddress("");
    await dispatch(thunkCreateAndSendMint(toAddress));
    setLoading(false);
  };
  // const handleFetchTokens = () => {
  //   dispatch(thunkFetchTokens());
  // };

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
            <Button
              block
              type="primary"
              onClick={handleCreateMint}
              loading={loading}
            >
              Mint and Send
            </Button>
          </TabPane>
          {/* <TabPane
            tab="View Tokens"
            key="2"
            style={{ background: "white", padding: "10%" }}
          >
            <Button onClick={handleFetchTokens} type="primary" block>
              Fetch Tokens
            </Button>
          </TabPane> */}
        </Tabs>
      </Col>
    </Row>
  );
};

export default TabContainer;
