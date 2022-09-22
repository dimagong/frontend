import "./styles.scss";

import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

interface IProps {
  groupItems: { [key: string]: any[] }[];
  selectOption: Function;
}

const NpmMenu: React.FC<IProps> = ({ groupItems, selectOption }: IProps) => {
  const [openKeys, setOpenKeys] = useState(["applications"]);

  const rootSubmenuKeys = ["applications", "surveys"];

  const items: MenuItem[] = [
    getItem(
      "Applications",
      "applications",
      null,
      groupItems[0].applications.map((el) => {
        return getItem(el.title, `${el.id}`);
      })
    ),
    getItem(
      "Surveys",
      "surveys",
      null,
      groupItems[1].surveys.map((el) => {
        return getItem(el.title, `${el.id}`);
      })
    ),
    //   [ getItem("Option 1", "1"),
    //   getItem("Option 2", "2"),
    //   getItem("Option 3", "3"),
    //   getItem("Option 4", "4"),
    // ]),
    // getItem("Surveys", "sub2", <AppstoreOutlined />, [
    //   getItem("Option 5", "5"),
    //   getItem("Option 6", "6"),
    //   getItem("Submenu", "sub3", null, [getItem("Option 7", "7"), getItem("Option 8", "8")]),
    // ]),
    // getItem("Navigation Three", "sub4", <SettingOutlined />, [
    //   getItem("Option 9", "9"),
    //   getItem("Option 10", "10"),
    //   getItem("Option 11", "11"),
    //   getItem("Option 12", "12"),
    // ]),
  ];

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Menu
      mode="horizontal"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{ width: 256 }}
      items={items}
      className="npm-menu"
      onSelect={({ keyPath }) => selectOption(keyPath)}
    />
  );
};

export default NpmMenu;
