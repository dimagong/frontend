import "./styles.scss";

import _ from "lodash";
import { isEmpty } from "lodash/fp";
import { Col, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";

import { useBoolean } from "hooks/use-boolean";
import { useDidUpdate } from "hooks/use-did-update";
import SearchAndFilter from "components/SearchAndFilter";

import appSlice from "app/slices/appSlice";
import { selectOrganizations } from "app/selectors/groupSelector";
import { getMemberFirms } from "app/selectors/memberFirmsSelector";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectMasterSchemaUsers } from "app/selectors/masterSchemaSelectors";

import { FilterMemberFirmsOptions, FilterOrganizationsOptions, FilterRolesOptions } from "constants/filter";

import MSUUserList from "./components/msu-user-list";

const { getUsersByMasterSchemaFieldRequest, searchUsersByMasterSchemaFieldRequest } = appSlice.actions;

const MasterSchemaUserList = ({ field }) => {
  const dispatch = useDispatch();

  const masterSchemaUsers = useSelector(selectMasterSchemaUsers);
  const isUsersLoading = useSelector(createLoadingSelector([getUsersByMasterSchemaFieldRequest.type]), true);
  const [isUsersSearching, searchingOn, searchingOff] = useBoolean(false);

  const users = useMemo(() => masterSchemaUsers[field.id], [field.id, masterSchemaUsers]);

  const filterTypes = {
    roles: FilterRolesOptions(),
    organizations: FilterOrganizationsOptions(),
    memberFirms: FilterMemberFirmsOptions(),
  };
  const [abilities, setAbilities] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [memberFirmsToFilter, setMemberFirmsToFilter] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filterOptions, setFilterOptions] = useState({});

  const memberFirmsInfo = useSelector(getMemberFirms);
  const organizationsInfo = useSelector(selectOrganizations);

  const onFilterCancel = () => setFilterOptions({});

  const onFilterSubmit = (filterOptions, filter) => setFilterOptions(filter);

  const onSearchSubmit = (value) => value.target.value.length !== 1 && setSearchInput(value.target.value);

  const onFilterOptionCancel = (option) => setFilterOptions(onFilterOptionCancel.cancelOption[option]);

  onFilterOptionCancel.cancelOption = {
    roles: () => {
      return { ...filterOptions, roles: [] };
    },
    organizations: () => {
      return { ...filterOptions, organizations: [] };
    },
    memberFirms: () => {
      return { ...filterOptions, memberFirms: [] };
    },
  };

  useEffect(() => {
    const newAbilities = filterOptions?.roles
      ? filterOptions.roles.map((item) => item.toLowerCase().replace(" ", "_"))
      : [];
    !isEmpty(newAbilities) && setAbilities(newAbilities);
  }, [filterOptions]);

  useEffect(() => {
    const newOrganizations = filterOptions.organizations
      ? _.intersectionBy(
          organizationsInfo,
          filterOptions.organizations.map((item) => {
            return { name: item };
          }),
          "name"
        ).map((item) => {
          return { ...item, type: item.logo.entity_type };
        })
      : [];

    !isEmpty(newOrganizations) && setOrganizations(newOrganizations);
  }, [filterOptions, organizationsInfo]);

  useEffect(() => {
    const newMemberFirmsToFilter = filterOptions.memberFirms
      ? _.intersectionBy(
          memberFirmsInfo,
          filterOptions.memberFirms.map((item) => {
            return { main_fields: { name: item } };
          }),
          "main_fields.name"
        ).map((item) => item.id)
      : [];
    !isEmpty(newMemberFirmsToFilter) && setMemberFirmsToFilter(newMemberFirmsToFilter);
  }, [filterOptions.memberFirms, memberFirmsInfo]);

  useEffect(() => searchingOff(), [searchingOff, users])

  useDidUpdate(() => {
    const payload = {
      fieldId: field.id,
      abilities,
      organizations,
      member_firm_id: memberFirmsToFilter,
      name: searchInput,
    };

    searchingOn();
    dispatch(searchUsersByMasterSchemaFieldRequest(payload));
  }, [searchInput, dispatch, field, abilities, organizations, memberFirmsToFilter]);

  useEffect(() => {
    if (!users) {
      const payload = { fieldId: field.id };
      dispatch(getUsersByMasterSchemaFieldRequest(payload));
    }
  }, [dispatch, users, field]);

  if (isUsersLoading) {
    return (
      <Col className="d-flex justify-content-center py-4">
        <Spinner />
      </Col>
    );
  }

  if (isEmpty(users)) {
    return null;
  }

  return (
    <MSUUserList
      users={users}
      header={
        <div className="w-100">
          <SearchAndFilter
            handleSearch={onSearchSubmit}
            onCancelFilter={onFilterCancel}
            filterTypes={filterTypes}
            applyFilter={onFilterSubmit}
            onFilterOptionCancel={onFilterOptionCancel}
            filterTabPosition={"left"}
            loading={isUsersSearching}
          />
        </div>
      }
    />
  );
};

export default MasterSchemaUserList;
