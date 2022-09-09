import React from "react";

import NpmCard from "../../../nmp-ui/NpmCard";
import NpmInputSelect from "./../../../nmp-ui/NpmInputSelect";
import NpmDatePicker from "./../../../nmp-ui/NpmDatePicker";

const MemberDFormView = () => {
  const optionsTest = ["option-1", "option-2", "option-3", "option-4", "option-5", "option-6", "option-7"];
  const handleChange = (option) => {
    console.log("option", option);
  };

  const onchangeDate = (time, timeString) => {
    console.log("data", time, timeString);
  };
  return (
    <NpmCard style={{ minHeight: "50vh", maxWidth: "783px", width: "57vw" }}>
      <div className="dform-component" style={{ width: "100%", height: 100, border: "2px solid red" }}>
        <NpmInputSelect options={optionsTest} handleChange={handleChange} />
        <NpmDatePicker onChangeDate={onchangeDate} />
      </div>
    </NpmCard>
  );
};

export default MemberDFormView;
