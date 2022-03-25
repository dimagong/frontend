import "./styles.scss";

import moment from "moment";
import React, { useState } from "react";

import { IdType } from "utility/prop-types";

import NmpSelect from "components/nmp/NmpSelect";

import MappingFileForm from "./MappingFileForm";

import FileInfoFolderContentTemplate from "../FileInfoFolderContentTemplate";

import {
  useRMFieldFiles,
  useMSUserFields,
  useRMFieldFileReferences,
  useRMFieldFileReferenceUsers,
} from "../../../../resourceManagerQueries";

const getFileLabel = (file) => `${file.name} v${moment(file.updated_at).format("YYYY.MM.DD HH:mm:ss")}`;

const getOptionFromFile = (file) => ({ label: getFileLabel(file), value: file });

const getOptionFromUser = (user) => ({ label: user.full_name, value: user });

const getOptionFromMSField = (field) => ({ label: `${field.breadcrumbs}.${field.name}`, value: field });

const MSMapping = ({ fieldId }) => {
  // Mapping related files
  const [file, setFile] = useState(null);
  const { data: fileOptions, fileIsLoading } = useRMFieldFiles(
    { fieldId, assigned: true },
    {
      select: (files) => files.map(getOptionFromFile),
    }
  );
  // Mapping related users
  const [user, setUser] = useState(null);
  const { data: userOptions, usersIsLoading } = useRMFieldFileReferenceUsers(
    { fileId: file?.value?.id },
    {
      select: (users) => users.map(getOptionFromUser),
    }
  );
  // Mapping related references
  const { data: references, referencesIsLoading } = useRMFieldFileReferences({ fileId: file?.value?.id });
  // Mapping related users
  const { data: fieldOptions, fieldsIsLoading } = useMSUserFields(
    { userId: user?.value?.id },
    {
      select: (fields) => fields.map(getOptionFromMSField),
    }
  );

  return (
    <FileInfoFolderContentTemplate title="Document Mapping">
      <div className="mb-2">
        <NmpSelect
          value={file}
          options={fileOptions}
          onChange={setFile}
          loading={fileIsLoading}
          backgroundColor="transparent"
        />
      </div>

      {file ? (
        <div className="mb-2">
          <NmpSelect
            value={user}
            options={userOptions}
            onChange={setUser}
            loading={usersIsLoading}
            backgroundColor="transparent"
          />
        </div>
      ) : null}

      {file && user && fieldOptions ? (
        <MappingFileForm
          fileId={file.value.id}
          userId={user.value.id}
          references={references}
          fieldOptions={fieldOptions}
          loading={referencesIsLoading || fieldsIsLoading}
        />
      ) : null}
    </FileInfoFolderContentTemplate>
  );
};

MSMapping.propTypes = {
  fieldId: IdType.isRequired,
};

export default MSMapping;
