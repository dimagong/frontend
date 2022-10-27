import "./styles.scss";

import React from "react";
import { Plus } from "react-feather";
import classnames from "classnames";
import { Nav, NavItem, NavLink } from "reactstrap";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { HolderOutlined } from "@ant-design/icons";

import ProgressBar from "./Components/ProgressBar";
import { ElementTypes } from "components/DForm";

const SectionsSideBar = (props) => {
  const {
    errors,
    sections = [],
    completed,
    isConfigurable,
    selectedSection,
    sectionsProgress,
    onSectionSelect,
    onSectionCreate,
  } = props;

  return (
    <div className="sections">
      <Droppable droppableId="Section" type={ElementTypes.Section}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Nav tabs className="my-0 sections-nav">
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <NavItem
                        style={section.isHidden ? { display: "none" } : {}}
                        key={section.id}
                        disabled={section.isDisabled}
                      >
                        <NavLink
                          className={classnames({ active: selectedSection === section.id }, "sections-nav_item")}
                          onClick={() => onSectionSelect(section.id)}
                        >
                          <div className="dform-dnd__wrapper dform-dnd__wrapper--sections">
                            <span
                              className="dform-dnd__drag-handle-icon dform-dnd__drag-handle-icon--section"
                              {...provided.dragHandleProps}
                            >
                              <HolderOutlined />
                            </span>
                            <div className={`sections-nav_item_title ${errors[section.id] ? "with-errors" : ""}`}>
                              <span className="align-middle">{section.name}</span>
                            </div>
                          </div>

                          <div className="sections-nav_item_index">
                            <ProgressBar
                              // completed={completed || onboarding.d_form?.status === "submitted" || onboarding.d_form?.status === "approved" } //todo handle it later
                              completed={completed}
                              progress={(sectionsProgress && sectionsProgress[section.id]) || 0}
                              size={33}
                              strokeWidth={2}
                              circleOneStroke="transparent"
                              circleTwoStroke={"#7367f0"}
                              index={index + 1}
                            />
                          </div>
                          <div
                            className={classnames(
                              { active: selectedSection === section.id },
                              "sections-nav_item_delimiter"
                            )}
                          />
                        </NavLink>
                      </NavItem>
                    </div>
                  )}
                </Draggable>
              ))}
            </Nav>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {isConfigurable ? (
        <div className="sections__add" onClick={onSectionCreate}>
          <div className="sections-nav_item_title">
            <span className="align-middle ml-50">New tab</span>
          </div>
          <div className="sections-nav_item-add">
            <Plus size={18} color="white" />
          </div>
          <div className="sections-nav_item_delimiter" />
        </div>
      ) : null}
    </div>
  );
};

export default SectionsSideBar;
