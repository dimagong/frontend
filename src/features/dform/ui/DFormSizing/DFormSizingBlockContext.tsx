import type { FC, ReactNode } from "react";
import React, { useMemo, useState, useContext, useCallback, createContext } from "react";

import { devWarning } from "features/common";

import { DFormBlockSizeTypes } from "../../types";
import { DFormSizingPrivateBlock } from "./DFormSizingPrivateBlock";

type DFormSizingBlockData = { blockSize?: DFormBlockSizeTypes };

type DFormSizingBlockContext = {
  registerBlock: (blockData: DFormSizingBlockData) => void;
};

const dformSizingBlockContext = createContext<DFormSizingBlockContext>({
  registerBlock: () => devWarning("Can't reach required context."),
});

type DFormSizingBlockProps = {
  children?: ReactNode;
};

const Provider: FC<DFormSizingBlockProps> = (props) => {
  const [blockSize, setBlockSize] = useState(() => DFormBlockSizeTypes.Full);

  const registerBlock = useCallback((blockData: DFormSizingBlockData) => {
    setBlockSize(blockData.blockSize ?? DFormBlockSizeTypes.Full);
  }, []);

  const value: DFormSizingBlockContext = useMemo(() => ({ registerBlock }), [registerBlock]);

  return (
    <dformSizingBlockContext.Provider value={value}>
      <DFormSizingPrivateBlock blockSize={blockSize}>{props.children}</DFormSizingPrivateBlock>
    </dformSizingBlockContext.Provider>
  );
};

export const DFormSizingBlockContext = {
  Provider,
  useContext: () => useContext(dformSizingBlockContext),
  Consumer: dformSizingBlockContext.Consumer,
};
