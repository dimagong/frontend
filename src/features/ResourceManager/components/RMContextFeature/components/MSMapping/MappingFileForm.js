import _ from "lodash/fp";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import React, { useReducer } from "react";
import Scrollbars from "react-custom-scrollbars";

import { useFormGroup } from "hooks/use-form";

import { IdType, OptionsType } from "utility/prop-types";
import { preventDefault } from "utility/event-decorators";

import NmpButton from "components/nmp/NmpButton";

import MappingFileReference from "./MappingFileReference";

import { useExportRMFileToMS, useOpenRMFilePreview, useSaveMappingReference } from "../../../../resourceManagerQueries";

const getReferenceFieldFromReference = (reference, fieldOptions) => {
  return { value: fieldOptions.find(({ value }) => value.id === reference.master_schema_field_id) };
};

const getReferenceFieldsFromReferences = (references, fieldOptions) => {
  return Object.fromEntries(
    references.map((reference) => [reference.id, getReferenceFieldFromReference(reference, fieldOptions)])
  );
};

// ToDo: filter fieldOption with selected
const MappingFileForm = ({ fileId, userId, references, fieldOptions, loading }) => {
  const saveMappingReference = useSaveMappingReference({ fileId });
  const downloadMappingPreview = useOpenRMFilePreview({ fileId, userId });
  const exportRMFileToMS = useExportRMFileToMS({ fileId, userId });

  const [referenceFields, setReferenceFields] = useReducer(
    (p, s) => ({ ...p, ...s }),
    getReferenceFieldsFromReferences(references, fieldOptions)
  );

  const form = useFormGroup(referenceFields);

  const onSubmit = () => {
    if (form.invalid) return;

    const data = Object.entries(form.values).map(([referenceId, field]) => ({
      id: Number(referenceId),
      master_schema_field_id: field.value.id,
    }));

    saveMappingReference.mutate(data);
  };

  const onReferenceChange = (referenceId) => (field) => setReferenceFields({ [referenceId]: field });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center height-300">
        <Spinner />
      </div>
    );
  }

  if (_.isEmpty(references)) {
    // ToDo: style it
    return (
      <div className="d-flex justify-content-center align-items-center height-300">
        <strong>No templates bindings was found.</strong>
      </div>
    );
  }

  return (
    <form onSubmit={preventDefault(onSubmit)}>
      <Scrollbars className="mb-2" autoHeight autoHeightMax={350}>
        {references.map((reference) => (
          <MappingFileReference
            value={referenceFields[reference.id].value}
            options={fieldOptions}
            onChange={onReferenceChange(reference.id)}
            fieldTemplate={reference.field_template}
            key={reference.id}
          />
        ))}
      </Scrollbars>

      <div className="d-flex justify-content-between py-1">
        <NmpButton
          color="white"
          type="button"
          disabled={form.invalid}
          onClick={downloadMappingPreview.mutate}
          loading={downloadMappingPreview.isLoading}
        >
          Preview
        </NmpButton>

        <NmpButton
          color="secondary"
          type="button"
          disabled={form.invalid}
          onClick={exportRMFileToMS.mutate}
          loading={exportRMFileToMS.isLoading}
        >
          Export to MasterSchema
        </NmpButton>

        <NmpButton color="primary" disabled={form.invalid} loading={saveMappingReference.isLoading}>
          Save
        </NmpButton>
      </div>
    </form>
  );
};

MappingFileForm.propTypes = {
  userId: IdType.isRequired,
  fileId: IdType.isRequired,
  references: PropTypes.arrayOf(PropTypes.object),
  fieldOptions: OptionsType,
  loading: PropTypes.bool.isRequired,
};

export default MappingFileForm;
