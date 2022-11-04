import _ from "lodash/fp";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

import SearchAndFilter from "components/SearchAndFilter";

import { useDForms } from "./hooks/useDForms";

const formatDate = (date) => {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  if (date?.length > 1) {
    return date.map((item) => item.toLocaleString("en-CA", options));
  } else {
    return [null, null];
  }
};

const filterDFormsByOrganizationName = (dForms = [], name) => {
  return dForms.filter((dForm) => dForm.groups.filter((group) => group.name === name).length > 0);
};

function UserMasterSchemaHierarchySearch(props) {
  const { organizationName, onSearch } = props;

  const { data: dForms } = useDForms({ placeholderData: [] });
  const dFormsByOrganizationName = useMemo(() => {
    return filterDFormsByOrganizationName(dForms, organizationName);
  }, [dForms, organizationName]);

  const filterTypes = useMemo(() => {
    return { applications: dFormsByOrganizationName.map(_.get("name")), types: ["Files only"] };
  }, [dFormsByOrganizationName]);

  const onSearchSubmit = React.useCallback(
    (searchName) => {
      const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;

      onSearch({ name: searchValue });
    },
    [onSearch]
  );

  const onFilterSubmit = React.useCallback(
    (filter) => {
      const selectedApplications = filter.selectedFilters.find(
        _.pipe(_.get("name"), _.isEqual("applications"))
      ).selected;
      const selectedApplicationsNames = selectedApplications.map((item) => ({ name: item }));
      const intersectedApplicationNames = _.intersectionBy("name", dFormsByOrganizationName, selectedApplicationsNames);
      const selectedApplicationIds = intersectedApplicationNames.map(_.get("id"));

      const selectedTypes = filter.selectedFilters.find(_.pipe(_.get("name"), _.isEqual("types"))).selected;
      const onlyFiles = selectedTypes.includes("Files only");

      onSearch({ applicationIds: selectedApplicationIds, onlyFiles });
    },
    [dFormsByOrganizationName, onSearch]
  );

  const onCalendarChange = React.useCallback(
    (date) => {
      const formattedDate = formatDate(date);

      onSearch({ dateBegin: formattedDate[0], dateEnd: formattedDate[1] });
    },
    [onSearch]
  );

  return (
    <SearchAndFilter
      hasIcon
      isCalendar
      crossSelectingDisabled
      filterTabPosition={"left"}
      applyFilter={onFilterSubmit}
      handleSearch={onSearchSubmit}
      onCalendarChange={onCalendarChange}
      filterTypes={filterTypes}
    />
  );
}

UserMasterSchemaHierarchySearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  organizationName: PropTypes.string.isRequired,
};

export default UserMasterSchemaHierarchySearch;
