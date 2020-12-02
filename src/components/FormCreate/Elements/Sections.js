import React, {useState} from "react";
import {Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";

import './sectionsStyles.scss'

export default function Sections(props) {

  const {
    defaultTab,
    sections,
    isSectionHidden,
    isSectionDisabled,
    renderElementsByGroupsAndSections,
    renderElementsWithNoGroupsAndSections
  } = props;

  const [keyTab, setKeyTab] = useState(defaultTab);

  return (
    <div className="sections">
      <Nav tabs className="my-0 sections-nav">
        {
          sections.map((section, index) =>
            <NavItem style={isSectionHidden(section)} key={`tab-display-${section}`} {...isSectionDisabled(section)}>
              <NavLink
                className={classnames({
                  active: keyTab == index
                }, "sections-nav_item")}
                onClick={() => {
                  setKeyTab(index)
                }}
              >
                <div className="sections-nav_item_title">
                  <span className="align-middle ml-50">{section}</span>
                </div>
                <div className="sections-nav_item_index">
                  {index + 1}
                </div>
                <div
                  className={classnames({
                    active: keyTab == index
                  }, "sections-nav_item_delimiter")}
                />

              </NavLink>
            </NavItem>
          )
        }
      </Nav>
      <TabContent activeTab={keyTab} style={{flex: 1}}>
        {
          sections.map((section, index) =>
            <TabPane tabId={index} key={section} style={isSectionHidden(section)}>
              <Row className="mx-0" col="12">
                <Col className="pl-0" sm="12">
                  {
                    renderElementsByGroupsAndSections(section)
                  }
                  <Row className="mt-1 mb-1">
                    {renderElementsWithNoGroupsAndSections(section)}
                  </Row>
                </Col>
              </Row>
            </TabPane>
          )
        }
      </TabContent>
    </div>
  )

}
