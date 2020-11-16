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

const ContextSearchNav = ({ onChange, selectedNavItem, navOptions, onContextChange }) => {

  const [isCollapsedNavBarOpen, setIsCollapsedNavBarOpen] = useState(false)

  const toggle = () => setIsCollapsedNavBarOpen(!isCollapsedNavBarOpen);

  const handleNavItemSelect = (navItem) => {
    onChange(navItem);
  }

  return (
    <Card>
      <CardBody className="py-2">
    <Row className="context-search-nav">
      <Col>
        <Navbar light expand="md" className="p-0">
          <UncontrolledDropdown>
            <DropdownToggle className="text-dark" nav caret={true}>
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
          <div className="ml-auto">
            <span className="font-weight-bold" style={{color: "#707070"}}>Contextual Search</span>
          </div>

          {/*<NavbarToggler onClick={toggle} />*/}
          {/*<Collapse isOpen={isCollapsedNavBarOpen} navbar>*/}
          {/*  <Nav className="ml-auto" navbar>*/}
          {/*    {selectedNavItem.actions.map((navItemAction) => (*/}
          {/*      <NavItem*/}
          {/*        className="pr-2 cursor-pointer"*/}
          {/*        onClick={() => {onContextChange(navItemAction.title)}}*/}
          {/*      >*/}
          {/*        {navItemAction.title}*/}
          {/*      </NavItem>*/}
          {/*    ))}*/}
          {/*  </Nav>*/}
          {/*</Collapse>*/}
        </Navbar>
      </Col>
    </Row>
      </CardBody>
    </Card>
  )
}

export default ContextSearchNav;
