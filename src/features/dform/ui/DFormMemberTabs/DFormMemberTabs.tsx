import "./styles.scss";

import { Tabs } from "antd";
import classnames from "classnames";
import type { TabsProps } from "antd";
import React, { useState } from "react";
import type { FC, Key, CSSProperties } from "react";

import { DFormMemberTab } from "./DFormMemberTab";
import type { DFormMemberTabProps } from "./DFormMemberTab";
import { DFormMemberTabLabel } from "./DFormMemberTabLabel";

type TabProps = Unpack<TabsProps["items"]> &
  Omit<DFormMemberTabProps, "children" | "isActive"> & {
    isHidden?: boolean;
  };

const getTabPropsByNodeKey = (items: TabProps[] = [], key: Key | null) => {
  return items.find((item) => item.key === key)!;
};

export type DFormMemberTabsProps = {
  items?: TabProps[];
  activeKey?: string;
  defaultActiveKey?: string;
  onTabClick?: TabsProps["onTabClick"];
  style?: CSSProperties;
  className?: string;
};

export const DFormMemberTabs: FC<DFormMemberTabsProps> = (props) => {
  const {
    items = [],
    activeKey: propActiveKey,
    defaultActiveKey: propDefaultActiveKey,
    onTabClick: propOnTabClick,
    style,
    className,
  } = props;

  const isControlled = propActiveKey !== undefined;

  const [internalActiveKey, setInternalActiveKey] = useState(() =>
    isControlled ? items[0]?.key : propDefaultActiveKey
  );

  const onTabClick = (activeKey, event) => {
    if (!isControlled) {
      setInternalActiveKey(activeKey);
    }

    if (propOnTabClick) {
      propOnTabClick(activeKey, event);
    }
  };

  const activeKey = isControlled ? propActiveKey : internalActiveKey;

  return (
    <Tabs
      items={items.map((item) => ({
        ...item,
        label: (
          <DFormMemberTabLabel
            progress={item.progress}
            isActive={item.key === activeKey}
            isRequired={item.isRequired}
            children={item.label}
          />
        ),
      }))}
      activeKey={activeKey}
      renderTabBar={(tabBarProps, DefaultTabBar) => (
        <DefaultTabBar {...tabBarProps}>
          {(node) => {
            const isActive = node.key === activeKey;
            const props = getTabPropsByNodeKey(items, node.key);

            if (props.isHidden) {
              return null as any;
            }

            return (
              <DFormMemberTab
                isActive={isActive}
                isRequired={props.isRequired}
                isViewed={props.isViewed}
                progress={props.progress}
                children={node}
              />
            );
          }}
        </DefaultTabBar>
      )}
      tabPosition="left"
      onTabClick={onTabClick}
      style={style}
      className={classnames("dform-member-tabs", className)}
    />
  );
};
