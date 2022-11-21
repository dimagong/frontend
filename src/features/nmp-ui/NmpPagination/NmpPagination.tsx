import React from "react";
import type { FC } from "react";
import classnames from "classnames";
import { Pagination } from "antd";
import type { PaginationProps } from "antd";

type NmpPaginationProps = PaginationProps;

export const NmpPagination: FC<NmpPaginationProps> = (props) => {
  const { className, ...paginationProps } = props;

  const classes = classnames("nmp-pagination", className);

  return <Pagination {...paginationProps} className={classes} />;
};
