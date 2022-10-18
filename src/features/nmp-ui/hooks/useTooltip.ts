import { useState } from "react";

type TooltripType = [boolean, () => void, () => void];

export const useTooltip = (refElem: React.RefObject<HTMLDivElement>): TooltripType => {
  const [isOpenTooltip, onOpenTooltip] = useState(false);

  const hendleMouseOver = () => {
    if (refElem.current) {
      const { clientWidth: clientWidthLable, scrollWidth: scrollWidthLable } = refElem.current;
      const diffWidt = scrollWidthLable - clientWidthLable;
      if (diffWidt > 0) {
        onOpenTooltip(true);
      }
    }
  };

  const handleMouseOut = () => {
    onOpenTooltip(false);
  };
  return [isOpenTooltip, hendleMouseOver, handleMouseOut];
};
