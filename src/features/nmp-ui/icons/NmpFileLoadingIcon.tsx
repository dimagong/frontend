import React from "react";
import type { FC } from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type Props = Partial<CustomIconComponentProps>;

const CustomIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 21 20">
      <path
        fill="currentColor"
        d="M4.433 17.74a9.95 9.95 0 0 0 5.32 2.21v-2.02a7.941 7.941 0 0 1-3.9-1.62l-1.42 1.43ZM2.823 11H.803c.2 2.01 1 3.84 2.21 5.32l1.43-1.42a7.94 7.94 0 0 1-1.62-3.9Zm1.62-5.9-1.43-1.43a9.981 9.981 0 0 0-2.21 5.32h2.02a7.945 7.945 0 0 1 1.62-3.89Zm5.31-3.03V.05c-2.01.2-3.84 1-5.32 2.21l1.43 1.43c1.1-.86 2.43-1.44 3.89-1.62Zm-2.59 9.34 2.59-2.58V15h2V8.83l2.59 2.59 1.41-1.42-5-5-5 5 1.41 1.41Zm4.59-9.34V.05c5.05.5 9 4.76 9 9.95 0 5.19-3.95 9.45-9 9.95v-2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93Z"
      />
    </svg>
  );
};

export const NmpFileLoadingIcon: FC<Props> = (props) => {
  return <Icon component={CustomIcon} {...props} />;
};
