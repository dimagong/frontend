import "./styles.scss";

import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { FC, MouseEventHandler } from "react";

type Props = {
  elementName: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const DFormAddElementButton: FC<Props> = (props) => {
  const { elementName, onClick } = props;

  return (
    <button className="dform-add-element" onClick={onClick}>
      <PlusOutlined className="dform-add-element__icon" />
      <div className="dform-add-element__name">{elementName}</div>
    </button>
  );
};
