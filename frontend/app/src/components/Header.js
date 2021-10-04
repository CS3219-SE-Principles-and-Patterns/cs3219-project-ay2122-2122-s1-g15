import { Layout, Menu } from "antd";
import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { Header } = Layout;
  let location = useLocation();
  const getDefaultSelectedKey = useCallback(
    (pathname) => {
      if (pathname === "/") {
        return "1";
      }

      if (
        pathname === "/matching"
      ) {
        return "2";
      }
      if (pathname === "/session") {
        return "3";
      }
    },
    []
  );

  return (
    <Header style={{ minWidth: "100vh" }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={getDefaultSelectedKey(location.pathname)}
      >
        <Menu.Item key="1">
          <span> Home </span>
          <Link to="/" />
        </Menu.Item>
        <Menu.Item key="2">
          Matching
          <Link to="/matching" />
        </Menu.Item>
        <Menu.Item key="3">
          Session
          <Link to="/session" />
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Header;
