import { useState } from "react";

export const useTooltip = (refElem) => {
  const [isOpenTooltip, onOpenTooltip] = useState(false);

  const hendleMouseOver = () => {
    const { clientWidth: clientWidthLable, scrollWidth: scrollWidthLable } = refElem.current;
    const diffWidt = scrollWidthLable - clientWidthLable;
    if (diffWidt > 0) {
      onOpenTooltip(true);
    }
  };

  const handleMouseOut = () => {
    onOpenTooltip(false);
  };
  return [isOpenTooltip, hendleMouseOver, handleMouseOut];
};
