import AutoComplete from "../@vuexy/autoComplete/AutoCompleteComponent";
import SearchIcon from "../../assets/img/svg/searchIcon.svg";
import CalendarIcon from "../../assets/img/svg/calendar.svg";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles.scss";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { Close } from "@material-ui/icons";
import _ from "lodash";
import { Spinner } from "reactstrap";
import Filter from "./Filter/Filter";

const SearchAndFilter = (props) => {
  const {
    handleSearch,
    dataToFilter,
    filterTypes,
    applyFilter,
    isCalendar,
    onCalendarChange,
    className,
    hasIcon,
    placeholder,
    filterTabPosition,
    loading,
    crossSelectingDisabled,
    hideFilter,
  } = props;

  const wrapperRefCalendarButton = useRef(null);
  const wrapperRefCalendarContainer = useRef(null);
  const [filter, setFilter] = useState({});
  const [footerText, setFooterText] = useState({});
  const [currFilterOption, setCurrFilterOption] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({});
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState(new Date());
  const [calendarText, setCalendarText] = useState("");

  const debounceOnChange = useCallback(
    _.debounce(function (text) {
      handleSearch({ target: { value: text } });
    }, 1000),
    [handleSearch]
  );

  const handleOnChange = (input) => {
    debounceOnChange(input.target.value);
  };

  const onCustomCalendarChange = (value, event) => {
    let options = { day: "numeric", month: "numeric", year: "2-digit" };
    if (Array.isArray(value)) {
      setCalendarText(value[0].toLocaleString("en-GB", options) + " - " + value[1].toLocaleString("en-GB", options));
    }
    setCurrentDateRange(value);
    onCalendarChange(value);
    setIsCalendarOpened(false);
  };

  const overwriteFilterOption = (currFilter, option) => {
    currFilter[option] = _.intersection(filter[option], filterTypes[option]);
    currFilter.type = { ...currFilter.type, [option]: currFilter[option].length > 0 ? filter.type[option] : "initial" };
  };

  const handleCalendarClear = (e) => {
    e.stopPropagation();
    setCurrentDateRange(null);
    onCalendarChange(null);
    setCalendarText("");
  };

  useEffect(() => {
    if (!filterTypes) {
      return;
    }

    if (!currFilterOption || !Object.keys(filterTypes).includes(currFilterOption)) {
      setCurrFilterOption(Object.keys(filterTypes)[0]);
    }

    let newFooterText = {};
    Object.keys(filterTypes).forEach((item) => (newFooterText[item] = footerText[item] ? footerText[item] : ""));
    setFooterText(newFooterText);

    let newFilter = {};
    Object.keys(filterTypes).forEach((item) => overwriteFilterOption(newFilter, item));
    setFilter(newFilter);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTypes]);

  useOutsideAlerter([wrapperRefCalendarButton, wrapperRefCalendarContainer], () => setIsCalendarOpened(false));

  if (!currFilterOption || !filter.hasOwnProperty(currFilterOption)) {
    return <div />;
  }

  return (
    <div className={"search-and-filter-container"}>
      <div>
        <div className={`autocomplete-search-container ${isCalendar ? "small-autocomplete" : "large-autocomplete"}`}>
          {hasIcon && <img src={SearchIcon} alt={"search-icon"} className={"search-icon"} />}
          <AutoComplete
            placeholder={placeholder ? placeholder : "Search"}
            suggestions={[]}
            className={`form-control ${hasIcon && "search-and-filter-with-icon"} ${className}`}
            filterKey="name"
            onChange={handleOnChange}
            onEnter={(text) => {
              handleOnChange({ target: { value: text } });
            }}
            suggestionLimit={4}
            defaultSuggestions={false}
            customRender={() => {}}
            showClear={true}
            hideSuggestions
            disabled={loading}
          />
        </div>
        {loading ? (
          <span
            className={`filter-icon member-firm-filter-icon ${isCalendar ? "small-filter-icon" : "large-filter-icon"}`}
          >
            <Spinner />
          </span>
        ) : (
          !hideFilter && (
            <Filter
              objectsToFilter={dataToFilter}
              filterOptionsDictionary={filterTypes}
              filterFunction={applyFilter}
              className={`${isCalendar ? "filter-in-search-calendar" : "filter-in-search"} ${
                filterTabPosition === "right" ? "filter-shorts-to-right" : ""
              }`}
              crossSelectingDisabled={crossSelectingDisabled}
            />
          )
        )}

        {isCalendar && (
          <span
            className={"calendar-container"}
            onClick={() => setIsCalendarOpened(!isCalendarOpened)}
            ref={wrapperRefCalendarButton}
          >
            <img src={CalendarIcon} alt={"calendar-icon"} className={"member-firm-calendar-icon member-firm-icon"} />
            {calendarText}
            {calendarText && <Close onClick={handleCalendarClear} />}
          </span>
        )}

        {isCalendarOpened && (
          <div className={"calendar-component"} ref={wrapperRefCalendarContainer}>
            <Calendar onChange={onCustomCalendarChange} value={currentDateRange} locale={"en-EN"} selectRange />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
