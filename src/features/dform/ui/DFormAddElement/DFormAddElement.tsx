import React, { useState } from "react";
import type { FC, MouseEventHandler, ReactNode } from "react";

import { NmpCol, NmpRow } from "features/nmp-ui";

import { DformElementTypes } from "../../data/models";
import { DFormAddElementButton } from "./DFormAddElementButton";

const elementNames = {
  [DformElementTypes.Block]: "Add new element",
  [DformElementTypes.Group]: "Add new group",
};

type Props = {
  isVisible?: boolean;
  isHoverable?: boolean;
  elementType: DformElementTypes.Block | DformElementTypes.Group;
  onClick?: MouseEventHandler;
  children?: ReactNode;
};

export const DFormAddElement: FC<Props> = (props) => {
  const { isVisible = true, isHoverable = false, elementType, onClick, children } = props;

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => setIsHover(true);
  const onMouseLeave = () => setIsHover(false);

  const isButtonVisible = isVisible ? (isHoverable && isHover) || !isHoverable : false;

  return (
    <NmpRow
      align="middle"
      onMouseEnter={isHoverable ? onMouseEnter : undefined}
      onMouseLeave={isHoverable ? onMouseLeave : undefined}
    >
      {children ? <NmpCol span="24">{children}</NmpCol> : null}

      {isButtonVisible ? (
        <NmpCol span="24">
          <DFormAddElementButton elementName={elementNames[elementType]} onClick={onClick} />
        </NmpCol>
      ) : null}
    </NmpRow>
  );
};
