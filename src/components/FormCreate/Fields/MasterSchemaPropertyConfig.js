import React from 'react'
import {selectMasterSchemaFields} from "app/selectors";
import {useDispatch, useSelector} from "react-redux";

export default function MasterSchemaPropertyConfig(props) {
  const field = useSelector(selectMasterSchemaFields);

  const label = props.value in field ? field[props.value].label : 'property';

  return <input {...props} value={label}></input>
}
