import React from "react";

export const arrayToString = (array) => {
    if (!array) return ''
    let res = ' ';
    for (let i = 0; i < array.length; ++i) {
      switch (i) {
        case array.length - 1: res += array[i] + ' '; break;
        case array.length - 2: res += array[i] + ' or '; break;
        default: res += array[i] + ', '; break;
      }
    }
    return res;
  }

  export const filterToText = (currFilter, filterTypes) => {
    let filterText = {}
    filterTypes.forEach(item => {
      if (item !== 'type') {
        filterText[item] = arrayToString(currFilter[item])
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
