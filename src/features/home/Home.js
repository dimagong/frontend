import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { hideContextSearch } from "app/slices/appSlice"
import {
  selectContextSearchVisibility,
  selectContext,
} from 'app/selectors'

import ContextSearch from './ContextSearch'
import Context from './Context'


const Home = () => {
  const dispatch = useDispatch();
  const isContextSearchVisible = useSelector(selectContextSearchVisibility)
  const selectedContext = useSelector(selectContext)

  const handleContextSearchHide = () => {
    dispatch(hideContextSearch())
  }

  return (
    <>
      <ContextSearch
        isShown={isContextSearchVisible}
        onContextSearchHide={handleContextSearchHide}
      />
      <Context selectedContext={selectedContext}/>
    </>
  );
};

export default Home;
