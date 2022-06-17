import React from "react";

import "./styles.scss";
import { Button } from "reactstrap";
import FieldLabel from "../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/FieldLabel";
import Select from "react-select";
import { colourStyles } from "../../../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";
import TextWidget from "../../../../../../components/FormCreate/Custom/TextWidget";

const EFFECTS = [
  {
    value: "hidden",
    label: "hidden if",
  },
  {
    value: "shown",
    label: "shown if",
  },
  {
    value: "disabled",
    label: "disabled if",
  },
  {
    value: "active",
    label: "active if",
  },
];

const OPERANDS = [
  {
    value: "equal",
    label: "equal to",
  },
  {
    value: "not equal",
    label: "not equal to",
  },
  {
    value: "bigger",
    label: "bigger then",
  },
  {
    value: "smaller",
    label: "smaller then",
  },
];

const ConditionalElementRender = ({ conditions }) => {
  return (
    <div className="conditional-element-render">
      {/*{!conditions.length ? (*/}
      {/*  <div className="conditional-element-render_no-conditions">*/}
      {/*    There are no conditions for this element*/}
      {/*  </div>*/}
      {/*) : (*/}
      <div className="mb-2">
        <div className="conditional-element-render_condition">
          <div className={"custom-react-select mb-2"}>
            <FieldLabel label={"This element will be"} />
            <Select
              maxMenuHeight={175}
              isDisabled={false}
              styles={colourStyles}
              isMulti={false}
              name="colors"
              value={null}
              onChange={() => {}}
              options={EFFECTS}
              className="React"
              classNamePrefix="select"
              placeholder={"Select an effect"}
            />
          </div>
          <div className={"custom-react-select mb-2"}>
            <FieldLabel label={"If value of field"} />
            <Select
              maxMenuHeight={175}
              isDisabled={false}
              styles={colourStyles}
              isMulti={false}
              name="colors"
              value={null}
              onChange={() => {}}
              options={[]}
              className="React"
              classNamePrefix="select"
              placeholder={"Select field"}
            />
          </div>
          <div className={"custom-react-select mb-2"}>
            <FieldLabel label={"Will be"} />
            <Select
              maxMenuHeight={175}
              isDisabled={false}
              styles={colourStyles}
              isMulti={false}
              name="colors"
              value={null}
              onChange={() => {}}
              options={OPERANDS}
              className="React"
              classNamePrefix="select"
              placeholder={"Select operand"}
            />
          </div>
          <TextWidget value={""} label={"To"} placeholder={"Enter expected value"} onChange={() => {}} />
        </div>
      </div>
      {/*)}*/}
      <div className="d-flex justify-content-center">
        <Button color={"primary"} onClick={() => {}} className={"button button-success"}>
          Add condition
        </Button>
      </div>
    </div>
  );
};

export default ConditionalElementRender;
