import {Button} from "reactstrap";
import CloseIcon from "../../../../assets/img/svg/circle-with-cross.svg";
import React, {useEffect, useState} from "react";
import {filterOptionsToText} from "../FilterHelper";

const FILTER_DESCRIPTION_SIZE = 40;

const FilterShorts = ({filter, setFilter, objectsToFilter, filterFunction}) => {
  const filterTabPosition = 'left';
  const [reloadFilter, setReloadFilter] = useState(false);

  const selectedFilters = filter.selectedFilters.filter(item => item.selected.length > 0);

  const removeFiltersByTitle = (title) => {
    const newSelectedFilters = {...filter.selectedFilters.find(item => item.name === title)};
    newSelectedFilters.selected = []
    setFilter({...filter, selectedFilters: [...filter.selectedFilters.filter(item => item.name !== title), newSelectedFilters]})
    setReloadFilter(true);
  }

  useEffect(() => {
    if (reloadFilter) {
      filterFunction(filter, objectsToFilter)

    }
  }, [reloadFilter])

  return (
    <div className={`modal-filter-tabs ${filterTabPosition === 'left' && 'left-orientation-tabs'} ${filterTabPosition === 'right' ? 'right-orientation-tabs' : ""}`}>
      {
        selectedFilters.map((item, key) => {
          const outputText = filterOptionsToText(item.selected)
          return (
              <Button className={'filter-tab member-firm-filter-tab filter-close-button'} variant={'dark'}>
              <span className={'nav-text'}>
                {outputText <= FILTER_DESCRIPTION_SIZE
                  ? outputText
                  : `${item.selected.length} ${item.name}`
                }
              </span>

                <span onClick={() => {removeFiltersByTitle(item.name)}}
                      className={'close-nav'}><img src={CloseIcon} alt={'close-tab'}/></span>
              </Button>
            )
        })
      }
      </div>
  )
}

export default FilterShorts;
