import { Col, Row } from "reactstrap";
import React, { useEffect, useMemo } from "react";

import { useFormField, Validators } from "hooks/use-form";

import NmpSelect from "components/nmp/NmpSelect";

const MappingFileReference = ({ value, options, onChange, fieldTemplate: propFieldTemplate, }) => {
  const fieldTemplate = useMemo(() => `{{ msRef: ${propFieldTemplate} }}`, [propFieldTemplate]);

  // Fixme: Pristine & Dirty case within invalid/valid then use Validators.identical(value)
  const field = useFormField(value, [Validators.required], { useAdvanced: true });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange(field), [field.value]);

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

MappingFileReference.propTypes = {};

export default MappingFileReference;
