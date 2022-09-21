import "./styles.scss";

import _ from "lodash/fp";
import moment from "moment";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import React, { useEffect, useState } from "react";

import { IdType } from "utility/prop-types";

import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";

import { useMSFields } from "api/masterSchema/useMSFields";
import { useRMFieldFiles } from "api/resourceManager/useRMFieldFiles";
import { useRMFieldFileReferences } from "api/resourceManager/useRMFieldFileReferences";

import FileInfoFolderContentTemplate from "../FileInfoFolderContentTemplate";

import MappingFileForm from "./MappingFileForm";

const getFileLabel = (file) => `${file.name} v${moment(file.created_at).format("YYYY.MM.DD HH:mm:ss")}`;

const getOptionFromFile = (file) => ({ label: getFileLabel(file), value: file });

const getOptionFromMSField = (field) => ({ label: `${field.breadcrumbs}.${field.name}`, value: field });

const findLatestFileOption = (options) => options.find(({ value }) => value.is_latest_version);

const MSMapping = ({ fieldId, organizationId, organizationType }) => {
  // MasterSchema fields
  const { data: msFieldOptions = [], isLoading: fieldsIsLoading } = useMSFields(
    { organizationId, organizationType },
    { select: (fields) => fields.map(getOptionFromMSField) }
  );
  // ResourceManager field files
  const [file, setFile] = useState(null);
  const { data: fileOptions = [], isLoading: filesIsLoading } = useRMFieldFiles(
    { fieldId },
    { select: (files) => files.map(getOptionFromFile) }
  );

  useEffect(() => setFile(findLatestFileOption(fileOptions)), [fileOptions]);

  // ResourceManager field file references
  const { data: references = [], isLoading: referencesIsLoading } = useRMFieldFileReferences({
    fileId: file?.value?.id,
  });

  if (referencesIsLoading || fieldsIsLoading) {
    return (
      <FileInfoFolderContentTemplate title="Document Mapping">
        <div className="d-flex justify-content-center align-items-center py-2">
          <Spinner color="primary" />
        </div>
      </FileInfoFolderContentTemplate>
    );
  }

  if (_.isEmpty(references)) {
    return (
      <FileInfoFolderContentTemplate title="Document Mapping">
        <div className="mb-2">
          <DeprecatedNmpSelect
            value={file}
            options={fileOptions}
            onChange={setFile}
            loading={filesIsLoading}
            backgroundColor="transparent"
            searchable
          />
        </div>

        <div className="d-flex justify-content-center align-items-center py-2">
          <strong>No templates bindings was found.</strong>
        </div>
      </FileInfoFolderContentTemplate>
    );
  }

  return (
    <FileInfoFolderContentTemplate title="Document Mapping">
      <div className="mb-2">
        <DeprecatedNmpSelect
          value={file}
          options={fileOptions}
          onChange={setFile}
          loading={filesIsLoading}
          backgroundColor="transparent"
          searchable
        />
      </div>

      <MappingFileForm fileId={file?.value?.id} references={references} msFieldOptions={msFieldOptions} />
    </FileInfoFolderContentTemplate>
  );
};

MSMapping.propTypes = {
  fieldId: IdType.isRequired,
  organizationId: IdType.isRequired,
  organizationType: PropTypes.string.isRequired,
};

export default MSMapping;
