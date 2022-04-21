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
import {selectFilters, selectFiltersId} from "app/selectors/userSelectors";
import {selectOrganizations} from "app/selectors/groupSelector";
import SavedFilters from "./SavedFilters";
import SortingFilters from "./SortingFilters";
import {useOutsideAlerter} from "hooks/useOutsideAlerter";
import FilterIcon from 'assets/img/svg/filter.svg';
import {getMemberFirms} from "app/selectors/memberFirmsSelector";

const UserFilter = ({ handleFilter, managers }) => {
  const userFilters = useSelector(selectFilters);
  const userFiltersId = useSelector(selectFiltersId);
  const organizationsObjects = useSelector(selectOrganizations);
  const [memberFirms, setMemberFirms] = useState(new Set())

  const [appliedFilters, setAppliedFilters] = useState({roles: [], organizations: [], memberFirms: [], sort: -1});
  const [activeFilter, setActiveFilter] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isFilterBoxOpened, setIsFilterBoxOpened] = useState(false);
  const [currSort, setCurrSort] = useState(-1);
  const [filtered, setFiltered] = useState(false);
  const [filterName, setFilterName] = useState('');
  let roles = ['Admin', 'Corporation manager', 'Prospect', 'Suspect', 'Archived', "BDM", 'Network manager', 'Member', 'Lead'],
      organizations = [];
  organizationsObjects.forEach(item => {organizations.push(item.name.replace('_', ' '))})
  const memberFirmsObjects = useSelector(getMemberFirms);
  const [curr, setCurr] = useState('roles');
  const [filter, setFilter] = useState({roles: roles, organizations: organizations, memberFirms: memberFirms, type: {roles: 'initial', organizations: 'initial', memberFirms: 'initial'}});
  const [footerText, setFooterText] = useState({roles: '', organizations: '', memberFirms: ''});

  const MAX_TABS_LENGTH = 40;

  const wrapperRefFilterBox = useRef(null), wrapperRefFilterButton = useRef(null);
  useOutsideAlerter([wrapperRefFilterBox, wrapperRefFilterButton], () => {if (!isDeleteModalOpen) setIsFilterBoxOpened(false)});

  const handleFilterOptions = (type, option) => {
    const newFilter = JSON.parse(JSON.stringify(filter));

    if (type === 'add') {
      if (newFilter.type[curr] === 'check') {
        if (newFilter[curr].find(item => item === option)) {
          newFilter[curr] = newFilter[curr].filter(item => item !== option);
        } else {
          newFilter[curr].push(option);
        }
      } else {
        newFilter.type[curr] = 'check';
        newFilter[curr] = [];
        newFilter[curr].push(option);
      }
    } else {
      if (newFilter.type[curr] === 'cross') {
        if (newFilter[curr].find(item => item === option)) {
          newFilter[curr] = newFilter[curr].filter(item => item !== option);
        } else {
          newFilter[curr].push(option);
        }
      } else {
        newFilter.type[curr] = 'cross';
        newFilter[curr] = curr === 'roles' ? roles : curr === 'organizations' ? organizations : memberFirms;
        newFilter[curr] = newFilter[curr].filter(item => item !== option);
      }
    }
    setFilter(newFilter);
    setFooterText({roles: arrayToString(newFilter.roles), organizations: arrayToString(newFilter.organizations), memberFirms: arrayToString(newFilter.memberFirms)});
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
      memberFirms: newFilter.memberFirms,
      sort: newSort,
    });

    filterAndSortManagers(newFilter, newSort);
    setIsFilterBoxOpened(false);
  };

  const filterAndSortManagers = (newFilter, newSort) => {

    let newManagers = managers;

    if (newFilter?.roles && newFilter?.roles?.length !== 0) {
      newManagers = newManagers.filter(item => {
        return newFilter.roles.find(role => role === (item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace('_', ' ').slice(1)))
      })
    }

    if (newFilter?.organizations && newFilter?.organizations?.length !== 0) {
      newManagers = newManagers.filter(item => {
        return newFilter.organizations.find(org => org === (item?.permissions?.organization.replace('_', ' ')))
      })
    }

    if (newFilter?.memberFirms && newFilter?.memberFirms?.length !== 0) {
      newManagers = newManagers.filter(item => {
        return newFilter.memberFirms.find(firm => firm === (item?.member_firm?.main_fields?.name))
      })
    }

    // eslint-disable-next-line default-case
    switch (newSort) {
      case 0: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 1: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
      case 2: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 3: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
    }

    handleFilter(newManagers);
  }

  const arrayToString = (array) => {
    if (!array) return ''
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
    setFilter({roles: [], organizations: [], memberFirms: [], type: {roles: 'initial', organizations: 'initial', memberFirms: "initial"}});
    setFooterText({roles: arrayToString([]), organizations: arrayToString([]), memberFirms: arrayToString([])});
  }

  const changeFooterText = (filter) => {
    setFooterText({roles: arrayToString(filter.roles), organizations: arrayToString(filter.organizations), memberFirms: arrayToString(filter.memberFirms)});
  }

  const handleCloseTab = (newFilter) => {
    if (isFilterBoxOpened) return;
    setFilter(newFilter);
    setFooterText({roles: arrayToString(newFilter.roles), organizations: arrayToString(newFilter.organizations), memberFirms: arrayToString(newFilter.memberFirms)});
    applyFilters(newFilter);
    setActiveFilter(null);
    setFilterName('');
  }

  const footer = () => {
    if ((filter.roles.length === 0 && filter.organizations.length === 0)
         ||
        (filter.roles.length === roles.length && filter.organizations.length === organizations.length)) {
      return <p/>
    } else if (filter.roles.length > 0 && filter.organizations.length > 0) {
      return <p className={'filter-text'}>
        Filtering by
        <span className={'blue'}>{footerText.roles}</span>
        from
        <span className={'blue'}>{footerText.organizations}</span>
      </p>
    } else {
      return <p className={'filter-text'}>
        Filtering by
        <span className={'blue'}>{filter.roles.length > 0 ? footerText.roles : footerText.organizations}</span>
      </p>
    }
  }

  if (!filtered && managers.length !== 0 && userFilters) {
    handleFilter(managers);
    setFilter({roles: [], organizations: [], memberFirms: [], type: {roles: 'initial', organizations: 'initial', memberFirms:'initial'}});
    setFiltered(true);
    setFooterText({roles: arrayToString(roles), organizations: arrayToString(organizations), memberFirms: arrayToString(memberFirms)});
  }

  useEffect(() => {
    filterAndSortManagers(
      {roles: appliedFilters.roles, organizations: appliedFilters.organizations, memberFirms: appliedFilters.memberFirms},
      appliedFilters.sort
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managers]);

  useEffect(() => {
    let newMemberFirms = [...filter.memberFirms]
    newMemberFirms = newMemberFirms.filter(item => Array.from(memberFirms).find(elem => item === elem))
    if (filter.memberFirms.length !== newMemberFirms.length) {
      let newFilter = {roles: [...filter.roles], organizations: [...filter.organizations], memberFirms: [...filter.memberFirms],
        type: {roles: filter.type.roles, organizations: filter.type.organizations, memberFirms: filter.type.memberFirms}}
      newFilter.memberFirms = newMemberFirms;
      setFilter(newFilter)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberFirms?.length]);

   useEffect(() => {
    setMemberFirms(memberFirmsObjects?.length > 0 ? memberFirmsObjects.map(item => item?.main_fields.name) : [])
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberFirmsObjects?.length]);

  useEffect(() => {
    if (filter.organizations.length === 0) {
      setMemberFirms(memberFirmsObjects?.length > 0 ? memberFirmsObjects.map(item => item?.main_fields.name) : [])
    } else {
      setMemberFirms(memberFirmsObjects?.length > 0
        ? memberFirmsObjects.filter(item =>
          Array.from(filter.organizations).findIndex(elem => elem === item.network.name) !== -1)
          .map(item => item?.main_fields.name)
        : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.organizations]);


  return (
    <span className={'filters'}>
          <SortingFilters currSort={currSort} setCurrSort={setCurrSort} applyFilters={applyFilters}/>
          <span onClick={() => setIsFilterBoxOpened(!isFilterBoxOpened)} ref={wrapperRefFilterButton} id={'filter-btn'}>
            <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
          </span>
          {filter.roles.length !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.roles.length <= MAX_TABS_LENGTH ? footerText.roles : `${filter.roles.length} roles`}</span>
            <span onClick={() => handleCloseTab({roles:[], organizations: filter.organizations, memberFirms: filter.memberFirms, type: {roles: 'initial', organizations: filter.type.organizations, memberFirms: filter.type.memberFirms}})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          {filter.organizations.length !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.organizations}</span>
            <span onClick={() => handleCloseTab({roles:filter.roles, organizations: [], memberFirms: filter.memberFirms, type: {roles: filter.type.roles, organizations: 'initial', memberFirms: filter.type.memberFirms}})}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
          {filter?.memberFirms?.length !== 0 && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{footerText.memberFirms.length <= MAX_TABS_LENGTH ? footerText.memberFirms : `${filter.memberFirms.length} member firms`}</span>
            <span onClick={() => handleCloseTab({roles:filter.roles, organizations: filter.organizations, memberFirms: [], type: {roles: filter.type.roles, organizations: filter.type.organizations, memberFirms: 'initial'}})}
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
                        <span className={'filter-name'}>Roles ({roles.length})</span>
                        {curr === 'roles' && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                      </Button>
                      <br/>
                      <Button onClick={() => {setCurr('organizations')}} variant="secondary" className={curr === 'organizations' ? 'active' : 'not-active'}>
                        <span className={'filter-name'}>Organizations ({organizations.length})</span>
                        {curr === 'organizations' && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                      </Button>
                      {<Button onClick={() => {setCurr('memberFirms')}} variant="secondary" className={curr === 'memberFirms' ? 'active' : 'not-active'}>
                        <span className={'filter-name'}>Member Firms ({memberFirms.length})</span>
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
                    userFiltersId={userFiltersId}
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
