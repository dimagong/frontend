import React, { useState } from 'react'

import {
  Row,
  Col,
  Navbar,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  NavbarToggler,
  Collapse,
  Nav,
  Card,
  CardBody,
} from 'reactstrap'

import './styles.scss'

const ContextSearchNav = ({ onChange, selectedNavItem, navOptions }) => {

  const handleNavItemSelect = (navItem) => {
    onChange(navItem);
  }

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
            <DropdownMenu left>
              {navOptions.map((navEl, index) => (
                <DropdownItem
                  //*TODO Temp disabled, remove after masterSchema implement
                  key={index}
                  onClick={() => handleNavItemSelect(navEl)}
                >
                  <NavItem>
                    {navEl.title}
                  </NavItem>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
          <div className="ml-auto">
            <span className="font-weight-bold" style={{color: "#707070"}}>Contextual Search</span>
          </div>
        </Navbar>
      </Col>
    </Row>
      </CardBody>
    </Card>
  )
}

export default ContextSearchNav;
