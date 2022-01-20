import React from 'react'
import {
  Button,
} from 'reactstrap';
import {FilterCheckIcon, FilterCrossIcon} from "./FilterAssets";

const FilterOptions = ({ filter, setFilter, filterOptionsDictionary }) => {
  const currSelectedFilters = {...filter.selectedFilters.find(item => item.key === filter.selectedOptionKey)}


  const filterOptionIsSelected = (option) => {
    return !!currSelectedFilters.selected.find(item => item.name === option)
  }

  const applyFilter = () => {
    const newSelectedFilters = [...filter.selectedFilters]
    newSelectedFilters.splice(filter.selectedOptionKey, 1, currSelectedFilters)
    setFilter({...filter, selectedFilters: newSelectedFilters})
  }

  const onSelectFilterOption = (option) => {
    if (filterOptionIsSelected(option)) {
        currSelectedFilters.selected.filter(item => item === option)
      } else {
        currSelectedFilters.selected.append(option)
      }
  }

  const handleFilterSelectCross = (option) => {
    handleFilterSelectCross.selectOptionBySelectingType[currSelectedFilters.settings.addBySelect](option);
  }

  handleFilterSelectCross.selectOptionBySelectingType = {
    true: (option) => {
      currSelectedFilters.selected = filterOptionsDictionary[currSelectedFilters.name].filter(item => item === option)
      applyFilter();
    },
    false: (option) => {
      onSelectFilterOption(option);
      if (currSelectedFilters.selected.length === filterOptionsDictionary[currSelectedFilters.name].length) {
        currSelectedFilters.selected = []
      }
      applyFilter();
    }
  }

  const handleFilterSelectCheck = (option) => {
    handleFilterSelectCross.selectOptionBySelectingType[currSelectedFilters.settings.addBySelect](option);
  }

  handleFilterSelectCheck.selectOptionBySelectingType = {
    true: (option) => {
      onSelectFilterOption(option);
      applyFilter();
    },
    false: (option) => {
      currSelectedFilters.selected = [option]
      applyFilter()
    }
  }

  return filterOptionsDictionary[currSelectedFilters.name].map(item =>
    <Button className={'filter-option not-active'} variant="primary">
      <span className={'filter-name'}>{item}</span>
      <span className={'filter-right'}>
          <span>
            <span className={'filter-check'} onClick={() => handleFilterSelectCross(item)}>
              <FilterCrossIcon
                filter={filter}
                currOption={item}
              />
            </span>
            <span className={'filter-check'} onClick={() => handleFilterSelectCheck(item)}>
              <FilterCheckIcon
                filter={filter}
                currOption={item}
              />
            </span>
          </span>
        </span>
    </Button>)
}

export default FilterOptions;
