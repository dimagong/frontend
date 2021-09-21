import React from 'react';

import FormComponent from "./Components/FormComponent";

import './styles.scss';

const MemberFirmInfoForm = ({
  isMemberFirmFormFieldsLoading,
  isMasterSchemaFieldsForMemberFirmLoading,
  memberFirmFormFields,
  masterSchemaMemberFirmFields,
  memberFirmId,
}) => {

  const handleFieldAdd = () => {

  };

  return (
    <div className="member_firm_info_form">
      <FormComponent
        onFieldAdd={handleFieldAdd}
        memberFirmId={memberFirmId}
        isMemberFirmFormFieldsLoading={isMemberFirmFormFieldsLoading}
        isMasterSchemaFieldsForMemberFirmLoading={isMasterSchemaFieldsForMemberFirmLoading}
        memberFirmFormFields={memberFirmFormFields}
        masterSchemaMemberFirmFields={masterSchemaMemberFirmFields}
      />
    </div>
  )
};

export default MemberFirmInfoForm;
