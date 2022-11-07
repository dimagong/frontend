import "./styles.scss";

import React from "react";
import type { FC } from "react";
import classnames from "classnames";
import { Tabs, TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { Droppable } from "react-beautiful-dnd";

import { NmpButton } from "features/nmp-ui";

import { DFormElementTypes } from "../../types";
import { DFormDroppable } from "../DFormDroppable";
import { DFormSectionTab } from "./DFormSectionTab";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";

const makeIndexedKey = (key: string, index: number) => `${key}/${index}`;

const getIndexedKey = (indexedKey: string) => {
  const [key, index] = indexedKey.split("/");
  return { key, index: Number(index) };
};

export type DFormSectionTabsProps = Pick<TabsProps, "items"> & {
  isDraggable?: boolean;
  selectedElementId?: string;
  onTabClick?: (tabId: string) => void;
  onTabCreate?: () => void;
};

export const DFormSectionTabs: FC<DFormSectionTabsProps> = (props) => {
  const { items, isDraggable, selectedElementId, onTabClick, onTabCreate } = props;

  const tabItems = Array.isArray(items)
    ? items.map((item, index) => ({
        ...item,
        key: makeIndexedKey(item.key, index),
        label: (
          <DFormSectionTab
            tabId={item.key}
            isSelected={selectedElementId === item.key}
            tabIndex={index}
            children={item.label}
            onClick={onTabClick}
          />
        ),
      }))
    : [];

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
          <div>
            <DFormDroppable droppableId="section" droppableType={DFormElementTypes.Section} isDraggable={isDraggable}>
              {(placeholder) => (
                <DefaultTabBar
                  {...tabBarProps}
                  extra={
                    <>
                      {placeholder}
                      <NmpButton type="text" icon={<PlusOutlined />} iconRight onClick={onTabCreate}>
                        New section
                      </NmpButton>
                    </>
                  }
                >
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
              )}
            </DFormDroppable>
          </div>
        )}
      />
    </>
  );
};
