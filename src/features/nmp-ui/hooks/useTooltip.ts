import { useState } from "react";
import type { RefObject } from "react";

type TooltipType = [boolean, () => void, () => void];

export const useTooltip = (refElem: RefObject<HTMLElement>): TooltipType => {
  const [isOpenTooltip, onOpenTooltip] = useState(false);

  const handleMouseOver = () => {
    if (refElem.current) {
      const { clientWidth: clientWidthLabel, scrollWidth: scrollWidthLabel } = refElem.current;
      const diffWidth = scrollWidthLabel - clientWidthLabel;
      if (diffWidth > 0) {
        onOpenTooltip(true);
      }
    }
  };

  const handleMouseOut = () => {
    onOpenTooltip(false);
  };
  return [isOpenTooltip, handleMouseOver, handleMouseOut];
};
