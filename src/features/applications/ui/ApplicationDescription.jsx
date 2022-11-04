import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import _ from "lodash";
import { Form } from "antd";
// Used for prev design. Will be refactored
import { Button } from "reactstrap";

import { ApplicationDescriptionFormFields } from "./ApplicationDescriptionFormFields";

export const ApplicationDescription = ({ applicationDescriptionData, onSubmit, categories }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const { organizationName } = applicationDescriptionData;

  useEffect(() => {
    setDisabled(true);

    form.setFieldsValue(applicationDescriptionData);
  }, [applicationDescriptionData]);

  const onFormFinish = (submittedObj) => {
    _.forOwn(submittedObj, (value, key) => {
      if (value?.value) {
        submittedObj[key] = value.value;
      }
    });

    onSubmit(submittedObj);
  };

  const handleFormChange = () => {
    const fieldsValue = form.getFieldsValue();

    const fieldsKeys = Object.keys(fieldsValue);

    setDisabled(true);

    const normalizedFieldsValue = normalize(fieldsValue);
    const normalizedInitialValues = normalize(applicationDescriptionData);

    fieldsKeys.forEach((key) => {
      if (!_.isEqual(normalizedFieldsValue[key], normalizedInitialValues[key])) {
        setDisabled(false);
        return;
      }
    });
  };

  const normalize = (object) => {
    _.forOwn(object, (value, key) => {
      if (value?.value) {
        object[key] = value.value;
      }
    });

    return object;
  };

  return (
    <Row className="px-3">
      <Col md="12">
        <div className="d-flex mb-2 font-size-large">
          <div className="font-weight-bold">Organization</div>
          <div className="pl-1 w-100">{organizationName}</div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
          onFieldsChange={handleFormChange}
          name="descriptionForm"
        >
          <ApplicationDescriptionFormFields categories={categories} />

          <div className="px-3">
            <div className="application_delimiter" />

            <div className="d-flex justify-content-center">
              <Form.Item>
                <Button
                  color="primary"
                  className="button button-success"
                  type="primary"
                  shape="round"
                  size="large"
                  htmltype="submit"
                  disabled={disabled}
                >
                  Save
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

ApplicationDescription.propTypes = {
  applicationDescriptionData: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.array,
};
