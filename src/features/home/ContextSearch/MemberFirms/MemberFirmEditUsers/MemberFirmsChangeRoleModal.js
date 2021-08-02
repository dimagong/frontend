//import {Input, Select} from "../../../../Surveys/Components/SurveyFormComponents";
import Select from "react-select"
import React, {useEffect, useState} from "react";
import SurveyModal from "../../../../Surveys/Components/SurveyModal";
import {useDispatch} from "react-redux";
import appSlice from "../../../../../app/slices/appSlice";
import {toast} from "react-toastify";

const {
  addMemberFirmUsersRequest
} = appSlice.actions;

const MemberFirmsChangeRoleModal = ({isOpen, setIsOpen, user, memberFirm, principals, isEdit, setIsEdit}) => {
  const dispatch = useDispatch()
  const [currRole, setCurrRole] = useState('')

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      setCurrRole(newValue.value.name.toLowerCase())
    }
  };

  useEffect(() => {
    if (isEdit && principals && user.hasOwnProperty('id')) {
      setCurrRole(principals.find(item => item.id === user.id) ? 'principal' : 'member')
    }
  }, [user?.id, principals])


  return <SurveyModal
      className="survey-create-modal"
      title={"Member firm role"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      submitBtnText={"Save"}
      onSubmit={() => {
        if (!currRole) {
          toast.error("Please choose the role of the user")
          return;
        }
        if (isEdit && currRole !== principals.find(item => item.id === user.id) ? 'principal' : 'member') {
          dispatch(addMemberFirmUsersRequest({
            users: [{
               id: user.id,
               type: currRole
           }],
           memberFirmId: memberFirm.id,
           isEdit: isEdit
          }))
        }
        setCurrRole('');
        setIsOpen(false)
        setIsEdit(false)
      }}
    >
      <div style={{paddingBottom: 50}}>
        <h2 style={{marginBottom: 20}}>Role member within Member Firm</h2>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isSearchable
          name="Choose user role"
          options={[{label: 'Principal', value: {name: 'Principal'}}, {label: 'Member', value: {name:'Member'}}]}
          onChange={handleChange}
          value={currRole ? {label: currRole[0].toUpperCase() + currRole.slice(1)} : undefined}
        />
      </div>

    </SurveyModal>
}

export default MemberFirmsChangeRoleModal;
