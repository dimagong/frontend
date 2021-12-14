import AutoComplete from "../@vuexy/autoComplete/AutoCompleteComponent";
import FilterIcon from "../../assets/img/svg/filter.svg";
import CalendarIcon from "../../assets/img/svg/calendar.svg";
import React, {useEffect, useRef, useState} from "react";
import FilterModal from "./Filter/FilterModal";
import {Button} from "reactstrap";
import CloseIcon from "@material-ui/icons/Close";
import './styles.scss';
import 'react-calendar/dist/Calendar.css';
import Calendar from "react-calendar";
import {useOutsideAlerter} from "../../hooks/useOutsideAlerter";
import _ from "lodash";

const SearchAndFilter = (props) => {
  const {
    handleSearch,
    handleFilter,
    onCancelFilter,
    dataToFilter,
    filterTypes,
    applyFilter,
    isCalendar,
    onCalendarChange,
    onFilterOptionCancel
  } = props;

  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const wrapperRefFilterButton = useRef(null);
  const wrapperRefCalendarButton = useRef(null);
  const wrapperRefCalendarContainer = useRef(null);
  const [filterName, setFilterName] = useState('');
  const [filter, setFilter] = useState({});
  const [footerText, setFooterText] = useState({});
  const [currFilterOption, setCurrFilterOption] = useState('');
  const [appliedFilter, setAppliedFilter] = useState({});
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState(new Date());
  const [calendarText, setCalendarText] = useState('');

  const FILTER_DESCRIPTION_SIZE = 40;

  const stylesWithCalendar = {left: 'unset', right: '29%', top: 50, marginBottom: 0}
  const stylesWithoutCalendar = {left: 'unset', right: '5%', top: 50, marginBottom: 0}

  const applyFilterCustom = (managers, filter) => {
    applyFilter(managers, filter);
    setIsFilterBoxOpen(false);
  }

  const clearOneFilterType = (typeToClear) => {
    let clearedFilter = {...filter}
    let clearedFooterText = {...footerText}
    clearedFilter[typeToClear] = [];
    clearedFooterText[typeToClear] = '';
    clearedFilter.type = {...clearedFilter.type, [typeToClear]: 'initial'};

    let isFilterEmpty = !Object.keys(clearedFilter).find(item => item !== 'type' && clearedFilter[item].length > 0);

    if (isFilterEmpty) {
      onCancelFilter();
    } else {
      applyFilterCustom(dataToFilter, clearedFilter);
    }
    setFooterText(clearedFooterText);
    setFilter(clearedFilter);
    setAppliedFilter(clearedFilter);
    if (onFilterOptionCancel) {
      onFilterOptionCancel(typeToClear)
    }
  }

  const onCustomCalendarChange = (value, event) => {
    let options = {day: 'numeric', month: 'numeric', year: '2-digit'};
    if (Array.isArray(value)) {
      setCalendarText(value[0].toLocaleString('en-GB', options) + ' - ' + value[1].toLocaleString('en-GB', options));
    }
    setCurrentDateRange(value);
    onCalendarChange(value);
    setIsCalendarOpened(false);
  }

  const overwriteFilterOption = (currFilter, option) => {
    currFilter[option] = _.intersection(filter[option], filterTypes[option]);
    currFilter.type = {...currFilter.type, [option]: currFilter[option].length > 0 ? filter.type[option] : 'initial'};
  }


  useEffect(() => {
    if (!filterTypes) {
      return;
    }

    if (!currFilterOption || !Object.keys(filterTypes).includes(currFilterOption)) {
        setCurrFilterOption(Object.keys(filterTypes)[0]);
      }

    let newFooterText = {};
    Object.keys(filterTypes).forEach(item => newFooterText[item] = footerText[item] ? footerText[item] : '');
    setFooterText(newFooterText);

    let newFilter = {};
    Object.keys(filterTypes).forEach(item => overwriteFilterOption(newFilter, item));
    setFilter(newFilter);

  }, [filterTypes])

  useOutsideAlerter([wrapperRefCalendarButton, wrapperRefCalendarContainer],
    () => setIsCalendarOpened(false));

  if (!currFilterOption || !filter.hasOwnProperty(currFilterOption)) {
    return <div/>
  }

  return <div className={'search-and-filter-container'}>
    <div className={`autocomplete-search-container ${isCalendar ? 'small-autocomplete' : 'large-autocomplete'}`}>
            <AutoComplete
              placeholder="Search"
              suggestions={[]}
              className="form-control"
              filterKey="name"
              onChange={handleSearch}
              onEnter={handleSearch}
              suggestionLimit={4}
              defaultSuggestions={false}
              customRender={() => {}}
              showClear={true}
              hideSuggestions
            />
    </div>
          <img ref={wrapperRefFilterButton}
               className={`filter-icon member-firm-filter-icon ${isCalendar ? 'small-filter-icon' : 'large-filter-icon'}`}
               src={FilterIcon} alt={'filter-icon'}
               onClick={() => {setIsFilterBoxOpen(!isFilterBoxOpen)}}
          />
          {isCalendar && <span className={'calendar-container'}>
            <img src={CalendarIcon} alt={'calendar-icon'}
                 className={'member-firm-calendar-icon member-firm-icon'}
                 onClick={() => setIsCalendarOpened(!isCalendarOpened)}
                 ref={wrapperRefCalendarButton}
            />
            {calendarText}
            </span>
          }
          {isFilterBoxOpen && <FilterModal
            managers={dataToFilter}
            handleFilter={handleFilter}
            wrapperRefFilterButton={wrapperRefFilterButton}
            style={isCalendar ? stylesWithCalendar : stylesWithoutCalendar}
            filterTypes={filterTypes}
            filter={filter}
            setFilter={setFilter}
            setIsFilterBoxOpen={setIsFilterBoxOpen}
            currFilterOption={currFilterOption}
            setCurrFilterOption={setCurrFilterOption}
            footerText={footerText}
            setFooterText={setFooterText}
            filterName={filterName}
            setFilterName={setFilterName}
            applyFilterCustom={applyFilter ? applyFilterCustom : undefined}
            setAppliedFilter={setAppliedFilter}
          />}

          {
            isCalendarOpened &&
              <div className={'calendar-component'} ref={wrapperRefCalendarContainer}>
                <Calendar
                  onChange={onCustomCalendarChange}
                  value={currentDateRange}
                  locale={'en-EN'}
                  selectRange
                />
                </div>
          }

          <div className={'modal-filter-tabs'}>
            {appliedFilter && Object.keys(appliedFilter).map(item => {
              if (item !== 'type' && appliedFilter[item].length > 0) {
                return (
                  <Button className={'filter-tab member-firm-filter-tab filter-close-button'} variant={'dark'}>
                    <span className={'nav-text'}>
                      {footerText[item].length <= FILTER_DESCRIPTION_SIZE
                        ? footerText[item]
                        : `${filter[item].length} ${item}`
                      }
                    </span>

                    <span onClick={() => {clearOneFilterType(item)}}
                          className={'close-nav'}><CloseIcon/></span>
                  </Button>
                )
              }
            })}
          </div>
  </div>



}

export default SearchAndFilter;
