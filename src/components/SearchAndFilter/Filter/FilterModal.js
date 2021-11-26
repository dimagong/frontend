import React, {useRef, useState} from 'react'

import {
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FilterOptions from "./FilterOptions";
import {useSelector} from "react-redux";
import {selectFilters, selectFiltersId} from "app/selectors/userSelectors";
import SavedFilters from "features/home/ContextSearch/ContextSearchNav/Filters/SavedFilters";
import {useOutsideAlerter} from "hooks/useOutsideAlerter";
import {arrayToString, filterToText, getFilterTypes, getDefaultFilterOutput} from "./FilterHelper";

const FilterModal = (props) => {
  const {
    handleFilter,
    managers,
    wrapperRefFilterButton,
    style,
    filterTypes,
    filter,
    setFilter,
    setIsFilterBoxOpen,
    currFilterOption,
    setCurrFilterOption,
    footerText,
    setFooterText,
    filterName,
    setFilterName,
    applyFilterCustom,
    setAppliedFilter
  } = props;

  const userFilters = useSelector(selectFilters);
  const userFiltersId = useSelector(selectFiltersId);

  const [appliedFilters, setAppliedFilters] = useState({roles: [], organizations: [], memberFirms: [], sort: -1});
  const [activeFilter, setActiveFilter] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isFilterBoxOpened, setIsFilterBoxOpened] = useState(false);
  const [currSort, setCurrSort] = useState(-1);

  const wrapperRefFilterBox = useRef(null)
  useOutsideAlerter([wrapperRefFilterBox, wrapperRefFilterButton], () => {if (!isDeleteModalOpen) setIsFilterBoxOpen(false)});

  const checkFullCrossOptions = (currFilter) => {
    if (currFilter.type[currFilterOption] === 'cross' && currFilter[currFilterOption].length === filterTypes[currFilterOption].length) {
        currFilter[currFilterOption] = [];
        currFilter.type[currFilterOption] = 'initial';
    }
  }

  const updateSelectedOptions = (currFilter, option) => {
    if (currFilter[currFilterOption].includes(option)) {
      currFilter[currFilterOption] = currFilter[currFilterOption].filter(item => item !== option);
    } else {
      currFilter[currFilterOption].push(option);
    }

    checkFullCrossOptions(currFilter);
  }

  const changeFilterType = (currFilter, type, option) => {
    currFilter.type[currFilterOption] = type;
    currFilter[currFilterOption] = changeFilterType.newOptions[type](filterTypes[currFilterOption], option)
  }

  changeFilterType.newOptions = {
    'check': (allOptions, newOption) => [newOption],
    'cross': (allOptions, newOption) => allOptions.filter(item => item !== newOption),
  }

  const changeFilterOptions = (currFilter, type, option) => {
    if (currFilter.type[currFilterOption] === type) {
        updateSelectedOptions(currFilter, option);
      } else {
        changeFilterType(currFilter, type, option);
    }

    return currFilter;
  }

  const handleFilterOptions = (type, option) => {
    let newFilter = JSON.parse(JSON.stringify(filter));

    newFilter = (type === 'add')
      ? changeFilterOptions(newFilter, 'check', option)
      : changeFilterOptions(newFilter, 'cross', option);

    setFilter(newFilter);
    setFooterText(filterToText(newFilter, Object.keys(filterTypes)));
  }


  const applyFiltersDefault = (newFilter, newSort) => {
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
    let newManagers = [...managers];

    getFilterTypes(newFilter).forEach(item =>
      newManagers = filterAndSortManagers.filterByType[item](newManagers, newFilter))

    switch (newSort) {
      case 0: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 1: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
      case 2: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 3: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
    }

    handleFilter(newManagers, filter);
  }

  filterAndSortManagers.filterByType = {
    'roles': (newManagers, newFilter) => newManagers.filter(item =>
        newFilter.organizations.find(org => org === (item?.permissions?.organization.replace('_', ' ')))),

    'organizations': (newManagers, newFilter) => newManagers.filter(item =>
        newFilter.organizations.find(org => org === (item?.permissions?.organization.replace('_', ' ')))),

    'memberFirms': (newManagers, newFilter) => newManagers.filter(item =>
        newFilter.memberFirms.find(firm => firm === (item?.member_firm?.main_fields?.name)))
  }


  const initialFilter = () => {
    let emptyFilter = {}
    let emptyFooterText = {}
    Object.keys(filter).forEach(item => {
      emptyFilter[item] = [];
      emptyFooterText[item] = arrayToString([]);
      emptyFilter.type = {...emptyFilter.type, [item]: 'initial'};
    });
    setFilter(emptyFilter);
    setFooterText(emptyFooterText);
  }

  const changeFooterText = (filter) => {
    setFooterText(filterToText(filter, filterTypes));
  }

  const footer = () => {
    let filterTypes = getFilterTypes(filter);

    if (filter?.roles?.length > 0 && filter?.organizations?.length > 0) {
      return getDefaultFilterOutput(footerText);
    }

    switch (filterTypes.length) {
      case 1: return <p className={'filter-text'}>
        Filtering by <span className={'blue'}>{footerText[filterTypes[0]]}</span>
      </p>

      case 0: return <p/>

      default: return <p>Filtering by chosen options</p>
    }
  }

  return (
    <span style={style} ref={wrapperRefFilterBox} className={'filter-box opened'}>
            <Card style={{marginBottom: 0}}>
              <ListGroup variant="flush">
                <ListGroupItem className={'filter-header'}>Filter design</ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col className={'left'}>
                      {Object.keys(filterTypes).map(key => (
                        <Button onClick={() => {setCurrFilterOption(key)}} variant="secondary" className={currFilterOption === key ? 'active' : 'not-active'}>
                          <span className={'filter-name'}>{key.charAt(0).toUpperCase() + key.slice(1)} ({filterTypes[key].length})</span>
                          {currFilterOption === key && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                        </Button>
                      ))}
                    </Col>
                    <Col className={'right'} id={'filter-options-right'}>
                      <span>
                        <FilterOptions
                          filter={filter}
                          currFilterOption={currFilterOption}
                          options={filterTypes[currFilterOption]}
                          handleFilterOptions={handleFilterOptions}
                        />
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
                    <Button variat="success"
                            onClick={() => {applyFilterCustom
                              ? applyFilterCustom(managers, filter)
                              : applyFiltersDefault(filter);
                              setAppliedFilter(filter);
                            }}>
                      Apply filter
                    </Button>
                  </div>
                  </ListGroupItem>
              </ListGroup>
          </Card>
    </span>
  )
}

export default FilterModal;
