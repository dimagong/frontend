import React, {useCallback, useEffect, useState} from 'react';
import {Input} from "reactstrap";
import {debounce} from "lodash";
import masterSchemaService from "./services/masterSchema.service";


export default function Search(props) {
  const [searchValue, setSearchValue] = useState(null);

  let onChangeInput = useCallback(
    debounce((searchValue) => {
      props.onChange(searchValue);
    }, 500)
    ,[]);

  useEffect(() => {
    searchValue !== null && onChangeInput(searchValue);
  }, [searchValue]);


  return <Input placeholder="Search" value={searchValue} onChange={(event) => {
    setSearchValue(event.target.value || '')
  }}/>
}