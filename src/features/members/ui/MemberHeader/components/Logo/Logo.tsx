import "./styles.scss";

import React, { FC } from "react";

export const Logo: FC<Props> = ({ src, organizationName }) => {
  return <img className="logo" src={src} alt={organizationName} />;
};

export type Props = {
  src: string;
  organizationName: string;
};
