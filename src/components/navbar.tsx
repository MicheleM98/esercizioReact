import React, { useState } from "react";
import { UserOutlined, BookOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const items: MenuProps["items"] = [
  {
    label: "Utenti",
    key: "users",
    icon: <UserOutlined />,
  },
  {
    label: "Libri",
    key: "articles",
    icon: <BookOutlined />,
  },
];

const Navbar: React.FC = () => {
  const [current, setCurrent] = useState("users");

  const navigate = useNavigate();

  console.log("current", current);
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Navbar;
