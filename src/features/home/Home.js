import React, {useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectContext } from 'app/selectors'

import Context from './Context'

import appSlice from 'app/slices/appSlice'
import {selectUserAbility} from "../../app/selectors/userSelectors";

const {
  setContext,
} = appSlice.actions;

const Home = () => {
  const dispatch = useDispatch();
  const selectedContext = useSelector(selectContext)
  const userRole = useSelector(selectUserAbility);
  const context = useSelector(selectContext)

  const isOnboarding = ["prospect", "member"].indexOf(userRole) !== -1;

  useEffect(() => {
    if (userRole && !isOnboarding && !context) {
      dispatch(setContext('Dashboard'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Context selectedContext={selectedContext}/>
    </>
  );
};

export default Home;
