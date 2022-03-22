import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";

import { IdType } from "utility/prop-types";
import { preventDefault } from "utility/event-decorators";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import NmpButton from "components/nmp/NmpButton";
import NmpSelect from "components/nmp/NmpSelect";

import { useAttachRMFileToMS, useUserResourceFields, useUserResourceFieldFiles } from "./userMSFieldQueries";

const ResourceManagerType = Symbol("Types#ResourceManager");

const ElementTypes = {
  Options: [{ label: "Resource Manager", value: ResourceManagerType }],
};

const fieldsToOption = (resourceField) => ({
  label: `${resourceField.breadcrumbs}/${resourceField.name}`,
  value: resourceField,
});

const fileLabel = (file) => {
  const [name, extension] = file.name.split(".");
  return `${name}[v${moment(file.updated_at).format("YYYY.MM.DD hh:mm:ss")}]_${file.provided.full_name}_${
    file.status
  }.${extension}`;
};

const filesToOption = (resourceFieldFile) => ({ label: fileLabel(resourceFieldFile), value: resourceFieldFile });

const UserMSFieldManager = ({ userId, msFieldId }) => {
  const attachRMFile = useAttachRMFileToMS({ msFieldId, userId });

  // const { data: msUserResource } = useMSUserResource({ userId, msFieldId });

  const [RMFieldOption, setRMFieldOption] = useState(null);
  const { data: RMFields = [] } = useUserResourceFields({ userId });
  const RMFieldsOptions = useMemo(() => RMFields.map(fieldsToOption), [RMFields]);

  const rmFieldId = RMFieldOption?.value?.id;

  const [RMFieldFileOption, setRMFieldFileOption] = useFormField(null, [Validators.required]);
  const { data: RMFieldFilesData } = useUserResourceFieldFiles({ msFieldId, rmFieldId, userId });
  const RMFieldFilesOptions = useMemo(
    () => (RMFieldFilesData ? RMFieldFilesData.files.map(filesToOption) : null),
    [RMFieldFilesData]
  );

  // Setup value for lazy RMFieldFile select
  useEffect(() => {
    if (RMFieldFilesData?.current) {
      setRMFieldFileOption(RMFieldFilesOptions.find(({ value }) => value.id === RMFieldFilesData.current.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RMFieldFilesData?.current]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRMFieldFileOption(null), [RMFieldOption]);

  const form = useFormGroup({ RMFieldFileOption });

  const onSubmit = () => {
    if (form.invalid) return;

    const rmFieldFileId = form.values.RMFieldFileOption.value.id;

    attachRMFile.mutate({ rmFieldFileId });
  };

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
          value={RMFieldOption}
          options={RMFieldsOptions}
          onChange={setRMFieldOption}
          searchable
          backgroundColor="transparent"
          inputId="resource-link"
        />
      </div>

      {/* ToDo: if RMFieldFilesOptions is Null show smth else */}

      {RMFieldOption ? (
        <div className="full-width py-1">
          <label className="label mb-1" htmlFor="resource-version">
            Version
          </label>
          <NmpSelect
            value={RMFieldFileOption.value}
            options={RMFieldFilesOptions}
            onChange={setRMFieldFileOption}
            searchable
            backgroundColor="transparent"
            inputId="resource-version"
          />
        </div>
      ) : null}

      <NmpButton className="ml-auto mt-1" color="primary" disabled={form.invalid} loading={attachRMFile.isLoading}>
        Save
      </NmpButton>
    </form>
  );
};

UserMSFieldManager.propTypes = {
  userId: IdType.isRequired,
  msFieldId: IdType.isRequired,
};

export default UserMSFieldManager;
