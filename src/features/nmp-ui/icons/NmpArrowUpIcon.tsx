import React from "react";
import type { FC } from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type Props = Partial<CustomIconComponentProps>;

const CustomIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 19 12">
      <path
        fill="currentColor"
        d="M8.91 1.054.656 11.62a.187.187 0 0 0 .148.302h1.811a.379.379 0 0 0 .296-.143L9.5 3.342l6.588 8.437c.07.091.18.143.296.143h1.811c.157 0 .244-.18.148-.302L10.09 1.054a.75.75 0 0 0-1.182 0Z"
      />
    </svg>
  );
};

export const NmpArrowUpIcon: FC<Props> = (props) => {
  return <Icon component={CustomIcon} {...props} />;
};
