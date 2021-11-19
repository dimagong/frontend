import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Collapse, Fade } from 'reactstrap';
import { AddBox, AddSharp, RemoveSharp } from '@material-ui/icons';

import MSETreeNode from './mse-tree-node';

import { useToggle } from 'hooks/use-toggle';
import { useOutsideClick, useOutsideFocus } from 'hooks/use-outside-event';

import { stopPropagation } from '../event-decorators';
import { createGroup, createField } from '../mse-category-popup-actions';

const getMarkIconAriaLabel = (expanded) => `${expanded ? 'Collapse' : 'Expand'} category.`;

const MSETreeCategory = ({ id, name, expanded, onExpandChange, onPopupAction, children }) => {
  const popupRef = useRef();
  const [popup, togglePopup, setPopup] = useToggle(false);

  const hidePopup = () => setPopup(false);
  const toggleExpanded = () => onExpandChange(!expanded);
  const dispatchCreateElementNode = () => {
    hidePopup();
    onPopupAction(createField(id));
  };
  const dispatchCreateCategoryNode = () => {
    hidePopup();
    onPopupAction(createGroup(id));
  };

  useOutsideClick(popupRef, hidePopup);
  useOutsideFocus(popupRef, hidePopup);

  return (
    <MSETreeNode
      name={name}
      prepend={
        <div className="ms-elements__mark-icon d-flex justify-content-center align-items-center">
          <button
            type="button"
            className="ms-elements__collapse"
            onClick={stopPropagation(toggleExpanded)}
            aria-label={getMarkIconAriaLabel(expanded)}
          >
            {expanded ? <RemoveSharp fontSize={'inherit'} /> : <AddSharp fontSize={'inherit'} />}
          </button>
        </div>
      }
      append={
        <div className="d-flex position-relative" ref={popupRef}>
          <button
            type="button"
            className="ms-elements__popup-accessor"
            aria-label="Create element or category"
            onClick={stopPropagation(togglePopup)}
          >
            <AddBox fontSize={'inherit'} />
          </button>

          <Fade
            className="ms-elements__popup bg-white d-flex justify-content-center flex-column position-absolute top-50 start-50"
            in={popup}
            mountOnEnter
            unmountOnExit
          >
            <button
              type="button"
              className="ms-elements__node-creator btn"
              aria-label="Create category"
              onClick={stopPropagation(dispatchCreateCategoryNode)}
            >
              Category
            </button>
            <button
              type="button"
              className="ms-elements__node-creator btn"
              aria-label="Create element"
              onClick={stopPropagation(dispatchCreateElementNode)}
            >
              Element
            </button>
          </Fade>
        </div>
      }
    >
      <Collapse isOpen={expanded} mountOnEnter unmountOnExit aria-expanded={expanded.toString()}>
        {children}
      </Collapse>
    </MSETreeNode>
  );
};

MSETreeCategory.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  onExpandChange: PropTypes.func,
  onPopupAction: PropTypes.func,
  children: PropTypes.node,
};

export default MSETreeCategory;
