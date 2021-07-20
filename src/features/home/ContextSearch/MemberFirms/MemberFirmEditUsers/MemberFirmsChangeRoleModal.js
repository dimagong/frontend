import {Input, Select} from "../../../../Surveys/Components/SurveyFormComponents";
import React from "react";
import SurveyModal from "../../../../Surveys/Components/SurveyModal";

const MemberFirmsChangeRoleModal = ({isOpen, setIsOpen}) => {

  return <SurveyModal
      className="survey-create-modal"
      title={"Member firm role"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      submitBtnText={"Save"}
      onSubmit={() => {setIsOpen(false)}}
    >
      <div style={{paddingBottom: 50}}>
        <h2 style={{marginBottom: 20}}>Role member within Member Firm</h2>
        <Select
          options={[{label: 'Principal'}, {label: 'Member'}]}
        />
      </div>

    </SurveyModal>
}

export default MemberFirmsChangeRoleModal;
