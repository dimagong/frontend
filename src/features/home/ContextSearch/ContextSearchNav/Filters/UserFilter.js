import React, {useRef, useState} from 'react'

import {
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FilterOptions from "./FilterOptions";
import {useSelector} from "react-redux";
import {selectFilters} from "app/selectors/userSelectors";
import {selectOrganizations} from "app/selectors/groupSelector";
import SavedFilters from "./SavedFilters";
import SortingFilters from "./SortingFilters";

const UserFilter = ({ handleFilter, managers }) => {
  const userFilters = useSelector(selectFilters);
  const organizationsObjects = useSelector(selectOrganizations);

  const [isFilterBoxOpened, setIsFilterBoxOpened] = useState(false);
  const [currSort, setCurrSort] = useState(-1);
  const [filtered, setFiltered] = useState(false);
  let roles = new Set(['Admin', 'Corporation manager', 'Prospect', 'Suspect', 'Network manager', 'Adviser', 'Lead']), organizations = new Set(), reps = new Set();
  organizationsObjects.forEach(item => {organizations.add(item.name.replace('_', ' '))})
  const [curr, setCurr] = useState('roles');
  const [filter, setFilter] = useState({roles: roles, organizations: organizations, type: {roles: 'initial', organizations: 'initial'}});
  const [footerText, setFooterText] = useState({roles: '', organizations: ''});

  const wrapperRefFilterBox = useRef(null), wrapperRefFilterButton = useRef(null)
  function handleClickOutsideBox(event) {
    if (wrapperRefFilterBox.current && !wrapperRefFilterBox.current.contains(event.target) &&
      !wrapperRefFilterButton.current.contains(event.target)) {
      setIsFilterBoxOpened(false);
    }
  }
  if (isFilterBoxOpened) {
    document.addEventListener("mousedown", handleClickOutsideBox);
  } else {
    document.removeEventListener("mousedown", handleClickOutsideBox);
  }

  const handleFilterOptions = (type, option) => {
    let newFilter = filter;
    newFilter = {roles: new Set(Array.from(newFilter.roles)),
                 organizations: new Set (Array.from(newFilter.organizations)),
                  type: filter.type
    };
    if (type === 'add') {
      if (newFilter.type[curr] === 'check') {
        if (newFilter[curr].has(option)) {
          newFilter[curr].delete(option);
        } else {
          newFilter[curr].add(option);
        }
      } else {
        newFilter.type[curr] = 'check';
        newFilter[curr] = new Set();
        newFilter[curr].add(option);
      }
    } else {
      if (newFilter.type[curr] === 'cross') {
        if (newFilter[curr].has(option)) {
          newFilter[curr].delete(option);
        } else {
          newFilter[curr].add(option);
        }
      } else {
        newFilter.type[curr] = 'cross';
        newFilter[curr] = curr === 'roles' ? roles : organizations;
        newFilter[curr].delete(option);
      }
    }
    setFilter(newFilter);
    setFooterText({roles: setToString(newFilter.roles), organizations: setToString(newFilter.organizations)});
  }

  const applyFilters = (newFilter, newSort) => {
    if (!newFilter.hasOwnProperty('roles')) {
      newFilter = filter;
    }
    if (newSort === undefined || newSort < 0) {
      newSort = currSort;
    }
    let newManagers = managers;
    newManagers = newManagers.filter(item => (newFilter.roles.size === 0 || newFilter.roles.has(item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace('_', ' ').slice(1)))
                                             &&
                                             (newFilter.organizations.size === 0 || newFilter.organizations.has(item?.permissions?.organization.replace('_', ' '))));

    switch (newSort) {
      case 0: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 1: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
      case 2: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 3: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
    }

    handleFilter(newManagers);
    setIsFilterBoxOpened(false);
  }

  const setToString = (set) => {
    let array = Array.from(set);
    let res = ' ';
    for (let i = 0; i < array.length; ++i) {
      switch (i) {
        case array.length - 1: res += array[i] + ' '; break;
        case array.length - 2: res += array[i] + ' or '; break;
        default: res += array[i] + ', '; break;
      }
    }
    return res;
  }

  const initialFilter = () => {
    setFilter({roles: roles, organizations: organizations, type: {roles: 'initial', organizations: 'initial'}});
    setFooterText({roles: setToString(roles), organizations: setToString(organizations)});
  }

  const changeFooterText = (filter) => {
    setFooterText({roles: setToString(filter.roles), organizations: setToString(filter.organizations)});
  }

  const handleCloseTab = (newFilter) => {
    if (isFilterBoxOpened) return;
    newFilter.type = filter.type;
    newFilter.type[curr] = 'initial';
    setFilter(newFilter);
    setFooterText({roles: setToString(newFilter.roles), organizations: setToString(newFilter.organizations)});
    applyFilters(newFilter);
  }

  const footer = () => {
    if ((filter.roles.size === 0 && filter.organizations.size === 0)
         ||
        (filter.roles.size === roles.size && filter.organizations.size === organizations.size)) {
      return <p/>
    } else if (filter.roles.size > 0 && filter.organizations.size > 0) {
      return <p className={'filter-text'}>
        Filtering by
        <span className={'blue'}>{footerText.roles}</span>
        from
        <span className={'blue'}>{footerText.organizations}</span>
      </p>
    } else {
      return <p className={'filter-text'}>
        Filtering by
        <span className={'blue'}>{filter.roles.size > 0 ? footerText.roles : footerText.organizations}</span>
      </p>
    }
  }

  if (!filtered && managers.length !== 0 && userFilters) {
    handleFilter(managers);
    setFilter({roles: new Set(), organizations: new Set(), type: {roles: 'initial', organizations: 'initial'}});
    setFiltered(true);
    setFooterText({roles: setToString(roles), organizations: setToString(organizations)});
  }

  return (
    <span className={'filters'}>
          <SortingFilters currSort={currSort} setCurrSort={setCurrSort} applyFilters={applyFilters}/>
          <span onClick={() => setIsFilterBoxOpened(!isFilterBoxOpened)} ref={wrapperRefFilterButton} id={'filter-btn'}>
            <svg style={{whiteSpace: 'pre', fill: '#aeaeae', cursor: 'pointer'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17" width="16" height="17">
              <path id="filter" fillRule="evenodd" className="shp0"
                    d="M15.74 3.14C15.74 4.97 10.84 9.25 9.92 11.08L9.92 14.87C9.92 14.88 9.91 14.88 9.91 14.89L9.91 15.33C9.91 15.87 9.48 16.3 8.94 16.3L7 16.3C6.46 16.3 6.03 15.87 6.03 15.33L6.03 14.89C6.03 14.88 6.02 14.88 6.02 14.87L6.02 11.08C5.11 9.25 0.2 4.97 0.2 3.14L0.21 3.14C0.21 3.12 0.2 3.1 0.2 3.08C0.2 2.04 3.68 0.76 7.97 0.76C12.26 0.76 15.74 2.04 15.74 3.08C15.74 3.1 15.73 3.12 15.73 3.14L15.74 3.14ZM1.16 3.43C1.16 4.54 4.29 5.62 8.05 5.62C11.82 5.62 14.76 4.54 14.76 3.43C14.76 2.32 11.82 1.72 8.05 1.72C4.29 1.72 1.16 2.32 1.16 3.43Z"/>
            </svg>
          </span>
          {filter.roles.size !== roles.size && filter.roles.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.roles.length <= 40 ? footerText.roles : `${filter.roles.size} roles`}</span>
            <span onClick={() => handleCloseTab({roles:new Set(), organizations: filter.organizations})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          {filter.organizations.size !== organizations.size &&filter.organizations.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.organizations}</span>
            <span onClick={() => handleCloseTab({roles:filter.roles, organizations: new Set()})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          <span ref={wrapperRefFilterBox} className={'filter-box ' + (isFilterBoxOpened ? ' opened' : ' closed')}>
            <Card>
              <ListGroup variant="flush">
                <ListGroupItem className={'filter-header'}>Filter design</ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col className={'left'}>
                      <Button onClick={() => {setCurr('roles')}} variant="secondary" className={curr === 'roles' ? 'active' : 'not-active'}>
                        <span className={'filter-name'}>Roles ({roles.size})</span>
                        {curr === 'roles' && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                      </Button>
                      <br/>
                      <Button onClick={() => {setCurr('organizations')}} variant="secondary" className={curr === 'organizations' ? 'active' : 'not-active'}>
                        <span className={'filter-name'}>Organizations ({organizations.size})</span>
                        {curr === 'organizations' && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                      </Button>
                      <Button onClick={() => {setCurr('reps')}} variant="secondary" className={curr === 'reps' ? 'active' : 'not-active'}>
                        <span className={'filter-name'}>Authorized Reps ({reps.size})</span>
                        {curr === 'reps' && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                      </Button>
                    </Col>
                    <Col className={'right'} id={'filter-options-right'}>
                      <span>
                        {/*Temporary*/ curr !== 'reps' && <FilterOptions filter={filter} curr={curr} roles={roles} organizations={organizations} handleFilterOptions={handleFilterOptions}/>}
                      </span>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <SavedFilters userFilters={userFilters} filter={filter} setFilter={setFilter} initialFilter={initialFilter} changeFooter={changeFooterText}/>
                </ListGroupItem>
                <ListGroupItem>
                  {footer()}
                  <div className={'filter-footer'}>
                    <Button variat="success" onClick={applyFilters}>Apply filter</Button>
                  </div>
                  </ListGroupItem>
              </ListGroup>
          </Card>
          </span>
    </span>
  )
}

export default UserFilter;
