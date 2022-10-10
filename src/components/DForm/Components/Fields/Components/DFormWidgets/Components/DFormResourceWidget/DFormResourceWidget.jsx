import React from "react";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";
import { useDFormContext } from "components/DForm/DFormContext";

import { File } from "../DFormFileWidget/File";
import { DFormFieldContainer } from "../DFormFieldContainer";
import { MemberFilePreview } from "../DFormFileWidget/MemberFilePreview";
import { ManagerFilePreview } from "../DFormFileWidget/ManagerFilePreview";

export const DFormResourceWidget = (props) => {
  const { id, value = [], label, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, className } = props;

  const { isMemberView } = useDFormContext();

  return (
    <DFormFieldContainer
      name={label}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      className={className}
    >
      <File
        id={id}
        label={label}
        value={value}
        isDisabled={isDisabled}
        isUploadable={false}
        // In next update it will be refactored with DI as Network API provider which will provide
        // an clientHttpAPI service that is abstraction for any implementation. So, in case when FilePreview
        // is used in member view scope it will use the service that implements an clientHttpAPI, and in case
        // when it is used in another scope that provide Network it will use it correspondingly.
        previewFile={({ name, file_id }, index) => {
          return isMemberView ? (
            <MemberFilePreview
              name={name}
              fileId={file_id}
              isRemovable={false}
              masterSchemaFieldId={masterSchemaFieldId}
              key={file_id ?? `file-preview-${index}`}
            />
          ) : (
            <ManagerFilePreview
              name={name}
              fileId={file_id}
              isRemovable={false}
              masterSchemaFieldId={masterSchemaFieldId}
              key={file_id ?? `file-preview-${index}`}
            />
          );
        }}
      />
    </DFormFieldContainer>
  );
};

// ToDo: validation
// DFormResourceWidget.validationSchema = resourceValidationSchema;

DFormResourceWidget.propTypes = {
  id: IdType.isRequired,
  value: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, file_id: IdType })),
  label: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
  masterSchemaFieldId: IdType,
};
