import "./styles.scss";

import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { FC, MouseEventHandler } from "react";

import { NpmTooltip } from "features/nmp-ui";

type Props = {
  elementName: string;
  onClick?: MouseEventHandler;
};

export const DFormAddElementButton: FC<Props> = (props) => {
  const { elementName, onClick } = props;

  return (
    <div className="dform-add-element">
      <NpmTooltip title={elementName}>
        <button className="dform-add-element__button" onClick={onClick}>
          <PlusOutlined className="dform-add-element__icon" />
        </button>
      </NpmTooltip>
    </div>
  );
};
