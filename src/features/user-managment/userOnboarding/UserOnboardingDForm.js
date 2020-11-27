import React, {useState, useRef, useEffect} from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Spinner,
} from "reactstrap"
import {RefreshCw, EyeOff, Eye} from "react-feather"
import FormCreate from 'components/FormCreate/FormCreate'
import {useDispatch, useSelector} from "react-redux";
import {selectManager, selectLoading} from "app/selectors";
import {
  updateDFormRequest,
  submitdFormDataRequest,
  changedFormStatusRequest,
  getUserByIdRequest
} from "app/slices/appSlice";
import {debounce} from 'lodash';
import moment from 'moment';

const initRefreshClassName = "bg-hover-icon";

const UserOnboardingDForm = () => {
  const [isStateConfig, setStateConfig] = useState(false);
  const [refreshClassName, setRefreshClassName] = useState(initRefreshClassName);
  const manager = useSelector(selectManager);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const updatedAtTextLoding = useRef(false);

  const debounceOnSave = useRef(debounce((data, dForm, userId) => {
    updatedAtTextLoding.current = true;

    dispatch(submitdFormDataRequest({dForm: dForm, data}))
    // todo for refresh (refactor)
    dispatch(getUserByIdRequest({userId: userId}))
  }, 1500));
  const refreshOnboarding = useRef(debounce((userId) => {
    dispatch(getUserByIdRequest({userId: userId}))
  }, 1500));

  useEffect(() => {
    if (!loading) {
      refreshClassName === `${initRefreshClassName} rotating` && setRefreshClassName(initRefreshClassName);
      updatedAtTextLoding.current && (updatedAtTextLoding.current = false)
    }
  }, [loading]);

  const switchStateConfig = () => {
    setStateConfig(!isStateConfig)
  };


  const submitDForm = (dForm, {name, description, protected_properties}) => {
    dispatch(updateDFormRequest({...dForm, name, description, protected_properties}))
  };

  const statusChanged = (status) => {
    dispatch(changedFormStatusRequest({dForm: manager.onboarding.d_form, status}))
  };

  const updatedAtText = () => {
    return loading && updatedAtTextLoding.current
      ? (<div className="d-flex">
        <div>Saving progress..</div>
        {<Spinner className="ml-1" color="success"/>}
      </div>)
      : `Progress saved: ${moment(manager.onboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`
  };
  const handleRefresh = () => {
    refreshOnboarding.current(manager.id);
    setRefreshClassName(`${initRefreshClassName} rotating`)
    setRefreshClassName(`${initRefreshClassName} rotating`)
  };
  return (
    <Col md="12" className="mb-4">
      <Card className="border">
        <CardHeader className="m-0">
          <CardTitle>
            Onboarding dForm
          </CardTitle>
          <div>
            {
              isStateConfig ?
                <EyeOff size={15} className="cursor-pointer mr-1"
                        onClick={switchStateConfig}/>
                :
                <Eye size={15} className="cursor-pointer mr-1"
                     onClick={switchStateConfig}/>
            }
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
            onChange={(data) => debounceOnSave.current(data, manager.onboarding.d_form, manager.id)}
            dForm={manager.onboarding.d_form}
            onboardingUser={manager}
            isStateConfig={isStateConfig}
            updatedAtText={updatedAtText()}



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
