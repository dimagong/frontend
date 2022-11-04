import _ from "lodash/fp";
import * as yup from "yup";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { Col, Row } from "reactstrap";
import { toast } from "react-toastify";
import Scrollbars from "react-custom-scrollbars";
import React, { useEffect, useMemo, useState } from "react";

import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";
import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";

import { IdType, OptionsType } from "utility/prop-types";

import { useAccessQueryUsers } from "api/resourceManager/useRMFieldFileReferenceUsers";
import { useOpenRMFileReferencesPreview, useSaveRMFileReferences } from "api/resourceManager/useRMFieldFileReferences";

import MappingFileReference from "./MappingFileReference";

const BLANK_MS_FIELD_ID = -1;

const BLANK_MS_FIELD_OPTION = { value: { id: BLANK_MS_FIELD_ID }, label: "Blank" };

const validationSchema = yup.lazy((obj) => {
  return yup.object(
    _.mapValues(
      () =>
        yup.object({
          id: yup.number().required("Required"),
          masterSchemaFieldId: yup.number().nullable(),
        }),
      obj
    )
  );
});

const getOptionFromUser = (user) => ({ label: user.full_name, value: user });

const getReferenceName = (reference) => {
  // Fixed issue: formik setFieldValue first argument is a string like path
  // So, we need to remove all dots and slashes from template name.
  const templateName = reference.field_template.replace(/\W/g, "");

  return `${templateName}-${reference.id}`;
};

const getReferenceValue = ({ id, master_schema_field_id }) => ({ id, masterSchemaFieldId: master_schema_field_id });

const getReferenceValues = (references = []) => {
  return Object.fromEntries(
    references.map((reference) => {
      const name = getReferenceName(reference);
      const value = getReferenceValue(reference);

      return [name, value];
    })
  );
};

const findReferenceFieldOptionById = (options, id) =>
  options.find(({ value }) => value?.id === id) || BLANK_MS_FIELD_OPTION;

const MappingFileForm = ({ fileId, msFieldOptions: propMSFieldOptions, references }) => {
  const msFieldOptions = useMemo(() => [BLANK_MS_FIELD_OPTION, ...propMSFieldOptions], [propMSFieldOptions]);

  const openPreview = useOpenRMFileReferencesPreview({ fileId });
  const saveReferences = useSaveRMFileReferences({ fileId }, { onSuccess: () => toast.success("Saved successfully") });
  // Users
  const [user, setUser] = useState(null);
  const { data: userOptions, isLoading: usersIsLoading } = useAccessQueryUsers({
    select: (users) => users.map(getOptionFromUser),
  });

  const onPreview = () => openPreview.mutate({ userId: user.value.id });

  const onSubmit = (values) => {
    const data = Object.values(values).map(({ id, masterSchemaFieldId }) => {
      const master_schema_field_id = masterSchemaFieldId === BLANK_MS_FIELD_ID ? null : masterSchemaFieldId;

      return { id, master_schema_field_id };
    });

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
        <div className="pr-2">
          {references.map((reference) => {
            const name = getReferenceName(reference);
            const value = findReferenceFieldOptionById(msFieldOptions, form.values[name]?.masterSchemaFieldId);

            return (
              <MappingFileReference
                name={name}
                value={value}
                options={msFieldOptions}
                reference={reference}
                onChange={getOnChangeForReference(reference)}
                key={reference.id}
              />
            );
          })}
        </div>
      </Scrollbars>

      <div className="ms-mapping__preview py-2 mb-2">
        <Row>
          <Col xs={{ size: 8, offset: 1 }}>
            <DeprecatedNmpSelect
              value={user}
              options={userOptions}
              onChange={setUser}
              loading={usersIsLoading}
              menuPosition="fixed"
              searchable
              backgroundColor="transparent"
            />
          </Col>
          <Col xs={3}>
            <DeprecatedNmpButton
              color="white"
              type="button"
              disabled={!user}
              onClick={onPreview}
              loading={openPreview.isLoading}
            >
              Preview
            </DeprecatedNmpButton>
          </Col>
        </Row>
      </div>

      <div className="d-flex justify-content-end py-1">
        <DeprecatedNmpButton color="primary" disabled={!form.isValid || !form.dirty} loading={saveReferences.isLoading}>
          Save
        </DeprecatedNmpButton>
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
