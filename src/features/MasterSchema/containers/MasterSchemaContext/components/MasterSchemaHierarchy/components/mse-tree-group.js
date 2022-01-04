import { noop } from "lodash/fp";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Collapse, Fade } from "reactstrap";
import { AddBox, AddSharp, RemoveSharp } from "@material-ui/icons";

import { useToggle } from "hooks/use-toggle";
import { stopPropagation } from "utility/event-decorators";
import { useOutsideClick, useOutsideFocus } from "hooks/use-outside-event";

import MSETreeNode from "./mse-tree-node";

const getMarkIconAriaLabel = (expanded) => `${expanded ? "Collapse" : "Expand"} category.`;

const MSETreeGroup = (props) => {
  const {
    name,
    date,
    isLocked,
    expanded,
    onExpand,
    onCollapse,
    selected,
    onSelect,
    onFieldCreatorClick: onFieldCreatorClickProp,
    onGroupCreatorClick: onGroupCreatorClickProp,
    className,
    children,
  } = props;
  const popupRef = useRef();
  const [popup, togglePopup, setPopup] = useToggle(false);

  const hidePopup = () => setPopup(false);

  const onRetractableClick = () => (expanded ? onCollapse : onExpand)();

  const onFieldCreatorClick = (event) => {
    hidePopup();
    onFieldCreatorClickProp(event);
  };

  const onGroupCreatorClick = (event) => {
    hidePopup();
    onGroupCreatorClickProp(event);
  };

  useOutsideClick(popupRef, hidePopup);
  useOutsideFocus(popupRef, hidePopup);

  return (
    <MSETreeNode
      className={className}
      name={name}
      date={date}
      selected={selected}
      isLocked={isLocked}
      prepend={
        <div className="ms-elements__mark-icon d-flex justify-content-center align-items-center">
          <button
            type="button"
            className="ms-elements__retractable d-flex justify-content-center align-items-center"
            onClick={stopPropagation(onRetractableClick)}
            aria-label={getMarkIconAriaLabel(expanded)}
          >
            {expanded ? <RemoveSharp fontSize={"inherit"} /> : <AddSharp fontSize={"inherit"} />}
          </button>
        </div>
      }
      append={
        <div ref={popupRef}>
          <button
            type="button"
            className="ms-elements__popup-accessor"
            aria-label="Create element or category"
            onClick={stopPropagation(togglePopup)}
          >
            <AddBox fontSize={"inherit"} />
          </button>

          <Fade
            className="ms-elements__popup bg-white d-flex justify-content-center flex-column position-absolute"
            in={popup}
            mountOnEnter
            unmountOnExit
          >
            <button
              type="button"
              className="ms-elements__node-creator"
              aria-label="Create category"
              onClick={stopPropagation(onGroupCreatorClick)}
            >
              Category
            </button>
            <button
              type="button"
              className="ms-elements__node-creator"
              aria-label="Create element"
              onClick={stopPropagation(onFieldCreatorClick)}
            >
              Element
            </button>
          </Fade>
        </div>
      }
      onSelect={onSelect}
    >
      <Collapse isOpen={expanded} mountOnEnter unmountOnExit aria-expanded={expanded.toString()}>
        {children}
      </Collapse>
    </MSETreeNode>
  );
};

MSETreeGroup.defaultProps = {
  onExpand: noop,
  onCollapse: noop,
  onSelect: noop,
  onFieldCreatorClick: noop,
  onGroupCreatorClick: noop,
};

MSETreeGroup.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isLocked: PropTypes.bool.isRequired,

  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,

  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onFieldCreatorClick: PropTypes.func,
  onGroupCreatorClick: PropTypes.func,

  className: PropTypes.string,
  children: PropTypes.node,
};

export default MSETreeGroup;
