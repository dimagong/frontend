import moment from "moment";
import PropTypes from "prop-types";
import { capitalize } from "lodash/fp";
import React, { useMemo, useState } from "react";
import { Table, Spinner, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import { useBoolean } from "hooks/use-boolean";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectSelectedId, selectVersions } from "app/selectors/masterSchemaSelectors";

import SurveyModal from "features/Surveys/Components/SurveyModal";

import BackInTimeIcon from "assets/img/svg/back-in-time.svg";
import NoneAvatar from "assets/img/portrait/none-avatar.png";

import TypedValuePreview from "./typed-value-preview";

const normalizeVersionTotal = (total) => (total > 9 ? "+9" : total);

const getFullName = ({ first_name, last_name }) => `${first_name} ${last_name}`;

const { getVersionsByMasterSchemaFieldRequest } = appSlice.actions;

const MSUUserList = ({ users }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const masterSchemaVersions = useSelector(selectVersions);

  const [versionFieldId, setVersionFieldId] = useState();
  const isVersionsLoading = useSelector(createLoadingSelector([getVersionsByMasterSchemaFieldRequest.type]));
  const versions = useMemo(() => {
    return masterSchemaVersions[`${selectedId}/${versionFieldId}`] || [];
  }, [masterSchemaVersions, selectedId, versionFieldId]);

  const [historyModal, openHistoryModal, closeHistoryModal] = useBoolean(false);

  const onVersionClick = (user) => () => {
    const fieldId = user.field.id;
    openHistoryModal();
    setVersionFieldId(fieldId);
    dispatch(getVersionsByMasterSchemaFieldRequest({ fieldId }));
  };

  return (
    <>
      <Table className="msu-table" borderless responsive>
        <thead>
          <tr className="msu-table__users-head">
            <th className="msu-table__avatar">&nbsp;</th>
            <th>Name</th>
            <th>Role</th>
            <th>Member firm</th>
            <th>Value</th>
            <th>User</th>
            <th className="msu-table__date--end">Date</th>
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
                  <img className="msu-table__avatar-img" src={avatarPath} width="40" height="40" alt="user's avatar." />
                </td>

                <td className="pl-1">{fullName}</td>

                <td>{role}</td>

                <td>{memberFirm}</td>

                <td>
                  <TypedValuePreview
                    type={field.type}
                    value={field.type === "files" ? field.files : field.value}
                  />
                </td>

                <td>{providedFullName}</td>

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
              <th>Value</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {isVersionsLoading ? (
              <tr>
                <td colSpan="3">
                  <Col className="d-flex justify-content-center py-4">
                    <Spinner />
                  </Col>
                </td>
              </tr>
            ) : (
              versions.map((version) => {
                const { provided } = version;
                const fullName = provided ? getFullName(provided) : null;
                return (
                  <tr className="msu-table__row--history" key={version.id}>
                    <td className="msu-table__date--start">
                      <div>{moment(version?.created_at).format("DD/MM/YYYY")}</div>
                      <div>{moment(version?.created_at).format("HH:MM")}</div>
                    </td>
                    <td>
                      <TypedValuePreview
                        type={version.type}
                        value={version.type === "files" ? version.files : version.value}
                      />
                    </td>
                    <td>{fullName}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </SurveyModal>
    </>
  );
};

MSUUserList.defaultProps = {
  users: [],
};

MSUUserList.propTypes = {
  users: PropTypes.array,
};

export default MSUUserList;
