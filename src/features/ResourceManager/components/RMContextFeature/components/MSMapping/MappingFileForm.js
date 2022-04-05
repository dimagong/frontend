import _ from "lodash/fp";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Col, Row, Spinner } from "reactstrap";
import Scrollbars from "react-custom-scrollbars";
import React, { useEffect, useState } from "react";

import { useFormGroup } from "hooks/use-form";

import { IdType, OptionsType } from "utility/prop-types";
import { preventDefault } from "utility/event-decorators";

import NmpButton from "components/nmp/NmpButton";
import NmpSelect from "components/nmp/NmpSelect";

import { useAccessQueryUsers } from "api/resourceManager/useRMFieldFileReferenceUsers";
import { useOpenRMFileReferencesPreview, useSaveRMFileReferences } from "api/resourceManager/useRMFieldFileReferences";

import MappingFileReference from "./MappingFileReference";

const getReferenceFieldsFromReferences = (references, fieldOptions) => {
  const referenceFields = Object.fromEntries(
    references.map((reference) => {
      const fieldOption = fieldOptions.find(({ value }) => value.id === reference.master_schema_field_id);
      return [reference.id, { value: fieldOption || null }];
    })
  );

  return referenceFields;
};

const getOptionFromUser = (user) => ({ label: user.full_name, value: user });

const MappingFileForm = ({ fileId, fieldOptions, references, isLoading }) => {
  const saveReferences = useSaveRMFileReferences({ fileId }, { onSuccess: () => toast.success("Saved successfully") });
  const openPreview = useOpenRMFileReferencesPreview({ fileId });
  // Users
  const [user, setUser] = useState(null);
  const { data: userOptions, isLoading: usersIsLoading } = useAccessQueryUsers({
    select: (users) => users.map(getOptionFromUser),
  });

  const onPreview = () => openPreview.mutate({ userId: user.value.id });

  const [referenceFields, setReferenceFields] = useState(getReferenceFieldsFromReferences(references, fieldOptions));
  // const [referenceFields, setReferenceFields] = useState({});

  // Re-calculate referenceFields
  useEffect(() => {
    const referenceFields = getReferenceFieldsFromReferences(references, fieldOptions);

    setReferenceFields(referenceFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [references, fieldOptions]);

  const onReferenceChange = (referenceId) => (field) =>
    setReferenceFields((prev) => {
      return { ...prev, [referenceId]: field };
    });

  // ToDo it
  // Filter fieldOptions with selectedFieldOptions from reference fields
  // const fieldOptions = useMemo(() => {
  //   const referenceFieldsArray = Object.values(referenceFields);
  //
  //   return propFieldOptions.filter((fieldOption) => {
  //     return referenceFieldsArray.find(({ value }) => fieldOption.value.id !== value?.value?.id);
  //   });
  // }, [propFieldOptions, referenceFields]);

  const form = useFormGroup(referenceFields);

  const onSubmit = () => {
    const data = Object.entries(form.values).map(([referenceId, field]) => ({
      id: Number(referenceId),
      master_schema_field_id: field.value.id,
    }));

    saveReferences.mutate(data);
  };

  if (isLoading) {
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
            value={referenceFields[reference.id]?.value}
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
            <NmpSelect
              value={user}
              options={userOptions}
              onChange={setUser}
              loading={usersIsLoading}
              backgroundColor="transparent"
            />
          </Col>
          <Col xs={3}>
            <NmpButton color="white" type="button" disabled={!user} onClick={onPreview} loading={openPreview.isLoading}>
              Preview
            </NmpButton>
          </Col>
        </Row>
      </div>

      <div className="d-flex justify-content-end py-1">
        <NmpButton color="primary" loading={saveReferences.isLoading}>
          Save
        </NmpButton>
      </div>
    </form>
  );
};

MappingFileForm.propTypes = {
  fileId: IdType.isRequired,
  fieldOptions: OptionsType.isRequired,
  references: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default MappingFileForm;
