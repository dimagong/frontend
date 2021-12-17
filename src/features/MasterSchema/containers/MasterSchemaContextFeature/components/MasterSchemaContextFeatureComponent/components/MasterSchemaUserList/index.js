import "./styles.scss";

import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { capitalize, get } from "lodash/fp";
import { ExternalLink } from "react-feather";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, CardBody, CardHeader } from "reactstrap";

import appSlice from "app/slices/appSlice";
import { useBoolean } from "hooks/use-boolean";
import SearchAndFilter from "components/SearchAndFilter";
import masterSchemaApi from "api/masterSchema/masterSchema";
import MSEButton from "features/MasterSchema/share/mse-button";
import SurveyModal from "features/Surveys/Components/SurveyModal";
import { selectOrganizations } from "app/selectors/groupSelector";
import { getMemberFirms } from "app/selectors/memberFirmsSelector";
import { FilterMemberFirmsOptions, FilterOrganizationsOptions, FilterRolesOptions } from "constants/filter";

import BackInTimeIcon from "assets/img/svg/back-in-time.svg";
import NoneAvatar from "assets/img/portrait/none-avatar.png";

const { getUsersByMasterSchemaFieldRequest } = appSlice.actions;

const normalizeVersionTotal = (total) => (total > 9 ? "+9" : total);

const getFullName = ({ first_name, last_name }) => `${first_name} ${last_name}`;

const TEMP_LONG_VALUE_LENGTH = 15;

const isValueLong = (v) => v.length > TEMP_LONG_VALUE_LENGTH;

const FilesValue = ({ files }) => {
  const [filesUrl, setFilesUrl] = useState([]);

  useEffect(() => {
    Promise.all(files.map(({ id, name }) =>
      masterSchemaApi.getValueFile({ valueId: id })
        .then((blob) => ({ url: window.URL.createObjectURL(blob), name }))
    ))
      .then((filesUrl) => setFilesUrl(filesUrl))
      .catch((error) => toast.error(error));
  }, [files]);

  return (
    <>
      {filesUrl.map((file) => (
        <a style={{ color: "currentColor" }} href={file.url} download>{file.name}</a>
      ))}
    </>
  );
};

const ValueExtended = ({ value, files, type }) => {
  if (["file", "files"].includes(type)) {
    return (
      <div className="py-2">
        <FilesValue files={files} />
      </div>
    );
  }

  return <div className="py-2" dangerouslySetInnerHTML={{ __html: value }} />;
};

const PrivateValuePreview = ({ value, type, normalizedValue, onExtendedValueClick }) => {
  if (value == null) {
    return type ? <div>{`${type}: Null`}</div> : <div>Null</div>;
  }

  if (isValueLong(normalizedValue)) {
    return (
      <MSEButton className="d-flex align-items-center msu-table__value-button" onClick={onExtendedValueClick}>
        <div>This is a long text</div>
        <ExternalLink size="12" />
      </MSEButton>
    );
  }

  return (
    <>
      {type && <div>{`${capitalize(type)}:`}</div>}
      <div className="msu-table__field-value">{value}</div>
    </>
  );
};

const ValuePreview = ({ value, files, type, onExtendedValueClick }) => {
  if (type === "boolean") {
    const normalizedValue = value ? "Yes" : "No";
    return (
      <PrivateValuePreview
        value={value}
        type={type}
        normalizedValue={normalizedValue}
        onExtendedValueClick={onExtendedValueClick}
      />
    );
  }

  if (["file", "files"].includes(type)) {
    const normalizedValue = files.map(get("name")).join(", ");
    return (
      <PrivateValuePreview
        value={<FilesValue files={files} />}
        type={type}
        normalizedValue={normalizedValue}
        onExtendedValueClick={onExtendedValueClick}
      />
    );
  }

  return (
    <PrivateValuePreview
      value={value}
      type={type}
      normalizedValue={value}
      onExtendedValueClick={onExtendedValueClick}
    />
  );
};

const MasterSchemaUserList = ({ users, selected, setUsersFiltered }) => {
  // users = MOCK_USERS;
  const dispatch = useDispatch();

  const memberFirmsInfo = useSelector(getMemberFirms);
  const organizationsInfo = useSelector(selectOrganizations);

  const filterTypes = {
    roles: FilterRolesOptions(),
    organizations: FilterOrganizationsOptions(),
    memberFirms: FilterMemberFirmsOptions(),
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [valueModal, openValueModal, closeValueModal] = useBoolean(false);
  const [historyModal, openHistoryModal, closeHistoryModal] = useBoolean(false);

  const [searchInput, setSearchInput] = useState("");
  const [filterOptions, setFilterOptions] = useState({});

  const onExtendedValueClick = (field) => () => {
    setSelectedField(field);
    openValueModal();
  };

  const onVersionClick = (user) => () => {
    setSelectedUser(user);
    openHistoryModal();
  };

  const onFilterCancel = () => {
    setFilterOptions({});
    setUsersFiltered(false);
  };

  const onFilterSubmit = (filterOptions, filter) => {
    setFilterOptions(filter);
    setUsersFiltered(true);
  };

  const onSearchSubmit = (value) => {
    if (value.target.value.length !== 1) {
      setSearchInput(value.target.value);
      setUsersFiltered(true);
    }
  };

  const onFilterOptionCancel = (option) => {
    setFilterOptions(onFilterOptionCancel.cancelOption[option]);
  };

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
    const orgatizationsToFilter = filterOptions.organizations
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

    const memberFirmsToFilter = filterOptions.memberFirms
      ? _.intersectionBy(
          memberFirmsInfo,
          filterOptions.memberFirms.map((item) => {
            return { main_fields: { name: item } };
          }),
          "main_fields.name"
        ).map((item) => item.id)
      : [];

    const payload = {
      fieldId: selected.field.id,
      abilities: filterOptions?.roles ? filterOptions.roles.map((item) => item.toLowerCase().replace(" ", "_")) : [],
      organizations: orgatizationsToFilter,
      member_firm_id: memberFirmsToFilter,
      name: searchInput,
    };

    dispatch(getUsersByMasterSchemaFieldRequest(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, filterOptions, dispatch]);

  return (
    <>
      {users && !users.length && <h3 className="ms-nothing-was-found">No users found for your query</h3>}

      <Card className="px-1 ms-user-list" style={{ boxShadow: "none", border: "1px solid #ececec" }}>
        <CardHeader className="px-0">
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

        <CardBody className="pt-0 pb-1 px-0">
          <Table className="msu-table" borderless responsive>
            <thead>
              <tr className="msu-table__users-head">
                <th className="msu-table__avatar">&nbsp;</th>
                <th className="msu-table__name">Name</th>
                <th>Role</th>
                <th>Member firm</th>
                <th className="msu-table__value">Value</th>
                <th className="msu-table__value">User</th>
                <th>Date</th>
                <th className="msu-table__total">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const fullName = getFullName(user);
                const { field, permissions } = user;
                const { provided } = field;
                const avatarPath = user.avatar_path || NoneAvatar;
                const providedFullName = provided ? getFullName(provided) : null;
                const role = capitalize(permissions?.ability || "");
                const memberFirm = user.member_firm?.name;
                const versionsTotal = user.versions_total ?? 0;
                const normalizedVersionsTotal = normalizeVersionTotal(versionsTotal);

                return (
                  <tr className="msu-table__row--shadowed-partial" key={user.id}>
                    <td className="msu-table__avatar">
                      <img
                        className="msu-table__avatar-img"
                        src={avatarPath}
                        width="40"
                        height="40"
                        alt="user's avatar."
                      />
                    </td>

                    <td className="msu-table__name pl-1">{fullName}</td>

                    <td>{role}</td>

                    <td>{memberFirm}</td>

                    <td className="msu-table__value">
                      <ValuePreview
                        value={field.value}
                        files={field.files}
                        type={field.type}
                        onExtendedValueClick={onExtendedValueClick(user.field)}
                      />
                    </td>

                    <td className="msu-table__name">{providedFullName}</td>

                    <td className="msu-table__date--end msu-table__date--bordered">
                      <div>{moment(user.field.date).format("DD/MM/YYYY")}</div>
                      <div>{moment(user.field.date).format("HH:MM")}</div>
                    </td>

                    <td className="msu-table__total">
                      <button className="msu-table__versioning-button" onClick={onVersionClick(user)}>
                        <span className="msu-table__versioning-number" title={versionsTotal}>
                          {normalizedVersionsTotal}
                        </span>
                        <img className="msu-table__versioning-img" src={BackInTimeIcon} alt="versions-modal" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {selectedField && (
        <SurveyModal isOpen={valueModal} title="Extended input" onClose={closeValueModal} actions={false}>
          <ValueExtended value={selectedField.value} type={selectedField.type} files={selectedField.files} />
        </SurveyModal>
      )}

      {selectedUser && (
        <SurveyModal
          className="element-history"
          isOpen={historyModal}
          title="Element history"
          onClose={closeHistoryModal}
          actions={false}
        >
          <Table className="msu-table" borderless responsive>
            <thead>
              <tr className="msu-table__history-head">
                <th>Date</th>
                <th className="msu-table__value">Value</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {selectedUser.history.versions.map((version) => {
                const { provided } = version;
                const fullName = provided ? getFullName(provided) : null;
                return (
                  <tr className="msu-table__row--history" key={version.id}>
                    <td className="msu-table__date--start">
                      <div>{moment(version?.created_at).format("DD/MM/YYYY")}</div>
                      <div>{moment(version?.created_at).format("HH:MM")}</div>
                    </td>
                    <td className="msu-table__value">
                      <ValuePreview
                        type={version.type}
                        value={version.value}
                        files={version.files}
                        onExtendedValueClick={onExtendedValueClick(version)}
                      />
                    </td>
                    <td>{fullName}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </SurveyModal>
      )}
    </>
  );
};

MasterSchemaUserList.propTypes = {
  users: PropTypes.array.isRequired,
  hierarchy: PropTypes.object.isRequired,
};

export default MasterSchemaUserList;
