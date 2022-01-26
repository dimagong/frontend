import React from "react";
import moment from "moment";
import { noop } from "lodash/fp";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Lock } from "@material-ui/icons";

import { stopPropagation } from "utility/event-decorators";

const MSHTreeNode = (props) => {
  const {
    name,
    date,
    selected,
    isLocked,
    applicationsCount,
    versionsCount,
    onSelect,
    prepend,
    append,
    className: propClassName,
    children,
  } = props;
  const className = classNames("tree-hierarchy__node", propClassName, { "tree-hierarchy__node--selected": selected });

  return (
    <li className={className} onClick={stopPropagation(onSelect)}>
      <div className="tree-hierarchy__node-content d-flex align-items-center">
        {prepend}

        <div className="tree-hierarchy__name">{name}</div>

        {append}

        <div className="d-flex align-items-center ml-auto">
          {applicationsCount == null ? null : (
            <div className="tree-hierarchy__icon position-relative px-1">
              <span className="tree-hierarchy__icon-count position-absolute">{applicationsCount}</span>
              <svg width="16" height="21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" transform="translate(.756 .586)" d="M0 0h14.91v19.828H0z" />
                  </clipPath>
                </defs>
                <g clipPath="url(#a)" fill="#7367F0">
                  <path d="M12.3.586H.757v19.828H8.21v-1.657H2.412V2.243h8.284v2.485h3.313v8.283h1.656V3.848L12.302.586Z" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.177 14.162h-.316l-.442 2.071h-1.288c-1.234 0-2.265.76-2.54 2.053-.314 1.463.736 2.128 1.638 2.128h3.074l1.362-6.253h-1.488Zm-1.401 4.979h-.884c-.442 0-.736-.38-.608-.855.11-.476.571-.856 1.031-.856h.847l-.387 1.71Z"
                  />
                </g>
              </svg>
            </div>
          )}

          {versionsCount == null ? null : (
            <div className="tree-hierarchy__icon position-relative px-1">
              <span className="tree-hierarchy__icon-count position-absolute">{versionsCount}</span>
              <svg width="24" height="21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.456.586c-5.375 0-9.747 4.307-9.877 9.669v.247H.71l4.345 4.709 4.225-4.709H6.05v-.247c.128-3.994 3.394-7.189 7.405-7.189 4.095 0 7.414 3.33 7.414 7.436 0 4.107-3.32 7.437-7.414 7.437a7.372 7.372 0 0 1-4.385-1.443l-1.7 1.818a9.831 9.831 0 0 0 6.085 2.102c5.46 0 9.883-4.438 9.883-9.914 0-5.475-4.424-9.916-9.883-9.916Zm-1.21 3.87v6.046a1.22 1.22 0 0 0 .355.855l3.87 3.87a5.62 5.62 0 0 0 .951-.76l-2.757-2.755V4.457h-2.418Z"
                  fill="#7367F0"
                />
              </svg>
            </div>
          )}

          {isLocked ? (
            <div className="tree-hierarchy__icon px-1">
              <Lock fontSize="inherit" />
            </div>
          ) : null}

          <div className="tree-hierarchy__date">
            <div>{moment(date).format("DD.MM.YYYY")}</div>
            <div>{moment(date).format("HH:MM")}</div>
          </div>
        </div>
      </div>
      {children}
    </li>
  );
};

MSHTreeNode.defaultProps = {
  onSelect: noop,
  selected: false,
};

MSHTreeNode.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,

  isLocked: PropTypes.bool.isRequired,
  applicationsCount: PropTypes.number,
  versionsCount: PropTypes.number,

  selected: PropTypes.bool,
  onSelect: PropTypes.func,

  prepend: PropTypes.node,
  append: PropTypes.node,

  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSHTreeNode;
