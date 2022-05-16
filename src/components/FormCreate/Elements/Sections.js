import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";

import ProgressBar from "../Custom/ProgressBar";

import "./sectionsStyles.scss";
import { selectUserOnboarding } from "app/selectors/userSelectors";
import { selectProfile } from "app/selectors";

export default function Sections(props) {
  const onboarding = useSelector(selectUserOnboarding);
  const profile = useSelector(selectProfile);

  const {
    defaultTab,
    sections,
    isSectionHidden,
    isSectionDisabled,
    renderElementsByGroupsAndSections,
    renderElementsWithNoGroupsAndSections,
    getErrors,
    getProgress,
    completed,
    setSectionViewState,
  } = props;

  const [keyTab, setKeyTab] = useState(defaultTab);

  const changeSectionViewState = (sectionName) => {
    // todo make some central permission decision service, need add checks for dForm only editing (not template)
    const isProspect = profile.permissions.ability === "prospect";

    if (isProspect) {
      setSectionViewState(sectionName);
    }
  };

  return (
    <div className="sections">
      <Nav tabs className="my-0 sections-nav position-fixed">
        {sections.map((section, index) => (
          <NavItem style={isSectionHidden(section)} key={`tab-display-${section}`} {...isSectionDisabled(section)}>
            <NavLink
              className={classnames(
                {
                  // eslint-disable-next-line eqeqeq
                  active: keyTab == index,
                },
                "sections-nav_item"
              )}
              onClick={() => {
                setKeyTab(index);
                changeSectionViewState(section);
              }}
            >
              <div className={`sections-nav_item_title ${getErrors()[section] ? "with-errors" : ""}`}>
                <span className="align-middle ml-50">{section}</span>
              </div>
              <div className="sections-nav_item_index">
                <ProgressBar
                  completed={
                    completed || onboarding.d_form?.status === "submitted" || onboarding.d_form?.status === "approved"
                  }
                  progress={getProgress(section)}
                  size={33}
                  strokeWidth={2}
                  circleOneStroke="transparent"
                  circleTwoStroke={"#7367f0"}
                  index={index + 1}
                />
              </div>
              <div
                className={classnames(
                  {
                    // eslint-disable-next-line eqeqeq
                    active: keyTab == index,
                  },
                  "sections-nav_item_delimiter"
                )}
              />
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent className={"onboarding-tab-content"} activeTab={keyTab} style={{ flex: 1 }}>
        {sections.map((section, index) => (
          <TabPane tabId={index} key={section} style={isSectionHidden(section)}>
            <Row className="mx-0" col="12">
              <Col className="pl-0" sm="12">
                {/*<h1 className="px-2" style={{color: "#7367f0"}}>{section}</h1>*/}
                {renderElementsByGroupsAndSections(section)}
                <Row className="mt-1 mb-1">{renderElementsWithNoGroupsAndSections(section)}</Row>
              </Col>
            </Row>
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}
