import { DformBlockSizeTypes } from "../../data/models";

export const getColSpanByBlockSizeType = (sizeType: DformBlockSizeTypes) => {
  switch (sizeType) {
    case DformBlockSizeTypes.Full:
      return 24;
    case DformBlockSizeTypes.Half:
      return 12;
  }
};
