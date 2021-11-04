import React from 'react';

import { useDispatch, useSelector } from "react-redux";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const MasterSchema = () => {
  const dispatch = useDispatch();


  return (
    <div className="d-flex">
      <MasterSchemaContext />
      <MasterSchemaContextFeature />
    </div>
  )
};

export default MasterSchema;
