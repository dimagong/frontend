import _ from "lodash/fp";
import * as yup from "yup";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { Col, Row } from "reactstrap";
import { toast } from "react-toastify";
import Scrollbars from "react-custom-scrollbars";
import React, { useEffect, useState } from "react";

import NmpButton from "components/nmp/NmpButton";
import NmpSelect from "components/nmp/NmpSelect";

import { IdType, OptionsType } from "utility/prop-types";

import { useAccessQueryUsers } from "api/resourceManager/useRMFieldFileReferenceUsers";
import { useOpenRMFileReferencesPreview, useSaveRMFileReferences } from "api/resourceManager/useRMFieldFileReferences";

import MappingFileReference from "./MappingFileReference";

const validationSchema = yup.lazy((obj) =>
  yup.object(
    _.mapValues(
      () =>
        yup.object({
          id: yup.number().required("Required"),
          masterSchemaFieldId: yup.number().nullable().required("Required"),
        }),
      obj
    )
  )
);

const getOptionFromUser = (user) => ({ label: user.full_name, value: user });

const getReferenceName = (reference) => `${reference.field_template}-${reference.id}`;

const getReferenceValue = ({ id, master_schema_field_id }) => ({ id, masterSchemaFieldId: master_schema_field_id });

const getReferenceValues = (references = []) => {
  return Object.fromEntries(references.map((reference) => [getReferenceName(reference), getReferenceValue(reference)]));
};

const findReferenceFieldOptionById = (options, id) => options.find(({ value }) => value.id === id) || null;

const MappingFileForm = ({ fileId, msFieldOptions, references }) => {
  const openPreview = useOpenRMFileReferencesPreview({ fileId });
  const saveReferences = useSaveRMFileReferences({ fileId }, { onSuccess: () => toast.success("Saved successfully") });
  // Users
  const [user, setUser] = useState(null);
  const { data: userOptions, isLoading: usersIsLoading } = useAccessQueryUsers({
    select: (users) => users.map(getOptionFromUser),
  });

  const onPreview = () => openPreview.mutate({ userId: user.value.id });

  const onSubmit = (values) => {
    const data = Object.values(values).map(({ id, masterSchemaFieldId }) => ({
      id,
      master_schema_field_id: masterSchemaFieldId,
    }));

    saveReferences.mutate(data);
  };

  // Form
  const form = useFormik({
    onSubmit,
    initialValues: getReferenceValues(references),
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  const getOnChangeForReference = (reference) => {
    const onChange = (option) => {
      const name = getReferenceName(reference);
      form.setFieldValue(name, { id: reference.id, masterSchemaFieldId: option?.value?.id });
    };

    return onChange;
  };

  // Re-validate when references change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void form.validateForm(getReferenceValues(references)), [references]);

  return (
    <form onSubmit={form.handleSubmit}>
      <Scrollbars className="mb-2" autoHeight autoHeightMax={350}>
        {references.map((reference) => {
          const name = getReferenceName(reference);
          const value = findReferenceFieldOptionById(msFieldOptions, form.values[name]?.masterSchemaFieldId);

          return (
            <MappingFileReference
              name={name}
              value={value}
              options={msFieldOptions}
              onChange={getOnChangeForReference(reference)}
              fieldTemplate={reference.field_template}
              key={reference.id}
            />
          );
        })}
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
        <NmpButton color="primary" disabled={!form.isValid || !form.dirty} loading={saveReferences.isLoading}>
          Save
        </NmpButton>
      </div>
    </form>
  );
};

MappingFileForm.propTypes = {
  fileId: IdType.isRequired,
  references: PropTypes.arrayOf(PropTypes.object).isRequired,
  msFieldOptions: OptionsType.isRequired,
};

export default MappingFileForm;
