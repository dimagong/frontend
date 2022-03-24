import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React from "react";
import { Button } from "reactstrap";
import Filter from "../Filter";
import PropTypes from "prop-types";

const FilterOptionTitles = ({ filter, setFilter, filterOptionsDictionary }) => {
  return Object.keys(filterOptionsDictionary).map((filterOption, key) => (
    <Button
      onClick={() => setFilter({ ...filter, selectedOptionKey: key })}
      variant="secondary"
      key={key}
      className={filter.selectedOptionKey === key ? "active" : "not-active"}
    >
      <span className={"filter-name"}>
        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} ({filterOptionsDictionary[filterOption].length})
      </span>
      {filter.selectedOptionKey === key && (
        <span className={"filter-right"}>
          <ArrowForwardIosIcon />
        </span>
      )}
    </Button>
  ));
};

FilterOptionTitles.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  filterOptionsDictionary: PropTypes.object,
};

export default FilterOptionTitles;
