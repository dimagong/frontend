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
} from 'reactstrap'

const ContextSearchNav = ({ onChange, selectedNavItem, navOptions }) => {

  const [isCollapsedNavBarOpen, setIsCollapsedNavBarOpen] = useState(false)

  const toggle = () => setIsCollapsedNavBarOpen(!isCollapsedNavBarOpen);

  const handleNavItemSelect = (navItem) => {
    onChange(navItem);
  }

  return (
    <Row>
      <Col>
        <Navbar light expand="md">
          <UncontrolledDropdown>
            <DropdownToggle nav caret={true}>
              {selectedNavItem.title}
            </DropdownToggle>
            <DropdownMenu left>
              {navOptions.map((navEl) => (
                <DropdownItem
                  //*TODO Temp disabled, remove after masterSchema implement
                  disabled={navEl.title === "MasterSchema"}
                  onClick={() => handleNavItemSelect(navEl)}
                >
                  <NavItem>
                    {navEl.title}
                  </NavItem>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>

          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isCollapsedNavBarOpen} navbar>
            <Nav className="ml-auto" navbar>
              {selectedNavItem.actions.map((navItemAction) => (
                <NavItem>
                  {navItemAction.title}
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        </Navbar>
      </Col>
    </Row>
  )
}

export default ContextSearchNav;
