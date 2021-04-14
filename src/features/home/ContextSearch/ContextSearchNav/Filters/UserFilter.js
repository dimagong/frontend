import React, {useRef, useState, useEffect} from 'react'

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
import {useOutsideAlerter} from "hooks/useOutsideAlerter";
import FilterIcon from 'assets/img/svg/filter.svg';

const UserFilter = ({ handleFilter, managers }) => {
  const userFilters = useSelector(selectFilters);
  const organizationsObjects = useSelector(selectOrganizations);

  const [appliedFilters, setAppliedFilters] = useState({roles: new Set(), organizations: new Set(), sort: -1});
  const [activeFilter, setActiveFilter] = useState();

  const [isFilterBoxOpened, setIsFilterBoxOpened] = useState(false);
  const [currSort, setCurrSort] = useState(-1);
  const [filtered, setFiltered] = useState(false);
  let roles = new Set(['Admin', 'Corporation manager', 'Prospect', 'Suspect', 'Network manager', 'Adviser', 'Lead']), organizations = new Set(), reps = new Set();
  organizationsObjects.forEach(item => {organizations.add(item.name.replace('_', ' '))})
  const [curr, setCurr] = useState('roles');
  const [filter, setFilter] = useState({roles: roles, organizations: organizations, type: {roles: 'initial', organizations: 'initial'}});
  const [footerText, setFooterText] = useState({roles: '', organizations: ''});

  const wrapperRefFilterBox = useRef(null), wrapperRefFilterButton = useRef(null)
  useOutsideAlerter([wrapperRefFilterBox, wrapperRefFilterButton], () => setIsFilterBoxOpened(false));

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

    setAppliedFilters({
      roles: newFilter.roles,
      organizations: newFilter.organizations,
      sort: newSort,
    });

    filterAndSortManagers(newFilter, newSort);
    setIsFilterBoxOpened(false);
  };

  const filterAndSortManagers = (newFilter, newSort) => {

    let newManagers = managers;
    newManagers = newManagers.filter(item => (
      newFilter.roles.size === 0
      || newFilter.roles.has(item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace('_', ' ').slice(1)))
      && (newFilter.organizations.size === 0 || newFilter.organizations.has(item?.permissions?.organization.replace('_', ' '))));

    switch (newSort) {
      case 0: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 1: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
      case 2: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 3: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
    }

    handleFilter(newManagers);
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
    setFilter(newFilter);
    setFooterText({roles: setToString(newFilter.roles), organizations: setToString(newFilter.organizations)});
    applyFilters(newFilter);
    setActiveFilter(null);
    document.getElementById('filter-set-name').value = null;
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

  useEffect(() => {
    filterAndSortManagers(
      {roles: appliedFilters.roles, organizations: appliedFilters.organizations},
      appliedFilters.sort
    )
  }, [managers]);

  return (
    <span className={'filters'}>
          <SortingFilters currSort={currSort} setCurrSort={setCurrSort} applyFilters={applyFilters}/>
          <span onClick={() => setIsFilterBoxOpened(!isFilterBoxOpened)} ref={wrapperRefFilterButton} id={'filter-btn'}>
            <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
          </span>
          {filter.roles.size !== roles.size && filter.roles.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.roles.length <= 40 ? footerText.roles : `${filter.roles.size} roles`}</span>
            <span onClick={() => handleCloseTab({roles:new Set(), organizations: filter.organizations, type: filter.type})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          {filter.organizations.size !== organizations.size &&filter.organizations.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.organizations}</span>
            <span onClick={() => handleCloseTab({roles:filter.roles, organizations: new Set(), type: filter.type})}
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
                        {/*Temporary*/ curr !== 'reps' &&
                        <FilterOptions
                          filter={filter}
                          curr={curr}
                          roles={roles}
                          organizations={organizations}
                          handleFilterOptions={handleFilterOptions}
                        />}
                      </span>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <SavedFilters
                    userFilters={userFilters}
                    filter={filter}
                    setFilter={setFilter}
                    initialFilter={initialFilter}
                    changeFooter={changeFooterText}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
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
