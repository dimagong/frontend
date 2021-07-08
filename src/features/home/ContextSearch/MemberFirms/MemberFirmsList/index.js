import React, {Fragment, useState} from 'react';
import {Button} from "reactstrap";
import {useDispatch} from "react-redux";
import appSlice from "app/slices/appSlice";

const {
  setContext,
} = appSlice.actions;

const MemberFirmsList = () => {
  const dispatch = useDispatch();

  return (
    <Fragment>
      <Button onClick={() => dispatch(setContext('Member Firms'))}>Member Firm Card</Button>
    </Fragment>
  )
};

export default MemberFirmsList;
