import "./index.scss";

import React from "react";
import { Spinner } from "reactstrap";

import { useMSFieldUsersFile } from "api/masterSchema/useMSFieldUsersFile";

import FieldLabel from "../FieldLabel";

const style = { color: "currentColor" };

const ResourceElement = (props) => {
  const userId = props.userId;
  const title = props.schema.title;

  const masterSchemaFieldId = Number(props.schema.reference.field_id);
  const resourceManagerFieldFileId = Number(props.schema.resource_manager_field_file_id);

  const { data: file, isLoading } = useMSFieldUsersFile(
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
        <div className="file">
          <a className="d-block" href={file.url} download={file.name} style={style}>
            {file.name}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceElement;
