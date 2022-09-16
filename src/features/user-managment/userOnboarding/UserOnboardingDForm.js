import React, { useEffect } from "react";
import { RefreshCw } from "react-feather";
import { Card, CardHeader, CardTitle, CardBody, Col, Spinner } from "reactstrap";

import { DForm } from "components/DForm";

// const initRefreshClassName = "bg-hover-icon";

// const UpdatedAtText = ({ loading, date }) => {
//   if (loading) {
//     return (
//       <div className="d-flex">
//         <div>Saving progress..</div>
//         {<Spinner className="ml-1" color="success" />}
//       </div>
//     );
//   }
//
//   // return `Progress saved: ${moment(manager.onboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`;
//   return `Progress saved: ${moment(date).format("YYYY-MM-DD HH:mm:ss")}`;
// };

// TODO handle updated at text

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

  // const updatedAt = React.useMemo(() => manager.onboarding.d_form.updated_at, [manager.onboarding.d_form.updated_at]);
  // const updatedAtTextLoding = useRef(false);

  // const handleSave = (data, dForm, userId) => {
  //   updatedAtTextLoding.current = true;
  //
  //   dispatch(submitdFormDataRequest({ dForm: dForm, data }));
  //   // todo for refresh (refactor)
  //   dispatch(getUserByIdRequest({ userId: userId }));
  // };

  // const debounceOnSave = useRef(debounce(handleSave, 1500));
  // const refreshOnboarding = useRef(
  //   debounce((userId) => {
  //     dispatch(getUserByIdRequest({ userId: userId }));
  //   }, 1500)
  // );

  // const handleFormChange = (data) => {
  //   if (isManualSave) {
  //     if (!isFormMutated.current) {
  //       isFormMutated.current = true;
  //     }
  //     tempData.current = data;
  //   } else {
  //     debounceOnSave.current(data, manager.onboarding.d_form, manager.id);
  //   }
  // };

  // const submitDForm = (dForm, { name, description, protected_properties }) => {
  //   dispatch(updateDFormRequest({ ...dForm, name, description, protected_properties }));
  // };

  // const statusChanged = (status) => {
  //   dispatch(changedFormStatusRequest({ dForm: manager.onboarding.d_form, status }));
  // };

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
