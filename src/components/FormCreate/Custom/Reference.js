import React, { useEffect, useState, useCallback } from "react";
import masterSchemaService from "../../../services/masterSchema.service";
import { Input } from "@material-ui/core";
import { debounce, isEmpty } from "lodash";

function OnboardingReference(props) {
  const { fieldId, userId } = props;

  const [fieldValue, setFieldValue] = useState({});

  let onChangeFieldValue = useCallback(
    debounce(async (newValue) => {
      try {
        const response = await masterSchemaService.changeFieldValue(fieldId, userId, newValue);
        setFieldValue(response.data.data);
      } catch (exception) {
        console.log(exception);
      }
    }, 1200),
    []
  );

  useEffect(() => {
    getUserValueByFieldId(fieldId, userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserValueByFieldId = async (fieldId, userId) => {
    try {
      const response = await masterSchemaService.getUserValueByFieldId(fieldId, userId);
      setFieldValue(response.data.data);
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div>
      {!isEmpty(fieldValue) ? (
        <Input
          fullWidth
          disabled={props.disabled}
          onChange={(event) => {
            setFieldValue({ value: event.target.value });
            onChangeFieldValue(event.target.value);
          }}
          value={fieldValue.value}
        />
      ) : (
        <Input fullWidth disabled={true} />
      )}
    </div>
  );
}

export default function Reference(props) {
  // if user exist then that is onboarding not dFormTemplate
  // bind to context FormCreate
  const user = this.state.onboardingUser;

  if (user) {
    const fieldId = props.schema.field_id;
    const userId = this.state.onboardingUser.id;
    const data = { fieldId, userId };
    return <OnboardingReference {...data} {...props} />;
  }

  return <Input fullWidth placeholder="Reference" disabled={true} />;
}
