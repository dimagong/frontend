import React from "react";
import { Trash2 } from "react-feather";
import { Badge } from "reactstrap";

export const columnDefs = ({ handleDelete }) => [
  {
    headerName: "Name",
    field: "name",
    suppressSizeToFit: false,
    width: 250,
  },
  {
    headerName: "Description",
    field: "description",
    suppressSizeToFit: false,
    width: 250,
  },
  {
    headerName: "Subject",
    field: "subject",
    suppressSizeToFit: false,
    width: 250,
  },
  {
    headerName: "Content",
    field: "content",
    suppressSizeToFit: false,
    width: 250,
  },
  {
    headerName: "Organisations",
    field: "groups",
    suppressSizeToFit: false,
    width: 250,
    cellRendererFramework: (params) => {
      return params.value.map((next) => (
        <Badge color="primary" style={{ margin: "1px" }}>
          {next.name}
        </Badge>
      ));
    },
  },
  {
    headerName: "Actions",
    field: "transactions",
    suppressSizeToFit: false,
    width: 250,
    cellRendererFramework: (params) => {
      return (
        <div className="actions cursor-pointer">
          <Trash2 className="mr-50" size={15} onClick={() => handleDelete(params)} />
        </div>
      );
    },
  },
];
