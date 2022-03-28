import _ from "lodash/fp";
import PropTypes from "prop-types";
import { Col, Row, Spinner } from "reactstrap";
import React, { useMemo, useReducer } from "react";
import Scrollbars from "react-custom-scrollbars";

import { useFormGroup } from "hooks/use-form";

import { IdType, OptionsType } from "utility/prop-types";
import { preventDefault } from "utility/event-decorators";

import NmpButton from "components/nmp/NmpButton";
import NmpSelect from "components/nmp/NmpSelect";

import MappingFileReference from "./MappingFileReference";

import { useOpenRMFileReferencesPreview, useSaveRMFileReferences } from "api/resourceManager/useRMFieldFileReferences";

const getReferenceFieldFromReference = (reference, fieldOptions) => {
  return { value: fieldOptions.find(({ value }) => value.id === reference.master_schema_field_id) };
};

const getReferenceFieldsFromReferences = (references, fieldOptions) => {
  return Object.fromEntries(
    references.map((reference) => [reference.id, getReferenceFieldFromReference(reference, fieldOptions)])
  );
};

const MappingFileForm = ({ fileId, userId, references, fieldOptions: propFieldOptions, loading }) => {
  const saveReferences = useSaveRMFileReferences({ fileId });
  const openPreview = useOpenRMFileReferencesPreview({ fileId, userId });

  const [referenceFields, setReferenceFields] = useReducer(
    (p, s) => ({ ...p, ...s }),
    getReferenceFieldsFromReferences(references, propFieldOptions)
  );

  // Filter fieldOptions with selectedFieldOptions from reference fields
  const fieldOptions = useMemo(() => {
    const referenceFieldsArray = Object.values(referenceFields);

    return propFieldOptions.filter((fieldOption) => {
      return referenceFieldsArray.find(({ value }) => fieldOption.value.id !== value.value.id);
    });
  }, [propFieldOptions, referenceFields]);

  const form = useFormGroup(referenceFields);

  const onSubmit = () => {
    if (form.invalid) return;

    const data = Object.entries(form.values).map(([referenceId, field]) => ({
      id: Number(referenceId),
      master_schema_field_id: field.value.id,
    }));

    saveReferences.mutate(data);
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

      <div className="ms-mapping__preview py-2 mb-2">
        <Row>
          <Col xs={{ size: 8, offset: 1 }}>
            {/* ToDo: Finish preview button */}
            <NmpSelect
              value={null}
              options={[]}
              // onChange={setUser}
              // loading={usersIsLoading}
              backgroundColor="transparent"
            />
          </Col>
          <Col xs={3}>
            <NmpButton
              color="white"
              type="button"
              disabled={form.invalid}
              onClick={openPreview.mutate}
              loading={openPreview.isLoading}
            >
              Preview
            </NmpButton>
          </Col>
        </Row>
      </div>

      <div className="d-flex justify-content-end py-1">
        <NmpButton color="primary" disabled={form.invalid} loading={saveReferences.isLoading}>
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
