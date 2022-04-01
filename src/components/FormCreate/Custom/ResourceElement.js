import React from "react";
import { Label } from "reactstrap";

import { useMSFieldUsersFile } from "api/masterSchema/useMSFieldUsersFile";

const style = { color: "currentColor" };

const ResourceElement = (props) => {
  const userId = props.userId;
  const title = props.schema.title;
  const fieldId = Number(props.schema.reference.field_id);

  const { data: file, isLoading } = useMSFieldUsersFile(
    { msFieldId: fieldId, userId },
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
        <Label>{title}</Label>
        <strong className="d-block">Resource file is loading ...</strong>
      </div>
    );
  }

  if (!file) {
    return (
      <div>
        <Label>{title}</Label>
        <strong className="d-block">No resource</strong>
      </div>
    );
  }

  return (
    <div>
      <Label>{title}</Label>
      <a className="d-block" href={file.url} download={file.name} style={style}>
        {file.name}
      </a>
    </div>
  );
};

export default ResourceElement;
