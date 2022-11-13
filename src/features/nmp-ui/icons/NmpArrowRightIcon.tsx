import React from "react";
import type { FC } from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type Props = Partial<CustomIconComponentProps>;

const CustomIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 8 12">
      <path
        fill="currentColor"
        d="M0 .187V1.36c0 .08.04.155.103.202L6.222 6 .103 10.439a.251.251 0 0 0-.103.202v1.171c0 .102.116.161.198.102l7.596-5.51a.499.499 0 0 0 0-.807L.198.087a.124.124 0 0 0-.198.1Z"
      />
    </svg>
  );
};

export const NmpArrowRightIcon: FC<Props> = (props) => {
  return <Icon component={CustomIcon} {...props} />;
};
