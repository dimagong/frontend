import React, {useState} from "react";
import {Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";

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

  return <div>
    <Nav tabs className="mt-1">
      {
        sections.map((section, index) =>
          <NavItem style={isSectionHidden(section)} key={`tab-display-${section}`} {...isSectionDisabled(section)}>
            <NavLink
              className={classnames({
                active: keyTab == index
              })}
              onClick={() => {
                setKeyTab(index)
              }}
            >
              <span className="align-middle ml-50">{section}</span>
            </NavLink>
          </NavItem>
        )
      }
    </Nav>
    <TabContent activeTab={keyTab}>
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
}
