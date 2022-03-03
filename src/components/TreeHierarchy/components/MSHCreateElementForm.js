import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Col, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";

import { useDidMount } from "hooks/use-did-mount";
import { useFormGroup, useFormField, Validators } from "hooks/use-form";

import Button from "components/nmp/Button";
import TextField from "components/nmp/TextField";

const MSHCreateElementForm = ({ placeholder, submitting, onSubmit: propOnSubmit }) => {
  const nameFieldRef = useRef();
  const [name, setName] = useFormField("", [Validators.required]);
  const formGroup = useFormGroup({ name });

  const onSubmit = preventDefault(() => propOnSubmit(formGroup));

  useDidMount(() => nameFieldRef.current && nameFieldRef.current.focus());

  return (
    <form onSubmit={onSubmit}>
      <Row className="my-3">
        <Col>
          <TextField
            label="Element location and name"
            name="name"
            placeholder={placeholder}
            onChange={({ target }) => setName(target.value)}
            ref={nameFieldRef}
            {...name}
          />
        </Col>
      </Row>

      <Row className="my-3">
        <Col>
          <div className="d-flex justify-content-end">
            <Button color="primary" disabled={formGroup.invalid} loading={submitting} type="submit">
              Create
            </Button>
          </div>
        </Col>
      </Row>
    </form>
  );
};

MSHCreateElementForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSHCreateElementForm;
