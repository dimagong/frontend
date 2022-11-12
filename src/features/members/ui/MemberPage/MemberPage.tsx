import "assets/styles/new_index.scss";
import "./styles.scss";

import React from "react";
import type { FC } from "react";

import { NmpButton } from "features/nmp-ui";

export const MemberPage: FC = () => {
  return (
    <div>
      <h1>MemberPage</h1>
      <NmpButton type="nmp-primary">Click me</NmpButton>
    </div>
  );
};
