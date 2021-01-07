import React from 'react'
import {selectMasterSchemaFields} from "app/selectors";
import {useDispatch, useSelector} from "react-redux";

export default function PropertyNameById(props) {
  const field = useSelector(selectMasterSchemaFields);

  const label = props.fieldId in field ? field[props.fieldId].label : 'property';
  return <option {...props}>{label}</option>;
}

export function PropertyNameByIdAsTextNode(props) {
  const field = useSelector(selectMasterSchemaFields);

  const label = props.fieldId in field ? field[props.fieldId].label : 'property';
  return <div{...props}>{label}</div>
}

