import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React from "react";
import {Button} from "reactstrap";

const FilterOptionTitles = ({filter, setFilter, filterOptionsDictionary, }) => {
  return (
    Object.keys(filterOptionsDictionary).map((filterOption, key) => (
      <Button
        onClick={() => setFilter({...filter, selectedOptionKey: key})}
        variant="secondary"
        className={filter.selectedOptionKey === key ? "active" : "not-active"}>
          <span className={"filter-name"}>
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} ({filterOptionsDictionary[filterOption].length})
          </span>
          {filter.selectedOptionKey === key && (
             <span className={"filter-right"}>
               <ArrowForwardIosIcon/>
             </span>
          )}
      </Button>
    )))
}

export default FilterOptionTitles;
