import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { IdType } from "utility/prop-types";
import { preventDefault } from "utility/event-decorators";
import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import NmpSelect from "components/nmp/NmpSelect";
import NmpButton from "components/nmp/NmpButton";

import { useUserResourceFieldFiles, useUserResourceFields } from "./userMSFieldQueries";

const ResourceManagerType = Symbol("Types#ResourceManager");

const ElementTypes = {
  Options: [{ label: "Resource Manager", value: ResourceManagerType }],
};

const fieldLabel = (field) => `${field.breadcrumbs.replace(".", "/")}/${field.name}`;

const fieldsToOption = (resourceField) => ({
  label: fieldLabel(resourceField),
  value: resourceField,
});

const fileLabel = (file) => {
  const [name, extension] = file.name.split(".");
  return `${name}[v${moment(file.updated_at).format("YYYY.MM.DD hh:mm:ss")}]_${file.provided.full_name}_${
    file.status
  }.${extension}`;
};

const filesToOption = (resourceFieldFile) => ({ label: fileLabel(resourceFieldFile), value: resourceFieldFile });

const findOptionByValueId = (options, id) => options.find((option) => option?.value?.id === id);

const UserMSFieldManagerForm = (props) => {
  const {
    userId,
    rmFieldId: initialRmFieldId,
    rmFieldFileId: initialRmFieldFileId,
    submitting,
    onSubmit: propOnSubmit,
  } = props;

  // Resource Field
  const [field, setField] = useState(null);
  const { data: fieldOptions = [], isLoading: fieldsIsLoading } = useUserResourceFields(
    { userId },
    {
      select: (fields) => fields.map(fieldsToOption),
      onSuccess: (options) => {
        const option = findOptionByValueId(options, initialRmFieldId);

        option && setField(option);
      },
    }
  );

  // Resource Field Files
  const rmFieldId = field?.value?.id;
  const file = useFormField(null, [Validators.required], { useAdvanced: true });
  const { data: fileOptions = [], isLoading: filesIsLoading } = useUserResourceFieldFiles(
    { rmFieldId, userId },
    {
      select: (files) => files.map(filesToOption),
      onSuccess: (options) => {
        const option = findOptionByValueId(options, initialRmFieldFileId);

        option && file.setValue(option);
      },
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void file.setValue(null), [field]);

  // Form control
  const form = useFormGroup({ file });

  const onSubmit = () => propOnSubmit(form);

  return (
    <form className="d-flex flex-wrap mb-1" onSubmit={preventDefault(onSubmit)}>
      <h2 className="h1 font-weight-bold">Current</h2>

      <div className="full-width py-1">
        <label className="label mb-1" htmlFor="element-type">
          Element type
        </label>
        <NmpSelect
          options={ElementTypes.Options}
          value={ElementTypes.Options[0]}
          readonly
          backgroundColor="transparent"
          inputId="element-type"
        />
      </div>

      <div className="full-width py-1">
        <label className="label mb-1" htmlFor="resource-link">
          Resource link
        </label>
        <NmpSelect
          value={field}
          options={fieldOptions}
          onChange={setField}
          loading={fieldsIsLoading}
          searchable
          backgroundColor="transparent"
          inputId="resource-link"
        />
      </div>

      {field ? (
        <div className="full-width py-1">
          <label className="label mb-1" htmlFor="resource-version">
            Version
          </label>
          <NmpSelect
            value={file.value}
            options={fileOptions}
            onChange={file.onChange}
            loading={filesIsLoading}
            searchable
            backgroundColor="transparent"
            inputId="resource-version"
          />
        </div>
      ) : null}

      <NmpButton className="ml-auto mt-1" color="primary" disabled={form.invalid} loading={submitting}>
        Save
      </NmpButton>
    </form>
  );
};

UserMSFieldManagerForm.propTypes = {
  userId: IdType.isRequired,
  rmFieldId: IdType.isRequired,
  rmFieldFileId: IdType.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UserMSFieldManagerForm;
