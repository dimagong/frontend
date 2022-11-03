import React, { useState } from "react";
import type { FC, MouseEventHandler, ReactNode } from "react";

import { NmpCol, NmpRow } from "features/nmp-ui";

import { DFormElementTypes } from "../../types";
import { DFormAddElementButton } from "./DFormAddElementButton";

const elementNames = {
  [DFormElementTypes.Block]: "Add new element",
  [DFormElementTypes.Group]: "Add new group",
};

type Props = {
  elementType: DFormElementTypes.Block | DFormElementTypes.Group;
  onBlockAdd?: MouseEventHandler;
  onGroupAdd?: MouseEventHandler;
  isHoverable?: boolean;
  children?: ReactNode;
};

export const DFormAddElement: FC<Props> = (props) => {
  const { elementType, onBlockAdd, onGroupAdd, isHoverable = false, children } = props;

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => setIsHover(true);
  const onMouseLeave = () => setIsHover(false);

  // if (elementType === "both") {
  //   return (
  //     <NmpRow
  //       onMouseEnter={isHoverable ? onMouseEnter : undefined}
  //       onMouseLeave={isHoverable ? onMouseLeave : undefined}
  //     >
  //       {children ? <NmpCol span="24">{children}</NmpCol> : null}
  //
  //       {(isHoverable && isHover) || !isHoverable ? (
  //         <NmpCol span="24">
  //           <NmpRow gutter={20}>
  //             <NmpCol span="12">
  //               <DFormAddElementButton elementName={elementNames[DFormElementTypes.Block]} onClick={onBlockAdd} />
  //             </NmpCol>
  //             <NmpCol span="12">
  //               <DFormAddElementButton elementName={elementNames[DFormElementTypes.Group]} onClick={onGroupAdd} />
  //             </NmpCol>
  //           </NmpRow>
  //         </NmpCol>
  //       ) : null}
  //     </NmpRow>
  //   );
  // }

  const onClick = elementType === DFormElementTypes.Group ? onGroupAdd : onBlockAdd;

  return (
    <NmpRow onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} align="middle">
      {children ? <NmpCol span="22">{children}</NmpCol> : null}

      {(isHoverable && isHover) || !isHoverable ? (
        <NmpCol span={children ? 2 : 24}>
          <DFormAddElementButton elementName={elementNames[elementType]} onClick={onClick} />
        </NmpCol>
      ) : null}
    </NmpRow>
  );
};
