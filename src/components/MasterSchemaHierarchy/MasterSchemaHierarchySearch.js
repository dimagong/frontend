import _ from "lodash";
import React from "react";
import { get } from "lodash/fp";
import PropTypes from "prop-types";

import SearchAndFilter from "../SearchAndFilter";

const formatDate = (date) => {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  if (date?.length > 1) {
    return date.map((item) => item.toLocaleString("en-CA", options));
  } else {
    return [null, null];
  }
};

const filterDFormsByName = (dForms, name) =>
  dForms.filter((item) => item.groups.filter((group) => group.name === name).length > 0);

const MasterSchemaHierarchySearch = ({ hierarchy, dForms, onSearch }) => {
  const filterTypes = React.useMemo(
    () => (hierarchy ? filterDFormsByName(dForms, hierarchy.name) : []),
    [dForms, hierarchy]
  );
  const filterNames = React.useMemo(() => filterTypes.map(get("name")), [filterTypes]);

  const onSearchSubmit = React.useCallback(
    (searchName) => {
      const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;

      onSearch({ name: searchValue });
    },
    [onSearch]
  );

  const onFilterSubmit = React.useCallback(
    (filter, filterHierarchy) => {
      if (!filterHierarchy) return;

      const filters = _.intersectionBy(
        dForms.filter((item) => item.groups.filter((group) => group.name === filterHierarchy.name).length > 0),
        filter.selectedFilters
          .find((item) => item.name === "applications")
          .selected.map((item) => {
            return { name: item };
          }),
        "name"
      ).map((item) => item.id);

      onSearch({ application_ids: filters });
    },
    [dForms, onSearch]
  );

  const onCalendarChange = React.useCallback(
    (date) => {
      const formattedDate = formatDate(date);

      onSearch({ date_begin: formattedDate[0], date_end: formattedDate[1] });
    },
    [onSearch]
  );

  if (!hierarchy) {
    return (
      <SearchAndFilter
        hasIcon
        isCalendar
        dataToFilter={null}
        filterTabPosition={"left"}
        applyFilter={onFilterSubmit}
        handleSearch={onSearchSubmit}
        onCalendarChange={onCalendarChange}
        filterTypes={{ applications: filterNames }}
      />
    );
  }

  return (
    <SearchAndFilter
      hasIcon
      isCalendar
      dataToFilter={hierarchy}
      filterTabPosition={"left"}
      applyFilter={onFilterSubmit}
      handleSearch={onSearchSubmit}
      onCalendarChange={onCalendarChange}
      filterTypes={{ applications: filterNames }}
    />
  );
};

MasterSchemaHierarchySearch.propTypes = {
  hierarchy: PropTypes.object,
  dForms: PropTypes.arrayOf(PropTypes.object),
  onSearch: PropTypes.func.isRequired,
};

export default MasterSchemaHierarchySearch;
