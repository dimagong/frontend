import React from "react";

import {
  Row,
  Col,
  Navbar,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  Card,
  CardBody,
} from "reactstrap";

import "./styles.scss";
import UserFilter from "./Filters/UserFilter";

const ContextSearchNav = ({ onChange, selectedNavItem, navOptions, handleFilter, managers }) => {
  const handleNavItemSelect = (navItem) => {
    onChange(navItem);
  };

  return (
    <Card>
      <CardBody className="py-2">
        <Row className="context-search-nav">
          <Col>
            <Navbar light expand="md" className="p-0">
              <UncontrolledDropdown className="context-search-nav_dropdown">
                <DropdownToggle className="text-dark" nav caret={true}>
                  {selectedNavItem.title}
                </DropdownToggle>
                <DropdownMenu>
                  {navOptions.map((navEl, index) => (
                    <DropdownItem
                      //*TODO Temp disabled, remove after masterSchema implement
                      key={index}
                      onClick={() => handleNavItemSelect(navEl)}
                    >
                      <NavItem className={"nav-item-titles"}>{navEl.title}</NavItem>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
              {selectedNavItem.title === "User Management" && (
                <UserFilter handleFilter={handleFilter} managers={managers} />
              )}
              <div className="ml-auto">
                <span className="font-weight-bold" style={{ color: "#707070" }}>
                  Contextual Search
                </span>
              </div>
            </Navbar>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ContextSearchNav;
