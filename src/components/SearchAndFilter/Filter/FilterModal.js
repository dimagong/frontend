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
import SavedFilters from "./SavedFilters";
import {useOutsideAlerter} from "hooks/useOutsideAlerter";

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
    curr,
    setCurr,
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
        newFilter[curr] = filterTypes[curr];
        newFilter[curr] = newFilter[curr].filter(item => item !== option);
      }
    }
    setFilter(newFilter);
    setFooterText({roles: arrayToString(newFilter.roles), organizations: arrayToString(newFilter.organizations), memberFirms: arrayToString(newFilter.memberFirms)});
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

    switch (newSort) {
      case 0: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 1: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
      case 2: newManagers.sort((lhs, rhs) => lhs.first_name.localeCompare(rhs.first_name)); break;
      case 3: newManagers.sort((lhs, rhs) => rhs.first_name.localeCompare(lhs.first_name)); break;
    }

    handleFilter(newManagers, filter);
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
    let newFooterText = {}
    Object.keys(filter).forEach(item => {
      newFooterText[item] = arrayToString(filter[item]);
    });
    setFooterText(newFooterText);
  }

  const footer = () => {
    if ((filter?.roles?.length === 0 && filter?.organizations?.length === 0)
         ||
        (filter?.roles?.length === filterTypes?.role?.length && filter?.organizations?.length === filterTypes?.organizations?.length)) {
      return <p/>
    } else if (filter?.roles?.length > 0 && filter?.organizations?.length > 0) {
      return <p className={'filter-text'}>
        Filtering by
        <span className={'blue'}>{footerText.roles}</span>
        from
        <span className={'blue'}>{footerText.organizations}</span>
      </p>
    } else {
      return <p className={'filter-text'}>
        Filtering by
        <span className={'blue'}>{Object.values(filter)[0].length > 0 ? footerText[Object.keys(filter)[0]] : ' chosen options'}</span>
      </p>
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
                        <Button onClick={() => {setCurr(key)}} variant="secondary" className={curr === key ? 'active' : 'not-active'}>
                          <span className={'filter-name'}>{key.charAt(0).toUpperCase() + key.slice(1)} ({filterTypes[key].length})</span>
                          {curr === key && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                        </Button>
                      ))}
                    </Col>
                    <Col className={'right'} id={'filter-options-right'}>
                      <span>
                        <FilterOptions
                          filter={filter}
                          curr={curr}
                          options={filterTypes[curr]}
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
