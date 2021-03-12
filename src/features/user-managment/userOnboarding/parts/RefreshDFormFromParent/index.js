import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {RefreshCw} from "react-feather";
import {Button} from "reactstrap";

import appSlice from 'app/slices/appSlice'

const {
  updateDFormFromParentRequest
} = appSlice.actions;

export default function RefreshDFormFromParent({id}) {
  const dispatch = useDispatch();

  const onRefresh = () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    dispatch(updateDFormFromParentRequest({id}));
  };

  return <Button.Ripple outline color="primary"  className={"bg-white"} onClick={onRefresh}>
    <RefreshCw size={15} />
  </Button.Ripple>
}
