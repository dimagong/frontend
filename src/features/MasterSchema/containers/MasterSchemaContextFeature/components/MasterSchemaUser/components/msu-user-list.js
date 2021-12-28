import moment from "moment";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { capitalize, get } from "lodash/fp";
import { ExternalLink } from "react-feather";
import { Table, Spinner, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";

import { useBoolean } from "hooks/use-boolean";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectSelectedId, selectVersions } from "app/selectors/masterSchemaSelectors";

import masterSchemaApi from "api/masterSchema/masterSchema";

import MSEButton from "features/MasterSchema/share/mse-button";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import BackInTimeIcon from "assets/img/svg/back-in-time.svg";
import NoneAvatar from "assets/img/portrait/none-avatar.png";

const normalizeVersionTotal = (total) => (total > 9 ? "+9" : total);

const getFullName = ({ first_name, last_name }) => `${first_name} ${last_name}`;

const TEMP_LONG_VALUE_LENGTH = 15;

const isValueLong = (v) => v.length > TEMP_LONG_VALUE_LENGTH;

const FilesValue = ({ files }) => {
  const [filesUrl, setFilesUrl] = useState([]);

  useEffect(() => {
    Promise.all(
      files.map(({ id, name }) =>
        masterSchemaApi.getValueFile({ valueId: id }).then((blob) => ({ url: window.URL.createObjectURL(blob), name }))
      )
    )
      .then((filesUrl) => setFilesUrl(filesUrl))
      .catch((error) => toast.error(error));
  }, [files]);

  return (
    <>
      {filesUrl.map((file) => (
        <a style={{ color: "currentColor" }} href={file.url} download>
          {file.name}
        </a>
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

  const [selectedField, setSelectedField] = useState(null);
  const [valueModal, openValueModal, closeValueModal] = useBoolean(false);
  const [historyModal, openHistoryModal, closeHistoryModal] = useBoolean(false);

  const onExtendedValueClick = (field) => () => {
    setSelectedField(field);
    openValueModal();
  };

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
          <th className="msu-table__name">Name</th>
          <th>Role</th>
          <th>Member firm</th>
          <th className="msu-table__value">Value</th>
          <th className="msu-table__value">User</th>
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

      {selectedField && (
        <SurveyModal isOpen={valueModal} title="Extended input" onClose={closeValueModal} actions={false}>
          <ValueExtended value={selectedField.value} type={selectedField.type} files={selectedField.files} />
        </SurveyModal>
      )}

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
