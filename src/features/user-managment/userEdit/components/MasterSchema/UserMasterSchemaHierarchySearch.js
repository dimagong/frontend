import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";

import SearchAndFilter from "components/SearchAndFilter";

import {useDForms} from "./hooks/useDForms";

const formatDate = (date) => {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  if (date?.length > 1) {
    return date.map((item) => item.toLocaleString("en-CA", options));
  } else {
    return [null, null];
  }
};

const filterDFormsByName = (dForms, name) =>
  dForms.filter((dForm) => dForm.groups.filter((group) => group.name === name).length > 0);

const UserMasterSchemaHierarchySearch = ({ hierarchy, hierarchyName, onSearch }) => {
  const { data: dForms } = useDForms();

  const filterTypes = React.useMemo(() => filterDFormsByName(dForms || [], hierarchyName), [dForms, hierarchyName]);
  const filterNames = React.useMemo(() => filterTypes.map(_.get("name")), [filterTypes]);

  const onSearchSubmit = React.useCallback(
    (searchName) => {
      const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;

      onSearch({ name: searchValue });
    },
    [onSearch]
  );

  const onFilterSubmit = React.useCallback(
    (filter) => {
      const dFormsByHierarchyName = filterDFormsByName(dForms, hierarchyName);
      const selectedApplications = filter.selectedFilters.find(
        _.pipe(_.get("name"), _.isEqual("applications"))
      ).selected;
      const selectedApplicationsNames = selectedApplications.map((item) => ({ name: item }));
      const intersectedApplicationNames = _.intersectionBy("name", dFormsByHierarchyName, selectedApplicationsNames);
      const selectedApplicationIds = intersectedApplicationNames.map(_.get("id"));

      const selectedTypes = filter.selectedFilters.find(_.pipe(_.get("name"), _.isEqual("types"))).selected;
      const onlyFiles = selectedTypes.includes("Files only");

      onSearch({ application_ids: selectedApplicationIds, only_files: onlyFiles });
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
      crossSelectingDisabled
      dataToFilter={hierarchy}
      filterTabPosition={"left"}
      applyFilter={onFilterSubmit}
      handleSearch={onSearchSubmit}
      onCalendarChange={onCalendarChange}
      filterTypes={{ applications: filterNames, types: ["Files only"] }}
    />
  );
};

UserMasterSchemaHierarchySearch.propTypes = {
  hierarchy: PropTypes.object,
  hierarchyName: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default UserMasterSchemaHierarchySearch;
