import "./styles.scss";

import React from "react";
import type { FC } from "react";
import classnames from "classnames";
import { Tabs, TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { NmpButton } from "features/nmp-ui";

import { DFormTab } from "./DFormTab";
import { DFormDroppable } from "../DFormDroppable";
import { DFormDraggable, DFormDragHandle } from "../DFormDraggable";
import { createDformTabKey, extractDformTabKey } from "./dformTabKey";
import { DformElementTypes, DformSectionId } from "../../data/models";

export type DFormTabsProps = Pick<TabsProps, "items"> & {
  isDraggable?: boolean;
  selectedElementId?: string;
  onTabClick?: (tabId: DformSectionId) => void;
  onTabCreate?: () => void;
};

export const DFormTabs: FC<DFormTabsProps> = (props) => {
  const { items, isDraggable, selectedElementId, onTabClick, onTabCreate } = props;

  const tabItems = Array.isArray(items)
    ? items.map((item, index) => ({
        ...item,
        key: createDformTabKey(item.key, index),
        label: (
          <DFormTab
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
  const classes = classnames("dform-tabs", { "dform-tabs--empty": isEmpty });

  return (
    <Tabs
      items={tabItems}
      tabPosition="left"
      destroyInactiveTabPane
      className={classes}
      renderTabBar={(tabBarProps, DefaultTabBar) => (
        <div>
          <DFormDroppable droppableId="section" droppableType={DformElementTypes.Section} isDraggable={isDraggable}>
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
                  const { key, index } = extractDformTabKey(node.key as string);

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
  );
};
