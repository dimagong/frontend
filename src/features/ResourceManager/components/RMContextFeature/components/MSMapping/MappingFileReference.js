import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import React, { useMemo } from "react";

import NmpSelect from "components/nmp/NmpSelect";

import { OptionsType, OptionType } from "utility/prop-types";

const MappingFileReference = ({ name, value, options, onChange, fieldTemplate: propFieldTemplate }) => {
  const fieldTemplate = useMemo(() => `{{ msRef: ${propFieldTemplate} }}`, [propFieldTemplate]);

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
            name={name}
            value={value}
            options={options}
            onChange={onChange}
            backgroundColor="transparent"
            placeholder="Select a MasterSchema reference"
            menuPosition="fixed"
            searchable
          />
        </div>
      </Col>
    </Row>
  );
};

MappingFileReference.propTypes = {
  name: PropTypes.string.isRequired,
  value: OptionType,
  options: OptionsType.isRequired,
  onChange: PropTypes.func.isRequired,
  fieldTemplate: PropTypes.string.isRequired,
};

export default MappingFileReference;
