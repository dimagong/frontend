import moment from "moment";
import PropTypes from "prop-types";
import { Table } from "reactstrap";
import { capitalize } from "lodash/fp";
import React, { useReducer } from "react";

import { getFullName } from "utility/get-full-name";

import SurveyModal from "features/Surveys/Components/SurveyModal";

import BackInTimeIcon from "assets/img/svg/back-in-time.svg";
import NoneAvatar from "assets/img/portrait/none-avatar.png";

import ValueHistory from "./value-history";
import TypedValuePreview from "./typed-value-preview";

const normalizeVersionTotal = (total) => (total > 9 ? "+9" : total);

const initialHistoryData = { modal: false, fieldId: null };

const MSUUserList = ({ users }) => {
  const [historyData, setHistoryData] = useReducer((s, p) => ({ ...s, ...p }), initialHistoryData);

  const closeHistoryModal = () => setHistoryData({ fieldId: null, modal: false });

  const openHistoryModal = (fieldId) => setHistoryData({ fieldId, modal: true });

  const onVersionClick = (user) => () => openHistoryModal(user.field.id);

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
                  <TypedValuePreview type={field.type} value={field.type === "files" ? field.files : field.value} />
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
        isOpen={historyData.modal}
        title="Element history"
        onClose={closeHistoryModal}
        actions={false}
      >
        {historyData.fieldId ? <ValueHistory fieldId={historyData.fieldId} /> : null}
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
