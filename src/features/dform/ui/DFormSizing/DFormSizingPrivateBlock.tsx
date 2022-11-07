import React from "react";
import type { FC, ReactNode } from "react";

import { NmpCol } from "features/nmp-ui";
import { DFormBlockSizeTypes } from "../../types";
import { getColSpanByBlockSizeType } from "./getColSpanByBlockSizeType";

type DFormSizingPrivateBlock = {
  blockSize: DFormBlockSizeTypes;
  children?: ReactNode;
};

export const DFormSizingPrivateBlock: FC<DFormSizingPrivateBlock> = (props) => {
  const { blockSize, children } = props;
  const span = getColSpanByBlockSizeType(blockSize);

  return <NmpCol span={span}>{children}</NmpCol>;
};
