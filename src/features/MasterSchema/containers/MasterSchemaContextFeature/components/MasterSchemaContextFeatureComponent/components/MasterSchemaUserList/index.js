import "./styles.scss";

import React, { useMemo, useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import { capitalize, get } from "lodash/fp";
import { ExternalLink } from "react-feather";
import { Table, Card, CardBody, CardHeader } from "reactstrap";

import { selectdForms } from "app/selectors";
import SearchAndFilter from "components/SearchAndFilter";
import MSEButton from "features/MasterSchema/share/mse-button";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import { useBoolean } from "hooks/use-boolean";
import NoneAvatar from "assets/img/portrait/none-avatar.png";
import appSlice from "app/slices/appSlice";

const { getUsersByMasterSchemaFieldRequest } = appSlice.actions;

// :: (field) -> string
const normalizeFieldValue = (field) => {
  if (!field.type || !field.value) return null;

  switch (field.type) {
    case "files":
      return field.files.map(get("name")).join(", ");
    default:
      return field.value;
  }
};

const TEMP_LONG_VALUE_LENGTH = 10;

const isValueLong = (v) => v.length > TEMP_LONG_VALUE_LENGTH;

// ToDo: remove boxShadow and add border on Card

const MasterSchemaUserList = ({ users: initialUsers, hierarchy, selected }) => {
  const dispatch = useDispatch();
  const allDForms = useSelector(selectdForms);

  const [filter, setFilter] = useState([]);
  const [users, setUsers] = useState(initialUsers);
  const filterTypes = useMemo(() => {
    const applications = allDForms
      .filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0)
      .map((item) => item.name);

    return { applications };
  }, [allDForms, hierarchy.name]);

  const [longValue, setLongValue] = useState("");
  const [modal, openModal, closeModal] = useBoolean(false);

  const [searchInput, setSearchInput] = useState('');
  const [filterOptions, setFilterOptions] = useState({})

  const openModalForLongValue = (userId) => () => {
    const field = initialUsers.find(({ id }) => id === userId)?.field;
    const value = normalizeFieldValue(field);

    setLongValue(value);
    openModal();
  };

  const onFilterCancel = () => {
    setUsers(initialUsers);
    setFilterOptions({})
  }

  const onFilterSubmit = (filterOptions, filter) => {
    console.log("filterOptions", filterOptions);
    console.log("filter", filter);
    const payload = {
      fieldId: selected.field.id,
      abilities: filter.roles,
      organizations: filter.organizations,
      name: searchInput,
      member_firm_id: filter.memberFirm
    }
    dispatch(getUsersByMasterSchemaFieldRequest(payload));
    setFilterOptions(filter)
  };

  const onSearchSubmit = (value) => {
    const payload = {
      fieldId: selected.field.id,
      abilities: filterOptions.roles,
      organizations: filterOptions.organizations,
      name: value.target.value,
      member_firm_id: filterOptions.memberFirm
    }

    dispatch(getUsersByMasterSchemaFieldRequest(payload));
    setSearchInput(value.target.value)
    /*value = (value.hasOwnProperty("target") ? value.target.value : value).toLowerCase();

    setUsers(
      initialUsers.filter(
        ({ first_name, last_name }) =>
          first_name.toLowerCase().includes(value) || last_name.toLowerCase().includes(value)
      )
    );*/
  };

  return (
    <>
      {longValue && (
        <SurveyModal isOpen={modal} title="Extended input" onClose={closeModal} actions={false}>
          <div className="py-2" dangerouslySetInnerHTML={{ __html: longValue }} />
        </SurveyModal>
      )}

      <Card className="px-1">
        <CardHeader className="px-0">
          <div className="w-100">
            <SearchAndFilter
              handleSearch={onSearchSubmit}
              onCancelFilter={onFilterCancel}
              filterTypes={filterTypes}
              applyFilter={onFilterSubmit}
            />
          </div>
        </CardHeader>
        <CardBody className="pt-0 pb-1 px-0">
          <Table className="msu-table" borderless responsive>
            <thead>
              <tr>
                <th className="msu-table__avatar">&nbsp;</th>
                <th className="msu-table__name">Name</th>
                <th>Organisation</th>
                <th>Role</th>
                <th>Member firm</th>
                <th className="msu-table__value">Value</th>
                <th className="msu-table__date">Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const avatarPath = user.avatar_path || NoneAvatar;
                const fullName = `${user.first_name} ${user.last_name}`;
                const organization = user?.permissions?.organization;
                const role = capitalize(user?.permissions?.ability);
                const memberFirm = user.member_firm?.main_fields.name;
                const fieldType = capitalize(user.field.type || "");
                const fieldValue = normalizeFieldValue(user.field);

                return (
                  <tr key={user.id}>
                    <td className="msu-table__avatar">
                      <img
                        className="msu-table__avatar-img"
                        src={avatarPath}
                        width="40"
                        height="40"
                        alt="user's avatar."
                      />
                    </td>

                    <td className="msu-table__name">{fullName}</td>

                    <td>{organization}</td>
                    <td>{role}</td>
                    <td>{memberFirm}</td>
                    <td className="msu-table__value">
                      {fieldValue && isValueLong(fieldValue) ? (
                        <MSEButton
                          className="d-flex align-items-center msu-table__value-button"
                          onClick={openModalForLongValue(user.id)}
                        >
                          <div>This is a long text</div>
                          <ExternalLink size="12" />
                        </MSEButton>
                      ) : (
                        <>
                          {fieldType && <div>{fieldType ? `${fieldType}:` : fieldType}</div>}
                          {fieldValue && <div className="msu-table__field-value">{fieldValue}</div>}
                        </>
                      )}
                    </td>
                    <td className="msu-table__date">
                      <div>{moment(user.field.date).format("DD/MM/YYYY")}</div>
                      <div>{moment(user.field.date).format("HH:MM")}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

MasterSchemaUserList.propTypes = {
  users: PropTypes.array.isRequired,
  hierarchy: PropTypes.object.isRequired,
};

export default MasterSchemaUserList;
