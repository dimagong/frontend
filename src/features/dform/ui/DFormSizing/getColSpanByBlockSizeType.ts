import { DFormBlockSizeTypes } from "../../types";

export const getColSpanByBlockSizeType = (sizeType: DFormBlockSizeTypes) => {
  switch (sizeType) {
    case DFormBlockSizeTypes.Full:
      return 24;
    case DFormBlockSizeTypes.Half:
      return 12;
  }
};
