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
import {getMemberFirms} from "app/selectors/memberFirmsSelector";

const UserFilter = ({ handleFilter, managers }) => {
  const userFilters = useSelector(selectFilters);
  const organizationsObjects = useSelector(selectOrganizations);
  const [memberFirms, setMemberFirms] = useState(new Set())

  const [appliedFilters, setAppliedFilters] = useState({roles: new Set(), organizations: new Set(), sort: -1});
  const [activeFilter, setActiveFilter] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isFilterBoxOpened, setIsFilterBoxOpened] = useState(false);
  const [currSort, setCurrSort] = useState(-1);
  const [filtered, setFiltered] = useState(false);
  const [filterName, setFilterName] = useState('');
  let roles = new Set(['Admin', 'Corporation manager', 'Prospect', 'Suspect', 'Archived', 'Network manager', 'Member', 'Lead']), organizations = new Set(), reps = new Set();
  organizationsObjects.forEach(item => {organizations.add(item.name.replace('_', ' '))})
  const memberFirmsObjects = useSelector(getMemberFirms);
  const [curr, setCurr] = useState('roles');
  const [filter, setFilter] = useState({roles: roles, organizations: organizations, memberFirms: memberFirms, type: {roles: 'initial', organizations: 'initial', memberFirms: 'initial'}});
  const [footerText, setFooterText] = useState({roles: '', organizations: '', memberFirms: ''});

  const wrapperRefFilterBox = useRef(null), wrapperRefFilterButton = useRef(null);
  useOutsideAlerter([wrapperRefFilterBox, wrapperRefFilterButton], () => {if (!isDeleteModalOpen) setIsFilterBoxOpened(false)});

  const handleFilterOptions = (type, option) => {
    let newFilter = filter;
    newFilter = {roles: new Set(Array.from(newFilter.roles)),
                 organizations: new Set (Array.from(newFilter.organizations)),
                  memberFirms: new Set (Array.from(newFilter.memberFirms)),
                  type: {roles: filter.type.roles, organizations: filter.type.organizations, memberFirms: filter.type.memberFirms}
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
        newFilter[curr] = curr === 'roles' ? roles : curr === 'organizations' ? organizations : memberFirms;
        newFilter[curr].delete(option);
      }
    }
    setFilter(newFilter);
    setFooterText({roles: setToString(newFilter.roles), organizations: setToString(newFilter.organizations), memberFirms: setToString(newFilter.memberFirms)});
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

    if (newFilter?.roles && newFilter?.roles?.size !== 0) {
      newManagers = newManagers.filter(item => {
        return newFilter.roles.has(item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace('_', ' ').slice(1))
      })
    }

    if (newFilter?.organizations && newFilter?.organizations?.size !== 0) {
      newManagers = newManagers.filter(item => {
        return newFilter.organizations.size === 0 || newFilter.organizations.has(item?.permissions?.organization.replace('_', ' '))
      })
    }

    if (newFilter?.memberFirms && newFilter?.memberFirms?.size !== 0) {
      newManagers = newManagers.filter(item => {
        return newFilter.memberFirms.has(item?.member_firm?.main_fields?.name)
      })
    }

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
    setFilter({roles: new Set(), organizations: new Set(), memberFirms: new Set(), type: {roles: 'initial', organizations: 'initial', memberFirms: "initial"}});
    setFooterText({roles: setToString(new Set()), organizations: setToString(new Set()), memberFirms: setToString(new Set())});
  }

  const changeFooterText = (filter) => {
    setFooterText({roles: setToString(filter.roles), organizations: setToString(filter.organizations), memberFirms: setToString(filter.memberFirms)});
  }

  const handleCloseTab = (newFilter) => {
    if (isFilterBoxOpened) return;
    setFilter(newFilter);
    setFooterText({roles: setToString(newFilter.roles), organizations: setToString(newFilter.organizations), memberFirms: setToString(newFilter.memberFirms)});
    applyFilters(newFilter);
    setActiveFilter(null);
    setFilterName('');
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
    setFilter({roles: new Set(), organizations: new Set(), memberFirms: new Set(), type: {roles: 'initial', organizations: 'initial', memberFirms:'initial'}});
    setFiltered(true);
    setFooterText({roles: setToString(roles), organizations: setToString(organizations), memberFirms: setToString(memberFirms)});
  }

  useEffect(() => {
    filterAndSortManagers(
      {roles: appliedFilters.roles, organizations: appliedFilters.organizations},
      appliedFilters.sort
    )
  }, [managers]);

  useEffect(() => {
    let newMemberFirms = [...filter.memberFirms]
    newMemberFirms = newMemberFirms.filter(item => Array.from(memberFirms).find(elem => item === elem))
    if (filter.memberFirms.size !== newMemberFirms.length) {
      let newFilter = {roles: new Set([...filter.roles]), organizations: new Set([...filter.organizations]), memberFirms: new Set([...filter.memberFirms]),
        type: {roles: filter.type.roles, organizations: filter.type.organizations, memberFirms: filter.type.memberFirms}}
      newFilter.memberFirms = new Set(newMemberFirms);
      setFilter(newFilter)
    }

  }, [memberFirms?.size]);

   useEffect(() => {
    setMemberFirms(new Set(memberFirmsObjects?.length > 0 ? memberFirmsObjects.map(item => item?.main_fields.name) : []))
  }, [memberFirmsObjects?.length]);

  useEffect(() => {
    if (filter.organizations.size === 0) {
      setMemberFirms(new Set(memberFirmsObjects?.length > 0 ? memberFirmsObjects.map(item => item?.main_fields.name) : []))
    } else {
      setMemberFirms(new Set(memberFirmsObjects?.length > 0
        ? memberFirmsObjects.filter(item =>
          Array.from(filter.organizations).findIndex(elem => elem === item.network.name) !== -1)
          .map(item => item?.main_fields.name)
        : []))
    }
  }, [filter.organizations]);

  return (
    <span className={'filters'}>
          <SortingFilters currSort={currSort} setCurrSort={setCurrSort} applyFilters={applyFilters}/>
          <span onClick={() => setIsFilterBoxOpened(!isFilterBoxOpened)} ref={wrapperRefFilterButton} id={'filter-btn'}>
            <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
          </span>
          {filter.roles.size !== roles.size && filter.roles.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.roles.length <= 40 ? footerText.roles : `${filter.roles.size} roles`}</span>
            <span onClick={() => handleCloseTab({roles:new Set(), organizations: filter.organizations, memberFirms: filter.memberFirms, type: {roles: 'initial', organizations: filter.type.organizations, memberFirms: filter.type.memberFirms}})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          {filter.organizations.size !== organizations.size &&filter.organizations.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.organizations}</span>
            <span onClick={() => handleCloseTab({roles:filter.roles, organizations: new Set(), memberFirms: filter.memberFirms, type: {roles: filter.type.roles, organizations: 'initial', memberFirms: filter.type.memberFirms}})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          {filter.memberFirms.size !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.memberFirms}</span>
            <span onClick={() => handleCloseTab({roles:filter.roles, organizations: filter.organizations, memberFirms: new Set(), type: {roles: filter.type.roles, organizations: filter.type.organizations, memberFirms: 'initial'}})}
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
                      {<Button onClick={() => {setCurr('memberFirms')}} variant="secondary" className={curr === 'memberFirms' ? 'active' : 'not-active'}>
                        <span className={'filter-name'}>Member Firms ({memberFirms.size})</span>
                        {curr === 'memberFirms' && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                      </Button>}
                    </Col>
                    <Col className={'right'} id={'filter-options-right'}>
                      <span>
                        {/*Temporary*/ curr !== 'reps' &&
                        <FilterOptions
                          filter={filter}
                          curr={curr}
                          roles={roles}
                          memberFirms={memberFirms}
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
                    filterName={filterName}
                    setFilterName={setFilterName}
                    isDeleteModalOpen={isDeleteModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
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
