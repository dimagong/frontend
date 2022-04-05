import "./index.scss";

import { Spinner } from "reactstrap";
import React, { useState } from "react";

import NmpButton from "components/nmp/NmpButton";
import DownloadIcon from "assets/img/icons/cloud-download.png";
import { useMSFieldUsersFile } from "api/masterSchema/useMSFieldUsersFile";

import FieldLabel from "../FieldLabel";
import resourceManagerFieldFileService from "../../services/resourceManagerFieldFile.service";

const style = { color: "currentColor" };

const ResourceElement = (props) => {
  const userId = props.userId;
  const title = props.schema.title;

  const masterSchemaFieldId = Number(props.schema.reference.field_id);
  const resourceManagerFieldFileId = Number(props.schema.resource_manager_field_file_id);
  const onboardingId = Number(props.onboardingId);

  const [mappingLoading, setMappingLoading] = useState(false);

  const {
    data: file,
    isLoading,
    refetch,
  } = useMSFieldUsersFile(
    { msFieldId: masterSchemaFieldId, userId, resourceManagerFieldFileId },
    {
      select: (response) => {
        const regExp = new RegExp(/filename=(.*)/gi);
        const header = response.headers["content-disposition"];
        const name = regExp.exec(header)[1];
        const url = window.URL.createObjectURL(response.data);

        return { url, name };
      },
    }
  );

  if (isLoading) {
    return (
      <div>
        <FieldLabel label={title} required={false} />
        <div className="rendered-files">
          <div className="file">
            <span className="d-block">loading...</span>
            <div className="action">
              <Spinner color="primary" className="ml-1" size="sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mapping = async () => {
    setMappingLoading(true);
    try {
      await resourceManagerFieldFileService.exportResourceFromOnboarding(
        onboardingId,
        masterSchemaFieldId,
        resourceManagerFieldFileId
      );
      await refetch();
    } finally {
      setMappingLoading(false);
    }
  };

  if (!file) {
    return (
      <div>
        <FieldLabel label={title} required={false} />
        <div className="rendered-files">
          <span className="d-block file">
            empty
            <NmpButton
              style={{ float: "right" }}
              size="sm"
              textColor="#95989a"
              backgroundColor="transparent"
              icon={<img src={DownloadIcon} alt="Download" />}
              onClick={mapping}
              loading={mappingLoading}
            />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FieldLabel label={title} required={false} />
      <div className="rendered-files">
        <div className="file">
          <a className="d-block" href={file.url} download={file.name} style={style}>
            {file.name}
          </a>
          <div className="action">
            <NmpButton
              size="sm"
              textColor="#95989a"
              backgroundColor="transparent"
              icon={<img src={DownloadIcon} alt="Download" />}
              onClick={mapping}
              loading={mappingLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceElement;
