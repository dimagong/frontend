import "./styles.scss";

import React, { FC } from "react";

import { Button } from "antd";

interface IProps {
  style?: object;
  disabled?: boolean;
  loading?: boolean | { delay?: number };
  size?: "middle" | "large" | "small";
  type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default";
  onClick?: () => any;
  children?: any;
  buttonType?: "base" | "transparent" | "default";
}

const classFn = (btnType: string): string => {
  let currentType = "";
  switch (btnType) {
    case "base":
      currentType = "base-btn";
      break;
    case "transparent":
      currentType = "transparent-btn";
      break;
    case "default":
      currentType = "default-btn";
      break;
    default:
      break;
  }
  return currentType;
};

const NpmButton: FC<IProps> = (props: IProps) => {
  const { disabled, loading, size = "middle", buttonType = "base", ...rest } = props;

  return (
    <Button disabled={disabled} loading={loading} size={size} {...rest} className={classFn(buttonType)}>
      {props.children}
    </Button>
  );
};

// NpmButton.defaultProps = {
//   disabled: false,
//   size: "middle",
//   type: "primary",
//   style: { backgroundColor: "#22776D", borderColor: "#22776D" },
//   onClick: () => {},
// };

// NpmButton.propTypes = {
//   style: PropTypes.object,
//   disabled: PropTypes.bool,
//   size: PropTypes.oneOf(["middle", "large", "small"]),
//   type: PropTypes.oneOf(["primary", "ghost", "dashed", "link", "text", "default"]),
//   onClick: PropTypes.func,
// };

export default NpmButton;
