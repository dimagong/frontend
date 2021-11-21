import React from "react";

import MSENodeRenamingForm from "./components/mse-node-renaming-form";
import MSENodeRelocationForm from "./components/mse-node-relocation-form";

const MasterSchemaManager = () => {
  return (
    <>
      <MSENodeRenamingForm className="my-2" nodeId={"1"} submitting={false} onSubmit={() => {}} />
      <MSENodeRelocationForm className="my-2" submitting={false} onSubmit={() => {}} />
    </>
  );
};

export default MasterSchemaManager;
