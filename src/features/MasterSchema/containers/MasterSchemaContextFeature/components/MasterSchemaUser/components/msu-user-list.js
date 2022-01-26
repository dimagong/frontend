import moment from "moment";
import PropTypes from "prop-types";
import { capitalize } from "lodash/fp";
import React, { useReducer } from "react";

import { getFullName } from "utility/get-full-name";

import masterSchemaApi from "api/masterSchema/masterSchema";

import SurveyModal from "features/Surveys/Components/SurveyModal";

import { UITable } from "components/Table";
import { TypedValuePreview } from "components/MasterSchemaValuePreviews";
import { VersionsHistoryTable } from "components/MasterSchemaVersionsHistory";

import BackInTimeIcon from "assets/img/svg/back-in-time.svg";
import NoneAvatar from "assets/img/portrait/none-avatar.png";

const normalizeVersionTotal = (total) => (total > 9 ? "+9" : total);

const initialHistoryData = { modal: false, fieldId: null };

const MSUUserList = ({ users }) => {
  const [historyData, setHistoryData] = useReducer((s, p) => ({ ...s, ...p }), initialHistoryData);

  const closeHistoryModal = () => setHistoryData({ fieldId: null, modal: false });

  const openHistoryModal = (fieldId) => setHistoryData({ fieldId, modal: true });

  const onVersionClick = (user) => () => openHistoryModal(user.field.id);

  const headers = ["$avatar", "Name", "Role", "Member firm", "Value", "User", "$data", "$total"];

  return (
    <>
      <UITable
        rows={users}
        headers={headers}
        customHeader={(header) => {
          if (header === "$avatar") {
            return (
              <th className="p-0" key={header}>
                &nbsp;
              </th>
            );
          }

          if (header === "$data") {
            return (
              <th className="text-right" key={header}>
                Date
              </th>
            );
          }

          if (header === "$total") {
            return (
              <th className="msu-table__total" key={header}>
                &nbsp;
              </th>
            );
          }
        }}
        customRow={(user) => {
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
              <td className="p-0">
                <img
                  src={avatarPath}
                  alt="user's avatar."
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
              </td>
              <td className="pl-1">{fullName}</td>
              <td>{role}</td>
              <td>{memberFirm}</td>
              <td>
                <TypedValuePreview type={field.type} value={field.type === "files" ? field.files : field.value} />
              </td>
              <td>{providedFullName}</td>
              <td className="text-right ui-table__right-border">
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
        }}
      />

      <SurveyModal
        className="msu-history-modal"
        isOpen={historyData.modal}
        title="Element history"
        onClose={closeHistoryModal}
        actions={false}
      >
        {historyData.fieldId ? (
          <VersionsHistoryTable
            versionsFactory={() => masterSchemaApi.getFieldVersions({ fieldId: historyData.fieldId })}
          />
        ) : null}
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
