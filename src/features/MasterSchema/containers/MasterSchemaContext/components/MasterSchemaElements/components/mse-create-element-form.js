import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import React, { useState } from 'react';

import LoadingButton from 'components/LoadingButton';

import TextField from '../text-field';
import SelectField from '../select-field';
import { preventDefault } from '../event-decorators';
import { useFormGroup, useFormField, Validators } from 'hooks/use-form';

const computeOptionsFromArray = (array) => array.map((value) => ({ label: value, value }));

const MSECreateElementForm = ({ submitting, onElementCreation }) => {
  const [elementPath, setElementPath] = useFormField('', [Validators.required]);
  const [elementTypeOptions] = useState(computeOptionsFromArray(['select', 'text']));
  const [elementType, setElementType] = useFormField(elementTypeOptions[0], [Validators.required]);
  const [formGroup] = useFormGroup({
    elementPath,
    elementType,
  });

  const onSubmit = preventDefault(() => onElementCreation(formGroup.values));

  return (
    <form onSubmit={onSubmit}>
      <Row className="my-3">
        <Col className="ms-elements__input-field">
          <TextField
            label="Element location and name"
            name="elementPath"
            placeholder="MS.ValidPath.bio.firstName"
            onChange={({ target }) => setElementPath(target.value)}
            {...elementPath}
          />
        </Col>
      </Row>

      <Row className="my-3">
        <Col className="ms-elements__input-field">
          <SelectField
            label="Element type"
            name="elementType"
            placeholder="New option"
            options={elementTypeOptions}
            onChange={setElementType}
            {...elementType}
          />
        </Col>
      </Row>

      <Row className="my-3">
        <Col>
          <div className="d-flex">
            <LoadingButton
              type="submit"
              className="ms-auto px-4"
              style={{ backgroundColor: '#7367F0', color: '#fff' }}
              isLoading={submitting}
              disabled={formGroup.invalid}
              value="Create"
            />
          </div>
        </Col>
      </Row>
    </form>
  );
};

MSECreateElementForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  onElementCreation: PropTypes.func.isRequired,
};

export default MSECreateElementForm;
