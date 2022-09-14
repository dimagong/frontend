import "./styles.scss";

import React from "react";

import { Col, Row } from "antd";

import NpmCard from "../../../nmp-ui/NpmCard";
import NpmInputSelect from "./../../../nmp-ui/NpmInputSelect";
import NpmDatePicker from "./../../../nmp-ui/NpmDatePicker";
import NpmTimePicker from "./../../../nmp-ui/NpmTimePicker";
import NpmRadioGroup from "./../../../nmp-ui/NpmRadioGroup";
import NpmTextArea from "./../../../nmp-ui/NpmTextArea";
import NpmModal from "./../../../nmp-ui/NpmModal";
import NpmLongText from "./../../../nmp-ui/NpmLongText";
import NpmStepper from "./../../../nmp-ui/NpmStepper";

const MemberDFormView = ({ profile, selectedForm, setRecentlySubmitted }) => {
  const optionsTest = ["option-1", "option-2", "option-3", "option-4", "option-5", "option-6", "option-7"];
  const handleChange = (option) => {
    console.log("option", option);
  };

  const onchangeDate = (time, timeString) => {
    console.log("Date", time, timeString);
  };

  const onChangeTime = (time, timeString) => {
    console.log("Time", time, timeString);
  };
  return (
    <Row className="memberDForm">
      <Col span={4} className="memberDForm-stepper">
        <div>
          <NpmStepper
            sections={[{ title: "one" }, { title: "two" }, { title: "three" }, { title: "four" }, { title: "five" }]}
          />
        </div>
      </Col>
      <Col span={20} className="memberDForm-content">
        <div className="memberDForm-content_box">
          <div className="memberDForm-content_box_title">{selectedForm?.title || selectedForm?.name}</div>
          <NpmCard style={{ minHeight: "50vh", maxWidth: "783px", width: "57vw", marginTop: "3%" }}>
            <div className="memberDForm-content_box_card">
              <div className="memberDForm-content_box_card_section-name">Section 1</div>
              <div className="memberDForm-content_box_card_section-fields">
                {/* <NpmInputSelect options={optionsTest} handleChange={handleChange} />
                <NpmDatePicker onChangeDate={onchangeDate} />
                <NpmTimePicker onChangeTime={onChangeTime} />
                <NpmRadioGroup
                  options={["options1", "options2", "options3", "options4", "options5"]}
                  handleOptionSelect={(data) => {
                    console.log(data);
                  }}
                />
                <NpmTextArea />
                <NpmModal btnNameModal={"Expand text area"}>
                  <p>Hello</p>
                  <p>Hello</p>
                  <p>Hello</p>
                  <p>Hello</p>
                </NpmModal> */}
                {/* <NpmLongText isModalOpen={true} /> */}
              </div>
            </div>
          </NpmCard>
        </div>
      </Col>
    </Row>
  );
};

export default MemberDFormView;
