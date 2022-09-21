import "./index.scss";

import React from "react";
import { Spinner } from "reactstrap";

import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";
import DownloadIcon from "assets/img/icons/cloud-download.png";
import { useMSFieldUsersFile } from "api/masterSchema/useMSFieldUsersFile";

import FieldLabel from "../FieldLabel";

const style = { color: "currentColor" };

const ResourceElement = (props) => {
  const userId = props?.userId;
  const title = props.schema.title;

  const masterSchemaFieldId = Number(props.schema.reference.field_id);
  const resourceManagerFieldId = Number(props.schema.resource_manager_field_id);

  const { data: file, isLoading } = useMSFieldUsersFile(
    { msFieldId: masterSchemaFieldId, userId, resourceManagerFieldId },
    {
      select: (response) => {
        const regExp = new RegExp(/filename=(.*)/gi);
        const header = response.headers["content-disposition"];
        let name = window.decodeURI(regExp.exec(header)[1]);
        name = name[0] === '"' ? name.substring(1, name.length - 1) : name;
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
            <span className="d-block">Loading...</span>
            <div className="action">
              <Spinner color="primary" className="ml-1" size="sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div>
        <FieldLabel label={title} required={false} />
        <div className="rendered-files">
          <span className="d-block file">Empty</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FieldLabel label={title} required={false} />
      <div className="rendered-files">
        <DeprecatedNmpButton
          className="file"
          style={{ float: "right" }}
          size="sm"
          textColor="#95989a"
          backgroundColor="transparent"
          tag="a"
          href={file.url}
          download={file.name}
        >
          <span className="d-block" style={style}>
            {file.name}
          </span>

          <div className="action">
            <img src={DownloadIcon} alt="Download" />
          </div>
        </DeprecatedNmpButton>
      </div>
    </div>
  );
};

export default ResourceElement;
