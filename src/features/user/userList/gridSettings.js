import React from "react";
import { Badge } from "reactstrap";

export const columnDefs = [
  {
    headerName: "Name",
    field: "first_name",
    width: 200,
  },
  {
    headerName: "Email",
    field: "email",
    width: 250,
  },
  {
    headerName: "Phone number",
    field: "number",
    width: 200,
  },
  {
    headerName: "Roles",
    field: "roles",
    width: 200,
    cellRendererFramework: (params) => {
      return params.value.map((next) => (
        <Badge color="primary" style={{ margin: "1px" }}>
          {next}
        </Badge>
      ));
    },
  },
];
