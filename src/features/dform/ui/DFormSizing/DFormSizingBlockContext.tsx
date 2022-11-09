import type { FC, ReactNode } from "react";
import React, { useMemo, useState, useContext, useCallback, createContext } from "react";

import { devWarning } from "features/common";

import { DformBlockSizeTypes } from "../../data/models";
import { DFormSizingPrivateBlock } from "./DFormSizingPrivateBlock";

type DformSizingBlockData = { blockSize?: DformBlockSizeTypes };

type DformSizingBlockContextValue = {
  registerBlock: (blockData: DformSizingBlockData) => void;
};

const context = createContext<DformSizingBlockContextValue>({
  registerBlock: () => devWarning("Can't reach required context."),
});

type DFormSizingBlockProps = {
  children?: ReactNode;
};

const Provider: FC<DFormSizingBlockProps> = (props) => {
  const [blockSize, setBlockSize] = useState(() => DformBlockSizeTypes.Full);

  const registerBlock = useCallback((blockData: DformSizingBlockData) => {
    setBlockSize(blockData.blockSize ?? DformBlockSizeTypes.Full);
  }, []);

  const value: DformSizingBlockContextValue = useMemo(() => ({ registerBlock }), [registerBlock]);

  return (
    <context.Provider value={value}>
      <DFormSizingPrivateBlock blockSize={blockSize}>{props.children}</DFormSizingPrivateBlock>
    </context.Provider>
  );
};

export const DFormSizingBlockContext = {
  Provider,
  useContext: () => useContext(context),
  Consumer: context.Consumer,
};
