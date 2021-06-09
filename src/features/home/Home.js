import React, {useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  selectContextSearchVisibility,
  selectContext,
} from 'app/selectors'

import ContextSearch from './ContextSearch'
import Context from './Context'

import appSlice from 'app/slices/appSlice'
import {selectUserAbility} from "../../app/selectors/userSelectors";

const {
  hideContextSearch,
  setContext,
} = appSlice.actions;

const Home = () => {
  const dispatch = useDispatch();
  const isContextSearchVisible = useSelector(selectContextSearchVisibility)
  const selectedContext = useSelector(selectContext)
  const userRole = useSelector(selectUserAbility);
  const context = useSelector(selectContext)

  const isOnboarding = ["prospect", "adviser"].indexOf(userRole) !== -1;

  const handleContextSearchHide = () => {
    dispatch(hideContextSearch())
  }


   useEffect(() => {
    if (userRole && !isOnboarding && !context) {
      dispatch(setContext('Dashboard'))
    }
  }, []);

  return (
    <>

      <Context selectedContext={selectedContext}/>
    </>
  );
};

export default Home;
