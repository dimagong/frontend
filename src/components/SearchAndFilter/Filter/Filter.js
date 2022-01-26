import FilterIcon from "../../../assets/img/svg/filter.svg";
import FilterComponent from "./FilterComponent";
import React, {useRef, useState} from "react";
import {getInitialFilter} from "./FilterHelper";
import FilterShorts from "./FilterComponents/FilterShorts";
import {useOutsideAlerter} from "../../../hooks/useOutsideAlerter";
import PropTypes from "prop-types";
import './styles.scss';

const Filter = ({objectsToFilter, filterFunction, filterOptionsDictionary, crossSelectingDisabled, savable, hasSearch, ...attrs}) => {
  const filterSettings = {
    savable: savable,
    crossSelectingDisabled: crossSelectingDisabled,
    hasSearch: hasSearch ?? [],
  };
  const [filter, setFilter] = useState(getInitialFilter(Object.keys(filterOptionsDictionary), filterSettings))
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false)

  const wrapperRefFilterButton = useRef(null);
  const wrapperRefFilterBox = useRef(null);

  useOutsideAlerter([wrapperRefFilterBox, wrapperRefFilterButton], () => {
    if (isFilterBoxOpen) {
      setIsFilterBoxOpen(false);
    }
  });

  return (
    <span>
      <span{...attrs}>
        <img ref={wrapperRefFilterButton}
           className={`filter-icon`}
           src={FilterIcon} alt={'filter-icon'}
           onClick={() => {setIsFilterBoxOpen(!isFilterBoxOpen)}}
        />

        {isFilterBoxOpen &&
          <span ref={wrapperRefFilterBox}>
            <FilterComponent
              objectsToFilter={objectsToFilter}
              filterFunction={() => {filterFunction(filter, objectsToFilter); setIsFilterBoxOpen(false)}}
              filter={filter}
              setFilter={setFilter}
              filterOptionsDictionary={filterOptionsDictionary}
              {...attrs}
            />
          </span>
        }
      </span>
      <FilterShorts
        filter={filter}
        setFilter={setFilter}
        objectsToFilter={objectsToFilter}
        filterFunction={filterFunction}
      />
    </span>
    )
}

Filter.defaultProps = {
  objectsToFilter: [],
};

Filter.propTypes = {
  objectsToFilter: PropTypes.array,
  filterFunction: PropTypes.func,
  filterOptionsDictionary: PropTypes.object,
};

export default Filter;
