import "./styles.scss";

import moment from "moment";
import React, { useState } from "react";

import { IdType } from "utility/prop-types";

import NmpSelect from "components/nmp/NmpSelect";

import { useMSFields } from "api/masterSchema/useMSFields";
import { useRMFieldFiles } from "api/resourceManager/useRMFieldFiles";
import { useRMFieldFileReferences } from "api/resourceManager/useRMFieldFileReferences";

import FileInfoFolderContentTemplate from "../FileInfoFolderContentTemplate";

import MappingFileForm from "./MappingFileForm";
import PropTypes from "prop-types";

const getFileLabel = (file) => `${file.id} ${file.name} v${moment(file.created_at).format("YYYY.MM.DD HH:mm:ss")}`;

const getOptionFromFile = (file) => ({ label: getFileLabel(file), value: file });

const getOptionFromMSField = (field) => ({ label: `${field.breadcrumbs}.${field.name}`, value: field });

const MSMapping = ({ fieldId, organizationId, organizationType }) => {
  // MasterSchema fields
  const { data: fieldOptions = [], isLoading: fieldsIsLoading } = useMSFields(
    { organizationId, organizationType },
    { select: (fields) => fields.map(getOptionFromMSField) }
  );
  // ResourceManager field files
  const [file, setFile] = useState(null);
  const { data: fileOptions = [], isLoading: fileIsLoading } = useRMFieldFiles(
    { fieldId },
    {
      select: (files) => files.map(getOptionFromFile),
      onSuccess: (options) => setFile(options.find(({ value }) => value.is_latest_version)),
    }
  );
  // ResourceManager field file references
  const { data: references = [], isLoading: referencesIsLoading } = useRMFieldFileReferences({
    fileId: file?.value?.id,
  });

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
        <MappingFileForm
          fileId={file.value.id}
          references={references}
          fieldOptions={fieldOptions}
          isLoading={referencesIsLoading || fieldsIsLoading}
        />
      ) : null}
    </FileInfoFolderContentTemplate>
  );
};

MSMapping.propTypes = {
  fieldId: IdType.isRequired,
  organizationId: IdType.isRequired,
  organizationType: PropTypes.string.isRequired,
};

export default MSMapping;
