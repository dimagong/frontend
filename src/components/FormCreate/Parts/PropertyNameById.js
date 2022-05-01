import React from "react";
import { selectMasterSchemaFields } from "app/selectors";
import { useSelector } from "react-redux";

export default function PropertyNameById(props) {
  const field = useSelector(selectMasterSchemaFields);

  const label =
    props.fieldId in field ? field[props.fieldId].label : Number.isInteger(+props.fieldId) ? "property" : props.fieldId;
  return <option {...props}>{label}</option>;
}

export function PropertyNameByIdAsTextNode(props) {
  const field = useSelector(selectMasterSchemaFields);

  const label =
    props.fieldId in field ? field[props.fieldId].label : Number.isInteger(+props.fieldId) ? "property" : props.fieldId;
  return <div {...props}>{label}</div>;
}
