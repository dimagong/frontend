import "./styles.scss";

import React from "react";
import type { FC, ReactNode } from "react";

import Fields from "../../Components/Fields";
import { ButtonAddItem } from "../ButtonAddItem";

type Props = {
  groupId: string;
  groupName: string;
  children: ReactNode;
};

export const DFormBaseGroup: FC<Props> = (props) => {
  const { groupId, groupName, children } = props;

  return (
    <>
      <h2 className="dform-group__title">{groupName}</h2>

      <div className="group-content row mr-0 ml-0">{children}</div>
    </>
  );
};
