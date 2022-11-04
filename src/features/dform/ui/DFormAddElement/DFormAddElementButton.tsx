import "./styles.scss";

import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { FC, MouseEventHandler } from "react";

type Props = {
  elementName: string;
  onClick?: MouseEventHandler;
};

export const DFormAddElementButton: FC<Props> = (props) => {
  const { elementName, onClick } = props;

  return (
    <div className="dform-add-element">
      <button className="dform-add-element__button" onClick={onClick}>
        <PlusOutlined className="dform-add-element__icon" />
        <span className="dform-add-element__name">{elementName}</span>
      </button>
    </div>
  );
};
