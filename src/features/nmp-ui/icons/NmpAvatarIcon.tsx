import React from "react";
import type { FC } from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type Props = Partial<CustomIconComponentProps>;

const CustomIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 31 30">
      <path
        fill="currentColor"
        d="M15.5 0C7.22 0 .5 6.72.5 15c0 8.28 6.72 15 15 15 8.28 0 15-6.72 15-15 0-8.28-6.72-15-15-15Zm0 6c2.895 0 5 2.105 5 5s-2.105 6-5 6-5-3.105-5-6 2.105-5 5-5Zm0 21c-3.045 0-6.435-.91-9-4 2.627-2.061 5.66-4 9-4s6.373 1.939 9 4c-2.565 3.09-5.955 4-9 4Z"
      />
    </svg>
  );
};

export const NmpAvatarIcon: FC<Props> = (props) => {
  return <Icon component={CustomIcon} {...props} />;
};
