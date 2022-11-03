import React from "react";
import type { FC, ReactNode } from "react";

import { NmpCol } from "features/nmp-ui";

import { DFormBlockSizeTypes } from "../../types";

const getColSpanByBlockSizeType = (sizeType: DFormBlockSizeTypes) => {
  switch (sizeType) {
    case DFormBlockSizeTypes.Full:
      return 24;
    case DFormBlockSizeTypes.Half:
      return 12;
  }
};

type Props = {
  blockSize?: DFormBlockSizeTypes;
  children?: ReactNode;
};

export const DFormBlockSizer: FC<Props> = (props) => {
  const { blockSize = DFormBlockSizeTypes.Full, children } = props;
  const span = getColSpanByBlockSizeType(blockSize);

  return <NmpCol span={span}>{children}</NmpCol>;
};
