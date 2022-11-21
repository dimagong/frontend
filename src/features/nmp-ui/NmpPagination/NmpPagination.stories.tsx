import React from "react";
import type { PaginationProps } from "antd";

import { NmpPagination } from "./NmpPagination";

const itemRender: PaginationProps["itemRender"] = (_, type, originalElement) => {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
};

const storySettings = {
  title: "NMP/Pagination",
  component: NmpPagination,
  argTypes: {
    total: {
      name: "total",
      type: { name: "number" },
      defaultValue: 50,
    },
    defaultCurrent: {
      name: "defaultCurrent",
      type: { name: "number" },
      defaultValue: 1,
    },
    current: {
      name: "current",
      type: { name: "number" },
    },
    defaultPageSize: {
      name: "defaultPageSize",
      type: { name: "number" },
      defaultValue: 10,
    },
    pageSize: {
      name: "pageSize",
      type: { name: "number" },
    },
    disabled: {
      control: "boolean",
      defaultValue: false,
    },
    showSizeChanger: {
      control: "boolean",
      defaultValue: false,
    },
    simple: {
      control: "boolean",
    },
    size: {
      options: ["default", "small"],
      control: { type: "select" },
    },
    itemRender: {
      name: "itemRender",
      type: { name: "object", required: false },
    },
  },
};

export default storySettings;

const Template = (props: any) => <NmpPagination {...props} />;

export const Base = Template.bind({});

export const Long = Template.bind({});

export const Disabled = Template.bind({});

export const SizeChanger = Template.bind({});

export const ChangedRender = Template.bind({});

Disabled.args = {
  disabled: true,
};

Long.args = {
  total: 500,
};

SizeChanger.args = {
  total: 500,
  showSizeChanger: true,
};

ChangedRender.args = {
  itemRender: itemRender,
};
