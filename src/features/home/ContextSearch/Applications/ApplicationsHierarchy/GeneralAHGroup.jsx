import { noop } from "lodash/fp";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { Collapse, Fade } from "reactstrap";
import { AddBox, AddSharp, RemoveSharp } from "@material-ui/icons";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

import { useOutsideClick, useOutsideFocus } from "hooks/use-outside-event";
import { useToggle } from "hooks/use-toggle";
import { useDeleteDFormTemplateCategoryMutation, useUpdateDFormTemplateCategoryMutation } from "../categoryQueries";

import { stopPropagation } from "utility/event-decorators";

import { EditCategoryModal } from "../EditCategoryModal.jsx";
import { NmpButton } from "features/nmp-ui";
import { AHTreeNode } from "./AHTreeNode";

const getMarkIconAriaLabel = (expanded) => `${expanded ? "Collapse" : "Expand"} category.`;

export const GeneralAHGroup = (props) => {
  const {
    node,
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteCategory = useDeleteDFormTemplateCategoryMutation({ categoryId: node.id });
  const updateCategory = useUpdateDFormTemplateCategoryMutation({ categoryId: node.id });

  const onUpdateCategorySubmit = (submitted) => {
    if (submitted.invalid) return;

    const { name, parentId } = submitted.values;

    updateCategory.mutate({ name: name, parent_id: parentId });
  };

  const onDelete = () => {
    if (window.confirm("Are you sure to delete this category?")) {
      // @ts-ignore
      deleteCategory.mutate();
    }
  };

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

  const onEdit = () => {
    if (node.parentId === null) {
      toast.error("You cannot edit root category.");
      return;
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    if (!updateCategory.isLoading) {
      closeModal();
    }
  }, [updateCategory.isLoading]);

  return (
    <AHTreeNode
      className={className}
      index={index}
      name={
        <div className="d-flex w-75">
          <div className="tree-hierarchy__name pr-3 position-relative" title={name}>
            <div className="tree-hierarchy__name-text">{name}</div>
            <div className="position-absolute d-flex tree-hierarchy__popup-wrapper" ref={popupRef}>
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
                  Application
                </button>
              </Fade>
            </div>
            <div className="group-actions">
              <NmpButton type="text" onClick={stopPropagation(onEdit)} icon={<EditFilled />}></NmpButton>

              <NmpButton type="text" onClick={stopPropagation(onDelete)} danger icon={<DeleteFilled />}></NmpButton>
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
      {isModalOpen && (
        <EditCategoryModal
          isOpen={isModalOpen}
          group={node}
          close={closeModal}
          onSubmit={onUpdateCategorySubmit}
          submitting={updateCategory.isLoading}
        />
      )}
    </AHTreeNode>
  );
};

GeneralAHGroup.defaultProps = {
  onExpand: noop,
  onCollapse: noop,
  onSelect: noop,
  onFieldCreatorClick: noop,
  onGroupCreatorClick: noop,
};

GeneralAHGroup.propTypes = {
  node: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  date: PropTypes.string,
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
