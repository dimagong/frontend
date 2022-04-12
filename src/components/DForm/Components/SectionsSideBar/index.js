import React, {useState} from "react";
import {useSelector} from 'react-redux'

import {Nav, NavItem, NavLink} from "reactstrap";
import classnames from "classnames";
import {Plus} from "react-feather";

import {Edit} from 'react-feather';

import ProgressBar from './Components/ProgressBar'

import './styles.scss'

// import {selectUserOnboarding} from 'app/selectors/userSelectors'

const SectionsSideBar = ({
  onSectionSelect,
  selectedSection,
  sections,
  errors,
  sectionsProgress,
  completed,
  onSectionCreate,
}) => {

  // const onboarding = useSelector(selectUserOnboarding);

  return (
    <div className="sections">
      <Nav tabs className="my-0 sections-nav">
        {
          sections.map((section, index) =>
            <NavItem style={section.isHidden ? {display: "none"} : {}} key={`tab-display-${section.id}`} disabled={section.isDisabled}>
              <NavLink
                className={classnames({
                  // eslint-disable-next-line
                  active: selectedSection === section.id
                }, "sections-nav_item")}
                onClick={() => {onSectionSelect(section.id)}}
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
                    circleOneStroke='transparent'
                    circleTwoStroke={"#7367f0"}
                    index={index + 1}
                  />
                </div>
                <div
                  className={classnames({
                    active: selectedSection === section.id
                  }, "sections-nav_item_delimiter")}
                />
              </NavLink>
            </NavItem>
          )
        }
        {!!onSectionCreate && (
          <NavItem>
            <NavLink className={"sections-nav_item"} onClick={onSectionCreate}>
              <div className={`sections-nav_item_title`}>
                <span className="align-middle ml-50">New tab</span>
              </div>
              <div className="sections-nav_item-add">
                <Plus size={18} color={"white"}/>
              </div>
              <div className={"sections-nav_item_delimiter"}/>
            </NavLink>
          </NavItem>
        )}

      </Nav>
    </div>
  )
};

export default SectionsSideBar;
