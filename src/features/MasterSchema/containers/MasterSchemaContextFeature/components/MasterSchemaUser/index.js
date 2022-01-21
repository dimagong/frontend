import _ from "lodash";
import { isEmpty } from "lodash/fp";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Col, Spinner, Collapse } from "reactstrap";

import { useToggle } from "hooks/use-toggle";

import ArrowButton from "components/ArrowButton";
import SearchAndFilter from "components/SearchAndFilter";

import appSlice from "app/slices/appSlice";
import { selectOrganizations } from "app/selectors/groupSelector";
import { getMemberFirms } from "app/selectors/memberFirmsSelector";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectMasterSchemaUsers } from "app/selectors/masterSchemaSelectors";

import { FilterMemberFirmsOptions, FilterOrganizationsOptions, FilterRolesOptions } from "constants/filter";

import MSUUserList from "./components/msu-user-list";

const { getUsersByMasterSchemaFieldRequest } = appSlice.actions;

const MasterSchemaUserList = ({ field }) => {
  const dispatch = useDispatch();

  const masterSchemaUsers = useSelector(selectMasterSchemaUsers);
  const isUsersLoading = useSelector(createLoadingSelector([getUsersByMasterSchemaFieldRequest.type]), true);

  const [expanded, toggleExpand] = useToggle(true);

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

  useEffect(() => {
    const payload = {
      fieldId: field.id,
      abilities,
      organizations,
      member_firm_id: memberFirmsToFilter,
      name: searchInput,
    };
    dispatch(getUsersByMasterSchemaFieldRequest(payload));
  }, [field.id, dispatch, abilities, organizations, memberFirmsToFilter, searchInput]);

  const RenderUsers = () => {
    if (isUsersLoading) {
      return (
        <Col className="d-flex justify-content-center py-4">
          <Spinner />
        </Col>
      );
    }

    return (
      isEmpty(users) ? (
        <h2 className="ms-nothing-was-found pt-0">No users found</h2>
      ) : (
        <MSUUserList users={users} />
      )
    )
  };

  return (
    <Card className="px-1" style={{ boxShadow: "none", border: "1px solid #ececec" }}>
      <CardHeader className="px-0">
        <div className="w-100 d-flex justify-content-end" style={{ top: "7px", right: "0px" }}>
          <ArrowButton onClick={toggleExpand} direction={expanded ? "down" : "up"} />
        </div>

        <div className="w-100">
          <SearchAndFilter
            handleSearch={onSearchSubmit}
            onCancelFilter={onFilterCancel}
            filterTypes={filterTypes}
            applyFilter={onFilterSubmit}
            onFilterOptionCancel={onFilterOptionCancel}
            filterTabPosition={"left"}
          />
        </div>
      </CardHeader>

      <Collapse isOpen={expanded} aria-expanded={expanded.toString()}>
        <CardBody className="pt-0 pb-1 px-0">
          {RenderUsers()}
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default MasterSchemaUserList;
