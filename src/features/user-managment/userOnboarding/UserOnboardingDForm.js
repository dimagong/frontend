import React, { useEffect } from "react";
import { RefreshCw } from "react-feather";
import { Card, CardHeader, CardTitle, CardBody, Col, Spinner } from "reactstrap";

import { DForm } from "components/DForm";

const useEffectBeforeUnmount = (callback, deps = []) => {
  const mounted = React.useRef(null);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  React.useEffect(
    () => () => {
      if (mounted.current === false) {
        callback(...deps);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, ...deps]
  );
};

const UserOnboardingDForm = (props) => {
  const { dFormId, schema, values, accessType, isLoading, onFieldChange, onRefetch, onBeforeUnmount } = props;

  useEffect(() => {
    const onBeforeUnload = (e) => {
      e.preventDefault();
      // Required for Chrome
      e.returnValue = "";
    };
    // Ask user if he wants to leave the page without saving changes.
    // Work in case if user leave application.
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffectBeforeUnmount(onBeforeUnmount, []);

  return (
    <Col md="12">
      <Card className="dform border">
        <CardHeader className="m-0">
          <CardTitle>Onboarding dForm</CardTitle>
          <div>
            <RefreshCw className={`bg-hover-icon ${isLoading ? "rotating" : ""}`} size={15} onClick={onRefetch} />
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          {isLoading || !schema || !values ? (
            <div className="d-flex justify-content-center align-items-center height-300">
              <Spinner color="primary" size="40" />
            </div>
          ) : (
            <DForm
              dFormId={dFormId}
              schema={schema}
              values={values}
              accessType={accessType}
              onFieldChange={onFieldChange}
            />
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default UserOnboardingDForm;
