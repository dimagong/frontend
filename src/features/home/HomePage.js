import "../../old-styles";
import "./home.scss";

import React, { useEffect } from "react";
import { selectContext } from "app/selectors";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { Layout } from "utility/context/Layout";
import { selectUserAbility } from "app/selectors/userSelectors";

import Context from "./Context";

const { setContext } = appSlice.actions;

const HomePage = () => {
  const dispatch = useDispatch();

  const context = useSelector(selectContext);
  const userRole = useSelector(selectUserAbility);
  const selectedContext = useSelector(selectContext);

  useEffect(() => {
    if (userRole && !context) {
      dispatch(setContext("Dashboard"));
    }
  }, [userRole]);

  return (
    <Layout type="vertical">
      <Context selectedContext={selectedContext} />
    </Layout>
  );
};

export default HomePage;
