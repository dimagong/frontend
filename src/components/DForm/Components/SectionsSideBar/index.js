import "./styles.scss";

import React from "react";
import { Plus } from "react-feather";
import classnames from "classnames";
import { Nav, NavItem, NavLink } from "reactstrap";

import ProgressBar from "./Components/ProgressBar";

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
      <Nav tabs className="my-0 sections-nav">
        {sections.map((section, index) => (
          <NavItem style={section.isHidden ? { display: "none" } : {}} key={section.id}>
            <NavLink
              className={classnames({ active: selectedSection === section.id }, "sections-nav_item")}
              onClick={() => onSectionSelect(section.id)}
              disabled={section.isDisabled}
            >
              <div className={`sections-nav_item_title ${errors[section.id] ? "with-errors" : ""}`}>
                <span className="align-middle ml-50">{section.name}</span>
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
              <div className={classnames({ active: selectedSection === section.id }, "sections-nav_item_delimiter")} />
            </NavLink>
          </NavItem>
        ))}

        {isConfigurable ? (
          <NavItem>
            <NavLink className={"sections-nav_item"} onClick={onSectionCreate}>
              <div className={`sections-nav_item_title`}>
                <span className="align-middle ml-50">New tab</span>
              </div>
              <div className="sections-nav_item-add">
                <Plus size={18} color={"white"} />
              </div>
              <div className={"sections-nav_item_delimiter"} />
            </NavLink>
          </NavItem>
        ) : null}
      </Nav>
    </div>
  );
};

export default SectionsSideBar;
