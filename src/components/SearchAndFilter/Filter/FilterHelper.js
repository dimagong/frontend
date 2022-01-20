import React from "react";

export const filterOptionsToText = (options) => {
    if (!options) return ''
    let result = ' ';
    for (let i = 0; i < options.length; ++i) {
      switch (i) {
        case options.length - 1: result += options[i] + ' '; break;
        case options.length - 2: result += options[i] + ' or '; break;
        default: result += options[i] + ', '; break;
      }
    }
    return result;
  }

  export const filterToText = (currFilter, filterTypes) => {
    let filterText = {}
    filterTypes.forEach(item => {
      if (item !== 'type') {
        filterText[item] = filterOptionsToText(currFilter[item])
      }
    })
    return filterText;
  }

  export const getFilterTypes = (filter) => {
    return Object.keys(filter).filter(item => item !== 'type' && filter[item].length > 0);
  }

  export const getDefaultFilterOutput = (footerText) => {
    return <p className={'filter-text'}>
        Filtering by
        <span className={'blue'}>{footerText.roles}</span>
        from
        <span className={'blue'}>{footerText.organizations}</span>
      </p>
  }

  export const getInitialFilter = (filterOptionsList, savable) => {
    let initialFilter = {
      selectedFilters: [],
      selectedOptionKey: 0,
      savable: savable,
    };

    filterOptionsList.forEach((item, key) => {
      initialFilter.selectedFilters.push(
        {
          key: key,
          name: item,
          selected: [],
          settings: {
            addBySelect: true, // if true then by selecting filter, it will be added, otherwise it will be removed
            searchable: false
          }
        }
      )
    })

    return initialFilter;
  }
