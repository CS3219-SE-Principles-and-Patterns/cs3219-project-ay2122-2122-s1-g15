import { Layout, Menu, Avatar } from "antd";
import React, { useCallback, useContext } from "react";
import Auth from "../util/Authentication";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../util/UserProvider";

const Header = () => {
  const { Header } = Layout;
  const { SubMenu } = Menu;

  let location = useLocation();
  const getDefaultSelectedKey = useCallback(
    (pathname) => {
      if (pathname === "/") {
        return "1";
      }
      // if (pathname === "/matching") {
      //   return "2";
      // }
      if (pathname === "/session") {
        return "3";
      }
    },
    // eslint-disable-next-line
    [location]
  );

  const userContext = useContext(UserContext);
  const loggedIn = userContext?.user?.data?.email != null;

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
        {/* <Menu.Item key="2">
          Matching
          <Link to="/matching" />
        </Menu.Item> */}
        <Menu.Item key="3">
          Session
          <Link to="/session" />
        </Menu.Item>
        {loggedIn && (
          <SubMenu
            key="SubMenu"
            style={{ marginLeft: "auto" }}
            icon={
              <>
                <Avatar
                  style={{
                    color: "#fff0f6",
                    backgroundColor: "#b87c0a",
                  }}
                >
                  {userContext?.user?.data?.name?.split(/\s+/)?.[0]}
                </Avatar>
              </>
            }
          >
            <Menu.Item
              key="4"
              onClick={() => {
                Auth.signOut();
                userContext.setUser(null);
              }}
            >
              Logout
              <Link to="/" />
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </Header>
  );
};

export default Header;
