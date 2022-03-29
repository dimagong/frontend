import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import React, { useEffect, useMemo } from "react";

import { useFormField } from "hooks/use-form";

import { OptionsType } from "utility/prop-types";

import NmpSelect from "components/nmp/NmpSelect";

const MappingFileReference = ({ value, options, onChange, fieldTemplate: propFieldTemplate, }) => {
  const fieldTemplate = useMemo(() => `{{ msRef: ${propFieldTemplate} }}`, [propFieldTemplate]);

  const field = useFormField(value, [], { useAdvanced: true });
  // Call onChange when field.value changing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange(field), [field.value]);
  // Update value
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => field.onChange(value), [value]);

  return (
    <Row className="py-1" noGutters>
      <Col xs="4">
        <div className="ms-mapping__template-key py-2 px-1 bg-white" title={fieldTemplate}>
          {fieldTemplate}
        </div>
      </Col>

      <Col className="d-flex align-items-center" xs="8">
        <div className="full-width pl-2">
          <NmpSelect
            value={field.value}
            options={options}
            onChange={field.onChange}
            backgroundColor="transparent"
            placeholder="Select a MasterSchema reference"
            menuPosition="fixed"
          />

          {field.errors.length > 0 ? (
            <div>
              <span className="text-danger">{field.errors[0]}</span>
            </div>
          ) : null}
        </div>
      </Col>
    </Row>
  );
};

MappingFileReference.propTypes = {
  value: PropTypes.any.isRequired,
  // defaultValue: PropTypes.any,
  options: OptionsType.isRequired,
  onChange: PropTypes.func.isRequired,
  fieldTemplate: PropTypes.string.isRequired,
};

export default MappingFileReference;
