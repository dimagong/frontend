import React, {useEffect, useState, useCallback} from 'react'
import masterSchemaService from "../../../views/pages/master-schema/services/masterSchema.service";
import {Input} from 'reactstrap'
import {debounce, isEmpty} from 'lodash'


function OnboardingReference(props) {
  console.log('Reference', props);

  const [fieldValue, setFieldValue] = useState({});

  const fieldId = props.schema.field_id;
  const userId = this.state.onboardingUser.id;

  let onChangeFieldValue = useCallback(
    debounce(async (newValue) => {
      try {
        const response = await masterSchemaService.changeFieldValue(fieldId, userId, newValue);
        setFieldValue(response.data.data);
      } catch (exception) {
        console.log(exception);
      }
    }, 1200), []
  );

  useEffect(() => {
    getUserValueByFieldId(fieldId, userId);
  }, []);


  const getUserValueByFieldId = async (fieldId, userId) => {
    try {
      const response = await masterSchemaService.getUserValueByFieldId(fieldId, userId);
      setFieldValue(response.data.data);
    } catch (exception) {
      console.log(exception);
    }
  };


  return <div>
    {
      !isEmpty(fieldValue) ?
        <Input
          onChange={(event) => {
            setFieldValue({value: event.target.value});
            onChangeFieldValue(event.target.value);
          }}
          value={fieldValue.value}
        />
        : <Input disabled={true}></Input>
    }
  </div>;
}

export default function Reference(props) {
  // if user exist then that is onboarding not dFormTemplate
  const user = this.state.onboardingUser;

  return !isEmpty(user) ? <OnboardingReference {...props}></OnboardingReference> : <Input placeholder="Reference" disabled={true}></Input>
}
