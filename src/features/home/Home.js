import React from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  selectContextSearchVisibility,
  selectContext,
} from 'app/selectors'

import ContextSearch from './ContextSearch'
import Context from './Context'

import appSlice from 'app/slices/appSlice'

const {
  hideContextSearch,
} = appSlice.actions;

const Home = () => {
  const dispatch = useDispatch();
  const isContextSearchVisible = useSelector(selectContextSearchVisibility)
  const selectedContext = useSelector(selectContext)

  const handleContextSearchHide = () => {
    dispatch(hideContextSearch())
  }

  return (
    <>

      <Context selectedContext={selectedContext}/>
    </>
  );
};

export default Home;
