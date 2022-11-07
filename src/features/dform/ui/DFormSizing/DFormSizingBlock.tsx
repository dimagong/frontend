import type { FC, ReactNode } from "react";
import React, { useLayoutEffect } from "react";

import { DFormBlockSizeTypes } from "../../types";
import { DFormSizingBlockContext } from "./DFormSizingBlockContext";

type DFormSizerBlockProps = {
  blockSize?: DFormBlockSizeTypes;
  children?: ReactNode;
};

export const DFormSizingBlock: FC<DFormSizerBlockProps> = (props) => {
  const { blockSize, children } = props;
  const { registerBlock } = DFormSizingBlockContext.useContext();

  useLayoutEffect(() => registerBlock({ blockSize }), [blockSize]);

  return children as any;
};
