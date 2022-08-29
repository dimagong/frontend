import "./styles.scss";

import React from "react";

import { Popover } from "antd";
import PropTypes from "prop-types";

const NpmPopover = (props) => {
  const text = <span>{props.title}</span>;

  const content = (
    <div>
      {props.content?.length ? (
        props.content.map((item, idx) => (
          <div className="popover_content" onClick={(e) => props.onClick(e)} key={idx}>
            <div className="content_name" name={item.name}>
              {item.name}
            </div>
            <div className={`content_type ${item.type}`}>{item.type}</div>
          </div>
        ))
      ) : (
        <p>no content</p>
      )}
    </div>
  );
  return (
    <>
      <Popover placement="right" title={text} content={content} trigger="click" className="popover">
        {props.children}
      </Popover>
    </>
  );
};

NpmPopover.defaultProps = {
  placement: "right",
  content: [],
  title: "No title",
  onClick: (e) => {
    // console.log("NpmPopover.defaultProps event", e.currentTarget);
  },
  trigger: "click",
};

NpmPopover.propTypes = {
  content: PropTypes.array,
  title: PropTypes.string,
  onClick: PropTypes.func,
  placement: PropTypes.oneOf([
    "right",
    "top",
    "left",
    "bottom ",
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
    "leftTop",
    "leftBottom",
    "rightTop",
    "rightBottom",
  ]),
  trigger: PropTypes.oneOf(["hover", "focus", "click", "contextMenu", PropTypes.array]),
};

export default NpmPopover;
