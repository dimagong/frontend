import FilterIcon from "../../../assets/img/svg/filter.svg";
import CalendarIcon from "../../../assets/img/svg/calendar.svg";
import {Close} from "@material-ui/icons";
import FilterComponent from "./FilterComponent";
import CloseIcon from "../../../assets/img/svg/circle-with-cross.svg";
import React, {useEffect, useRef, useState} from "react";
import {getInitialFilter} from "./FilterHelper";
import FilterShorts from "./FilterComponents/FilterShorts";

const Filter = ({objectsToFilter, filterFunction, filterOptionsDictionary, ...attrs}) => {

  const [filter, setFilter] = useState(getInitialFilter(objectsToFilter, false))
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false)


  const wrapperRefFilterButton = useRef(null);

  return (
    <span {...attrs}>
      <img ref={wrapperRefFilterButton}
           //className={`filter-icon member-firm-filter-icon ${isCalendar ? 'small-filter-icon' : 'large-filter-icon'}`}
           src={FilterIcon} alt={'filter-icon'}
           onClick={() => {setIsFilterBoxOpen(!isFilterBoxOpen)}}
      />

      <FilterShorts
        filter={filter}
        objectsToFilter={objectsToFilter}
        filterFunction={filterFunction}
      />

      {isFilterBoxOpen &&
        <FilterComponent
          objectsToFilter={objectsToFilter}
          filterFunction={filterFunction}
          filter={filter}
          setFilter={setFilter}
          filterOptionsDictionary={filterOptionsDictionary}
        />
      }
    </span>
    )
}
