import React, {useState} from 'react'

import {
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import HighlightIcon  from '@material-ui/icons/Highlight';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FilterOptions from "./FilterOptions";
import {useSelector} from "react-redux";
import {selectFilters} from "app/selectors/userSelectors";
import SavedFilters from "./SavedFilters";
import SortingFilters from "./SortingFilters";

const UserFilter = ({ handleFilter, managers }) => {
  const userFilters = useSelector(selectFilters);

  const [currSort, setCurrSort] = useState(-1);
  const [filtered, setFiltered] = useState(false);
  let roles = new Set(), organizations = new Set(), reps = new Set();
  const [curr, setCurr] = useState('roles');
  managers.forEach(item => {
    item?.permissions?.ability && roles.add(item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace('_', ' ').slice(1));
    item?.permissions?.organization && organizations.add(item?.permissions?.organization.replace('_', ' '));
    //item?.permissions?.reps && organizations.add(item?.permissions?.reps.replace('_', ' ')); //TODO Add reps
  });
  if (roles.size > 4 || organizations.size > 4) {
    document.getElementById('filter-options-right').style.overflowY = 'scroll'
    document.getElementById('filter-options-right').style.paddingRight = '35px'
  }
  const [filter, setFilter] = useState({roles: roles, organizations: organizations});
  const [footerText, setFooterText] = useState({roles: '', organizations: ''});

  const handleFilterBox = () => {
    let filtexBox = document.getElementsByClassName('filter-box');
    if (filtexBox[0].style.display === "none") {
      filtexBox[0].style.display = "block";
    } else {
      filtexBox[0].style.display = "none";
    }
  }

  const handleFilterOptions = (type, option) => {
    let newFilter = filter;
    newFilter = {roles: new Set(Array.from(newFilter.roles)),
                 organizations: new Set (Array.from(newFilter.organizations))};
    switch (curr) {
      case 'roles': type === 'add' ? newFilter.roles.add(option) : newFilter.roles.delete(option); break;
      case 'organizations': type === 'add' ? newFilter.organizations.add(option) : newFilter.organizations.delete(option); break;
    }
    setFilter(newFilter);
    setFooterText({roles: setToString(newFilter.roles), organizations: setToString(newFilter.organizations)});
  }

  const applyFilters = (newFilter, newSort) => {
    if (!newFilter?.roles?.size) {
      newFilter = filter;
    }
    if (newSort === undefined || newSort < 0) {
      newSort = currSort;
    }
    let newManagers = managers;
    newManagers = newManagers.filter(item => newFilter.roles.has(item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace('_', ' ').slice(1))
                                             &&
                                             newFilter.organizations.has(item?.permissions?.organization.replace('_', ' ')));

    switch (newSort) {
      case 0: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 1: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
      case 2: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 3: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
    }

    handleFilter(newManagers);
    let filtexBox = document.getElementsByClassName('filter-box');
    filtexBox[0].style.display = "none";
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
    setFilter({roles: roles, organizations: organizations});
    setFooterText({roles: setToString(roles), organizations: setToString(organizations)});
  }

  const changeFooter = (filter) => {
    setFooterText({roles: setToString(filter.roles), organizations: setToString(filter.organizations)});
  }

  const handleCloseTab = (newFilter) => {
    setFilter(newFilter);
    setFooterText({roles: setToString(newFilter.roles), organizations: setToString(newFilter.organizations)});
    applyFilters(newFilter);
  }

  if (!filtered && managers.length !== 0 && userFilters) {
    handleFilter(managers);
    setFilter({roles: roles, organizations: organizations});
    setFiltered(true);
    setFooterText({roles: setToString(roles), organizations: setToString(organizations)});
  }

  return (
    <span className={'filters'}>
          <SortingFilters currSort={currSort} setCurrSort={setCurrSort} applyFilters={applyFilters}/>
          <span onClick={handleFilterBox}>
            <HighlightIcon/>
          </span>
          {filter.roles.size !== roles.size && filter.roles.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.roles}</span>
            <span onClick={() => handleCloseTab({roles:roles, organizations: filter.organizations})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          {filter.organizations.size !== organizations.size && filter.organizations.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.organizations}</span>
            <span onClick={() => handleCloseTab({roles:filter.roles, organizations: organizations})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          <span className={'filter-box'}>
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
                        {<FilterOptions filter={filter} curr={curr} roles={roles} organizations={organizations} handleFilterOptions={handleFilterOptions}/>}
                      </span>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <SavedFilters userFilters={userFilters} filter={filter} setFilter={setFilter} initialFilter={initialFilter} changeFooter={changeFooter}/>
                </ListGroupItem>
                <ListGroupItem>
                  <p className={'filter-text'}>
                    Filtering by
                    <span className={'blue'}>{footerText.roles}</span>
                    from
                    <span className={'blue'}>{footerText.organizations}</span>
                  </p>
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
