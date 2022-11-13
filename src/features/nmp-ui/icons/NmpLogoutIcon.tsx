import React from "react";
import type { FC } from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type Props = Partial<CustomIconComponentProps>;

const CustomIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 14 14">
      <path
        fill="currentColor"
        d="M8.222.778h-7.11a.889.889 0 0 0-.89.889v10.666a.889.889 0 0 0 .89.89h7.11a.889.889 0 0 0 .89-.89V9.667H4.946a.444.444 0 0 1 0-.89H9.11v-7.11a.889.889 0 0 0-.889-.89Z"
      />
      <path
        fill="currentColor"
        d="M10.515 6.68a.444.444 0 0 0-.626.627l1.502 1.47h-2.28v.89h2.28L9.89 11.204a.445.445 0 1 0 .627.627l2.595-2.578-2.596-2.573Z"
      />
    </svg>
  );
};

export const NmpLogoutIcon: FC<Props> = (props) => {
  return <Icon component={CustomIcon} {...props} />;
};
