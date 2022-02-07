import { noop } from "lodash/fp";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Collapse, Fade } from "reactstrap";
import { AddBox, AddSharp, RemoveSharp } from "@material-ui/icons";

import { useToggle } from "hooks/use-toggle";
import { stopPropagation } from "utility/event-decorators";
import { useOutsideClick, useOutsideFocus } from "hooks/use-outside-event";

import MSHTreeNode from "components/TreeHierarchy/components/MSHTreeNode";

const getMarkIconAriaLabel = (expanded) => `${expanded ? "Collapse" : "Expand"} category.`;

const GeneralMSHTreeGroup = (props) => {
  const {
    name,
    date,
    index,
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
    <MSHTreeNode
      className={className}
      index={index}
      name={
        <div className="d-flex w-25" >
          <div className="tree-hierarchy__name pr-3 position-relative" title={name}>
            <div className="tree-hierarchy__name-text">{name}</div>
            <div className="position-absolute" style={{ right: "1rem", top: "50%", transform: "translateY(-50%)" }} ref={popupRef}>
              <button
                type="button"
                className="tree-hierarchy__popup-accessor d-flex justify-content-center align-items-center"
                aria-label="Create element or category"
                onClick={stopPropagation(togglePopup)}
              >
                <AddBox fontSize={"inherit"} />
              </button>

              <Fade
                className="tree-hierarchy__popup bg-white d-flex justify-content-center flex-column position-absolute"
                in={popup}
                mountOnEnter
                unmountOnExit
              >
                <button
                  type="button"
                  className="tree-hierarchy__node-creator"
                  aria-label="Create category"
                  onClick={stopPropagation(onGroupCreatorClick)}
                >
                  Category
                </button>
                <button
                  type="button"
                  className="tree-hierarchy__node-creator"
                  aria-label="Create element"
                  onClick={stopPropagation(onFieldCreatorClick)}
                >
                  Element
                </button>
              </Fade>
            </div>
          </div>
        </div>
      }
      date={date}
      selected={selected}
      isLocked={isLocked}
      prepend={
        <div className="tree-hierarchy__mark-icon d-flex justify-content-center align-items-center">
          <button
            type="button"
            className="tree-hierarchy__retractable d-flex justify-content-center align-items-center"
            onClick={stopPropagation(onRetractableClick)}
            aria-label={getMarkIconAriaLabel(expanded)}
          >
            {expanded ? <RemoveSharp fontSize={"inherit"} /> : <AddSharp fontSize={"inherit"} />}
          </button>
        </div>
      }
      onSelect={onSelect}
    >
      <Collapse isOpen={expanded} mountOnEnter unmountOnExit aria-expanded={expanded.toString()}>
        {children}
      </Collapse>
    </MSHTreeNode>
  );
};

GeneralMSHTreeGroup.defaultProps = {
  onExpand: noop,
  onCollapse: noop,
  onSelect: noop,
  onFieldCreatorClick: noop,
  onGroupCreatorClick: noop,
};

GeneralMSHTreeGroup.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
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

export default GeneralMSHTreeGroup;
