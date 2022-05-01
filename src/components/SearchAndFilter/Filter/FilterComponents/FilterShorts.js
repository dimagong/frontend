import { Button } from "reactstrap";
import CloseIcon from "../../../../assets/img/svg/circle-with-cross.svg";
import React, { useEffect, useState } from "react";
import { filterOptionsToText } from "../FilterHelper";
import Filter from "../Filter";
import PropTypes from "prop-types";

const FILTER_DESCRIPTION_SIZE = 40;

const FilterShorts = ({ filter, setFilter, objectsToFilter, filterFunction }) => {
  const [reloadFilter, setReloadFilter] = useState(false);

  const selectedFilters = filter.selectedFilters.filter((item, key) => item.selected.length > 0);

  const removeFiltersByTitle = (title) => {
    const newSelectedFilters = { ...filter.selectedFilters.find((item, key) => item.name === title) };
    newSelectedFilters.selected = [];
    setFilter({
      ...filter,
      selectedFilters: [...filter.selectedFilters.filter((item, key) => item.name !== title), newSelectedFilters],
    });
    setReloadFilter(true);
  };

  useEffect(() => {
    if (reloadFilter) {
      filterFunction(filter, objectsToFilter);
      setReloadFilter(false);
    }
  }, [reloadFilter]);

  return (
    <div className={`left-orientation-tabs`}>
      {selectedFilters.map((item, key) => {
        const outputText = filterOptionsToText(item.selected);
        return (
          <Button className={"filter-tab member-firm-filter-tab filter-close-button"} variant={"dark"} key={key}>
            <span className={"nav-text"}>
              {outputText.length <= FILTER_DESCRIPTION_SIZE ? outputText : `${item.selected.length} ${item.name}`}
            </span>

            <span
              onClick={() => {
                removeFiltersByTitle(item.name);
              }}
              className={"close-nav"}
            >
              <img src={CloseIcon} alt={"close-tab"} />
            </span>
          </Button>
        );
      })}
    </div>
  );
};

FilterShorts.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  filterOptionsDictionary: PropTypes.object,
  filterFunction: PropTypes.func,
};

export default FilterShorts;
