import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";

import "./Mint.css";

const { TabPane } = Tabs;

interface ActionProps {}

const TabContainer: FC<ActionProps> = () => {
  const dispatch = useDispatch();

  return (
    <div className="mintTabContainer">
      <Tabs type="card">
        <TabPane tab="Create Token" key="1">
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
        </TabPane>
        <TabPane tab="View Token" key="2">
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabContainer;
