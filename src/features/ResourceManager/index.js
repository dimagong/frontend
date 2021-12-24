import React from 'react';

import RMContextComponent from "./components/RMContext";
import RMContextFeatureComponent from "./components/RMContextFeature";


const ResourceManager = () => {

  return (
    <div className="d-flex">
      <RMContextComponent />
      <RMContextFeatureComponent />
    </div>
  )
};

export default ResourceManager;
