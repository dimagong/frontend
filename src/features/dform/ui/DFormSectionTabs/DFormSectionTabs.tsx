import "./styles.scss";

import React from "react";
import type { FC } from "react";
import classnames from "classnames";
import { Tabs, TabsProps } from "antd";

import { DFormElementTypes } from "../../types";
import { DFormDroppable } from "../DFormDroppable";
import { DFormSectionTab } from "./DFormSectionTab";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";
import { PlusOutlined } from "@ant-design/icons";
import { NmpButton } from "../../../nmp-ui";

type Item = Unpack<DFormSectionTabsProps["items"]>;

const makeIndexedKey = (key: string, index: number) => `${key}/${index}`;

const getIndexedKey = (indexedKey: string) => {
  const [key, index] = indexedKey.split("/");
  return { key, index: Number(index) };
};

const labelWithIcon = (item: Item, index: number): Item => ({
  ...item,
  key: makeIndexedKey(item.key, index),
  label: <DFormSectionTab tabIndex={index} children={item.label} />,
});

export type DFormSectionTabsProps = Pick<TabsProps, "items"> & {
  isDraggable?: boolean;
  onCreate?: () => void;
};

export const DFormSectionTabs: FC<DFormSectionTabsProps> = (props) => {
  const { items, isDraggable, onCreate } = props;

  const tabItems = Array.isArray(items) ? items.map(labelWithIcon) : [];
  const isEmpty = tabItems.length === 0;
  const classes = classnames("dform-section-tabs", { "dform-section-tabs--empty": isEmpty });

  return (
    <>
      <Tabs
        items={tabItems}
        tabPosition="left"
        destroyInactiveTabPane
        className={classes}
        renderTabBar={(tabBarProps, DefaultTabBar) => (
          <DFormDroppable droppableId="section" droppableType={DFormElementTypes.Section} isDraggable={isDraggable}>
            <DefaultTabBar {...tabBarProps}>
              {(node) => {
                const { key, index } = getIndexedKey(node.key as string);

                return (
                  <DFormDraggable draggableId={key} draggableIndex={index} isDraggable={isDraggable}>
                    {(dragHandleProps) => (
                      <DFormDragHandle {...dragHandleProps} isMiddle isDraggable={isDraggable}>
                        {node}
                      </DFormDragHandle>
                    )}
                  </DFormDraggable>
                );
              }}
            </DefaultTabBar>

            <div className="dform-section-tabs__actions">
              <NmpButton type="text" icon={<PlusOutlined />} iconRight onClick={onCreate}>
                New section
              </NmpButton>
            </div>
          </DFormDroppable>
        )}
      />
    </>
  );
};
