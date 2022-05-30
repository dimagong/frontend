import _ from "lodash";
import React from "react";
import { get } from "lodash/fp";
import PropTypes from "prop-types";

import SearchAndFilter from "../SearchAndFilter";
import { useStoreQuery } from "../../hooks/useStoreQuery";
import { selectdForms } from "../../app/selectors";
import appSlice from "../../app/slices/appSlice";

const { getdFormsRequest } = appSlice.actions;

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

const MasterSchemaHierarchySearch = ({ hierarchy, hierarchyName, onSearch }) => {
  const { data: dForms } = useStoreQuery(() => getdFormsRequest(), selectdForms);

  const filterTypes = React.useMemo(() => filterDFormsByName(dForms || [], hierarchyName), [dForms, hierarchyName]);
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
      const filters = _.intersectionBy(
        dForms.filter((item) => item.groups.filter((group) => group.name === hierarchyName).length > 0),
        filter.selectedFilters
          .find((item) => item.name === "applications")
          .selected.map((item) => {
            return { name: item };
          }),
        "name"
      ).map((item) => item.id);

      onSearch({ application_ids: filters });
    },
    [dForms, hierarchyName, onSearch]
  );

  const onCalendarChange = React.useCallback(
    (date) => {
      const formattedDate = formatDate(date);

      onSearch({ date_begin: formattedDate[0], date_end: formattedDate[1] });
    },
    [onSearch]
  );

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
  hierarchyName: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default MasterSchemaHierarchySearch;
