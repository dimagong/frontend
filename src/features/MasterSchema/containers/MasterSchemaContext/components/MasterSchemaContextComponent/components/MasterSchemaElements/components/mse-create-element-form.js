import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";
import MSEButton from "features/MasterSchema/share/mse-button";
import MSETextField from "features/MasterSchema/share/mse-text-field";
import { useFormGroup, useFormField, Validators } from "hooks/use-form";
// import MSESelectField from "features/MasterSchema/share/mse-select-field";

// const computeOptionsFromArray = (array) => array.map((value) => ({ label: value, value }));

const MSECreateElementForm = ({ submitting, onSubmit: propOnSubmit }) => {
  const [elementPath, setElementPath] = useFormField("", [Validators.required]);
  // Next Feature Update
  // const [elementTypeOptions] = useState(computeOptionsFromArray(["select", "text"]));
  // const [elementType, setElementType] = useFormField(null, [Validators.required]);
  const formGroup = useFormGroup({
    elementPath,
    // elementType,
  });

  const onSubmit = preventDefault(() => propOnSubmit(formGroup));

  return (
    <form onSubmit={onSubmit}>
      <Row className="my-3">
        <Col>
          <MSETextField
            label="Element location and name"
            name="elementPath"
            placeholder="MS.ValidPath.bio.firstName"
            onChange={({ target }) => setElementPath(target.value)}
            {...elementPath}
          />
        </Col>
      </Row>

      {/* Next Feature Update */}
      {/*<Row className="my-3">
        <Col>
          <MSESelectField
            label="Element type"
            name="elementType"
            placeholder="New option"
            options={elementTypeOptions}
            onChange={setElementType}
            {...elementType}
          />
        </Col>
      </Row>*/}

      <Row className="my-3">
        <Col>
          <div className="d-flex justify-content-end">
            <MSEButton color="primary" disabled={formGroup.invalid} loading={submitting} type="submit">
              Create
            </MSEButton>
          </div>
        </Col>
      </Row>
    </form>
  );
};

MSECreateElementForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSECreateElementForm;
