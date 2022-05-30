import { filterOptionsToText, getDefaultFilterOutput, getFilterTypes } from "../FilterHelper";
import React from "react";

const FilterFooter = ({ filter }) => {
  if (filter?.roles?.length > 0 && filter?.organizations?.length > 0) {
    return getDefaultFilterOutput(filter);
  }

  const selectedFilters = filter.selectedFilters.filter((item, key) => item.selected.length > 0);

  switch (selectedFilters.length) {
    case 2:
      return (
        <p className={"filter-text"}>
          Filtering by <span className={"blue"}>{filterOptionsToText(selectedFilters[0].selected)}</span> and{" "}
          <span className={"blue"}>{filterOptionsToText(selectedFilters[1].selected)}</span>
        </p>
      );

    case 1:
      return (
        <p className={"filter-text"}>
          Filtering by <span className={"blue"}>{filterOptionsToText(selectedFilters[0].selected)}</span>
        </p>
      );

    case 0:
      return <p />;

    default:
      return <p>Filtering by chosen options</p>;
  }
};

export default FilterFooter;
