import React, {useEffect, useState} from 'react';
import {Modal, ModalBody} from "reactstrap";
import MemberFirmModalTable from "./MemberFirmModalTable";
import AutoComplete from "../../../../../components/@vuexy/autoComplete/AutoCompleteComponent";
import FilterIcon from "../../../../../assets/img/svg/filter.svg";
import {X} from "react-feather";

const MemberFirmEditUsers = ({isModalOpen, setIsModalOpen, managers}) => {
  const [managersIn, setManagersIn] = useState([]);
  const [managersOut, setManagersOut] = useState([]);

  const addUser = (user) => {
    setManagersOut([...managersOut].filter(item => item.id !== user.id))
    setManagersIn([user, ...managersIn])
  }

  const removeUser = (user) => {
    setManagersIn([...managersIn].filter(item => item.id !== user.id))
    setManagersOut([user, ...managersOut])
  }

  const handleSearch = (inputText) => {
    // Temporary using constant managersOut
    setManagersOut([...managers.slice(2)].filter(item =>
      (item.first_name + item.last_name).toLowerCase().search(inputText.toLowerCase()) !== -1))
  }

  useEffect(() => {
    // Temporary set managers in and out
    setManagersIn(managers ? [managers[0], managers[1]] : []);
    setManagersOut(managers ? managers.slice(2) : []);
  }, [managers?.length])

  return (
    <Modal
      size="lg"
      className={"member-firms-users-modal"}
      isOpen={isModalOpen}
      fade={false}
      toggle={()=>{setIsModalOpen(false)}}>
      <div className="survey-modal_header">
          <div className="survey-modal_header_title">
            Edit member firm
          </div>
          <div className={"survey-modal_header_cross"}>
            <X
              size={26}
              className={"survey-modal_header_cross-icon"}
              onClick={() => {setIsModalOpen(false)}}
            />
          </div>
        </div>
        <ModalBody style={{marginLeft: 15}}>
          <div style={{width: 693, marginBottom: 50, marginTop: 10}}>
            <AutoComplete
              placeholder="Search"
              suggestions={[]}
              className="form-control"
              filterKey="name"
              onEnter={handleSearch}
              suggestionLimit={4}
              defaultSuggestions={false}
              customRender={() => {}}
              showClear={true}
              hideSuggestions
            />
          </div>
          <img className={'filter-icon member-firm-filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
          <MemberFirmModalTable
            array={managersOut}
            setArray={setManagersOut}
            changeUser={addUser}
            isTitle
            isAddUser
          />
          <div style={{fontWeight: 'bold'}}>Existing</div>
          <MemberFirmModalTable
            array={managersIn}
            changeUser={removeUser}
          />
        </ModalBody>
      </Modal>
  )
};

export default MemberFirmEditUsers;
