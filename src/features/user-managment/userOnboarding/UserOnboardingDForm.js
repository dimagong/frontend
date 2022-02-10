import React, {useState, useRef, useEffect} from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Spinner,
} from "reactstrap"
import {RefreshCw} from "react-feather"
import FormCreate from 'components/FormCreate/FormCreate'
import {useDispatch, useSelector} from "react-redux";
import {selectManager, selectLoading} from "app/selectors";
import {debounce} from 'lodash';
import moment from 'moment';

import appSlice from 'app/slices/appSlice'

const {
  updateDFormRequest,
  submitdFormDataRequest,
  changedFormStatusRequest,
  getUserByIdRequest,
  submitdFormNewVersionRequest
} = appSlice.actions;

const initRefreshClassName = "bg-hover-icon";

const UpdatedAtText = ({ loading, date }) => {
  if (loading) {
    return (
      <div className="d-flex">
        <div>Saving progress..</div>
        {<Spinner className="ml-1" color="success"/>}
      </div>
    );
  }

  // return `Progress saved: ${moment(manager.onboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`;
  return `Progress saved: ${moment(date).format('YYYY-MM-DD HH:mm:ss')}`;
};

const UserOnboardingDForm = ({ isManualSave }) => {
  const [isStateConfig] = useState(false);
  const [refreshClassName, setRefreshClassName] = useState(initRefreshClassName);
  const manager = useSelector(selectManager);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const updatedAt = React.useMemo(() => manager.onboarding.d_form.updated_at, [manager.onboarding.d_form.updated_at]);
  const updatedAtTextLoding = useRef(false);
  const isFormMutated = useRef(false);
  const tempData = useRef(null);

  const handleSave = (data, dForm, userId) => {
    updatedAtTextLoding.current = true;

    dispatch(submitdFormDataRequest({dForm: dForm, data}));
    // todo for refresh (refactor)
    dispatch(getUserByIdRequest({userId: userId}))
  };

  const debounceOnSave = useRef(debounce(handleSave, 1500));
  const refreshOnboarding = useRef(debounce((userId) => {
    dispatch(getUserByIdRequest({userId: userId}))
  }, 1500));

  const handleFormChange = (data) => {
    if (isManualSave) {
      if (!isFormMutated.current) {
        isFormMutated.current = true;
      }
      tempData.current = data;
    } else {
      debounceOnSave.current(data, manager.onboarding.d_form, manager.id)
    }
  };

  useEffect(() => {
    if (!loading) {
      refreshClassName === `${initRefreshClassName} rotating` && setRefreshClassName(initRefreshClassName);
      updatedAtTextLoding.current && (updatedAtTextLoding.current = false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const submitDForm = (dForm, {name, description, protected_properties}) => {
    dispatch(updateDFormRequest({...dForm, name, description, protected_properties}))
  };

  const statusChanged = (status) => {
    dispatch(changedFormStatusRequest({dForm: manager.onboarding.d_form, status}))
  };

  const submitOnboardingForm = data => {
    if (isManualSave) {
      isFormMutated.current = false
    }

    dispatch(submitdFormNewVersionRequest({dForm: manager.onboarding.d_form, data, userId: manager.id}));
    dispatch(getUserByIdRequest({userId: manager.id}))
  };
  const handleRefresh = () => {
    refreshOnboarding.current(manager.id);
    setRefreshClassName(`${initRefreshClassName} rotating`)
    setRefreshClassName(`${initRefreshClassName} rotating`)
  };

  const handlePageLeave = (e) => {
    e.preventDefault();
    e.returnValue = ''; //required for Chrome
  };

  useEffect(() => {
    // Ask user if he want to leave page without saving changes. Work in case if user leave application
    window.addEventListener("beforeunload", handlePageLeave);

    return () => {
      window.removeEventListener("beforeunload", handlePageLeave);

      if (isFormMutated.current) {
        // Ask user if he want to save changes before component will unmount
        const isSaveChanges = window.confirm("Save changes before leave?");

        if (isSaveChanges) {
          submitOnboardingForm(tempData.current)
        }
      }
    }
  }, []);

  return (
    <Col md="12" className="mb-4">
      <Card className="dform border">
        <CardHeader className="m-0">
          <CardTitle>
            Onboarding dForm
          </CardTitle>
          <div>
            {/*{*/}
            {/*  isStateConfig ?*/}
            {/*    <EyeOff size={15} className="cursor-pointer mr-1"*/}
            {/*            onClick={switchStateConfig}/>*/}
            {/*    :*/}
            {/*    <Eye size={15} className="cursor-pointer mr-1"*/}
            {/*         onClick={switchStateConfig}/>*/}
            {/*}*/}
            <RefreshCw
              className={refreshClassName}
              size={15} onClick={handleRefresh}/>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <hr/>
          <FormCreate
            fileLoader={true}
            submitDForm={submitDForm}
            liveValidate={false}
            inputDisabled={false}
            fill={true}
            onSaveButtonHidden={true}
            statusChanged={statusChanged}
            onChange={handleFormChange}
            dForm={manager.onboarding.d_form}
            onboardingUser={manager}
            isStateConfig={isStateConfig}
            updatedAtText={<UpdatedAtText loading={loading && updatedAtTextLoding.current} date={updatedAt} />}
            onCreateNewVersion={submitDForm}
            onSubmit={(formData) => submitOnboardingForm(formData)}

            // reInit={(reInit, context) => {
            //   this.reInitForm = reInit.bind(context)
            // }}
          />
        </CardBody>
      </Card>
    </Col>
  )
};

export default UserOnboardingDForm
