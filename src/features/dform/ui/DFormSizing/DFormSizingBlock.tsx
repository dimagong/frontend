import type { FC, ReactNode } from "react";
import React, { useLayoutEffect } from "react";

import { DformBlockSizeTypes } from "../../data/models";
import { DFormSizingBlockContext } from "./DFormSizingBlockContext";

type DFormSizerBlockProps = {
  blockSize?: DformBlockSizeTypes;
  children?: ReactNode;
};

export const DFormSizingBlock: FC<DFormSizerBlockProps> = (props) => {
  const { blockSize, children } = props;
  const { registerBlock } = DFormSizingBlockContext.useContext();

  useLayoutEffect(() => registerBlock({ blockSize }), [blockSize]);

  return children as any;
};
