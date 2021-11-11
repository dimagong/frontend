import React, {useCallback, useEffect, useState} from 'react';
import {Input} from "reactstrap";
import {debounce} from "lodash";


export default function Search(props) {
  const [searchValue, setSearchValue] = useState('');

  let onChangeInput = useCallback(
    debounce((searchValue) => {
      props.onChange(searchValue);
    }, 500)
    ,[]);

  useEffect(() => {
    searchValue !== null && onChangeInput(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);


  return <Input placeholder="Search" value={searchValue} onChange={(event) => {
    setSearchValue(event.target.value || '')
  }}/>
}
