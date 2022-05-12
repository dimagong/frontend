import React from "react";
import { Button } from "reactstrap";
import { FilterCheckIcon, FilterCrossIcon } from "./FilterAssets";
import PropTypes from "prop-types";
import Select from "react-select";

const FilterOptions = ({ filter, setFilter, filterOptionsDictionary }) => {
  const currSelectedFilters = JSON.parse(JSON.stringify(filter)).selectedFilters.find(
    (item, key) => item.key === filter.selectedOptionKey
  );

  const filterOptionIsSelected = (option) => {
    return !!currSelectedFilters.selected.find((item, key) => item === option);
  };

  const applyFilter = () => {
    const newSelectedFilters = [...filter.selectedFilters];
    newSelectedFilters.splice(filter.selectedOptionKey, 1, currSelectedFilters);
    setFilter({ ...filter, selectedFilters: newSelectedFilters });
  };

  const onSelectFilterOption = (option) => {
    if (filterOptionIsSelected(option)) {
      currSelectedFilters.selected = currSelectedFilters.selected.filter((item, key) => item !== option);
    } else {
      currSelectedFilters.selected.push(option);
    }
  };

  const handleFilterSelectCross = (option) => {
    handleFilterSelectCross.selectOptionBySelectingType[currSelectedFilters.settings.addBySelect](option);
  };

  handleFilterSelectCross.selectOptionBySelectingType = {
    true: (option) => {
      currSelectedFilters.selected = filterOptionsDictionary[currSelectedFilters.name].filter(
        (item, key) => item !== option
      );
      currSelectedFilters.settings.addBySelect = false;
      applyFilter();
    },
    false: (option) => {
      onSelectFilterOption(option);
      if (currSelectedFilters.selected.length === filterOptionsDictionary[currSelectedFilters.name].length) {
        currSelectedFilters.selected = [];
      }
      applyFilter();
    },
  };

  const handleFilterSelectCheck = (option) => {
    handleFilterSelectCheck.selectOptionBySelectingType[currSelectedFilters.settings.addBySelect](option);
  };

  handleFilterSelectCheck.selectOptionBySelectingType = {
    true: (option) => {
      onSelectFilterOption(option);
      applyFilter();
    },
    false: (option) => {
      currSelectedFilters.settings.addBySelect = true;
      currSelectedFilters.selected = [option];
      applyFilter();
    },
  };

  return (
    <>
      {filter.hasSearch && filter.hasSearch.includes(filter.selectedFilters[filter.selectedOptionKey].name) && (
        <Select
          options={filterOptionsDictionary[filter.selectedFilters[filter.selectedOptionKey].name].map((item) => {
            return { label: item, value: item };
          })}
          onChange={onSelectFilterOption}
          isSearchable
          isClearable
        />
      )}

      {filterOptionsDictionary[currSelectedFilters.name].map((item, key) => (
        <Button className={"filter-option not-active"} variant="primary" key={key}>
          <span className={"filter-name"}>{item}</span>
          <span className={"filter-right"}>
            <span>
              {!filter.crossSelectingDisabled && (
                <span className={"filter-check"} onClick={() => handleFilterSelectCross(item)}>
                  <FilterCrossIcon filter={filter} currOption={item} />
                </span>
              )}
              <span className={"filter-check"} onClick={() => handleFilterSelectCheck(item)}>
                <FilterCheckIcon filter={filter} currOption={item} />
              </span>
            </span>
          </span>
        </Button>
      ))}
    </>
  );
};

FilterOptions.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  filterOptionsDictionary: PropTypes.object,
};

export default FilterOptions;
