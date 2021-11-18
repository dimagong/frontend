import React, {useEffect, useState} from 'react';
import {Button, Modal, ModalBody} from "reactstrap";
import MemberFirmModalTable from "./MemberFirmModalTable";
import {X} from "react-feather";
import {useDispatch} from "react-redux";
import MemberFirmsChangeRoleModal from "./MemberFirmsChangeRoleModal";
import appSlice from "app/slices/appSlice";
import SearchAndFilter from "components/SearchAndFilter";

const {
  removeMemberFirmUsersRequest,
  getMemberFirmPotentialUsersRequest
} = appSlice.actions;


const MemberFirmEditUsers = ({isModalOpen, setIsModalOpen, members, potentialMembers, memberFirm, allMembers, principals}) => {
  const dispatch = useDispatch()
  const [searchedMembers, setSearchedMembers] = useState([])
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [currUser, setCurrUser] = useState({});

  const filterTypes = {roles: ['Admin', 'Corporation manager', 'Prospect', 'Suspect', 'Archived', 'Network manager', 'Member', 'Lead']}

  const removeUser = (user) => {
    dispatch(removeMemberFirmUsersRequest({
      memberFirmId: memberFirm.id,
      users: [user.id]
    }))
  }

  const handleSearch = (e) => {
    setSearchedMembers(potentialMembers.filter(item =>
      (item.first_name + item.last_name).toLowerCase().search(e.target.value.toLowerCase()) !== -1))
    if (e.target.value.length > 0) {
      setIsFiltered(true)
    } else {
      setIsFiltered(false)
    }
  }

  const handleFilter = (newManagers, filter) => {
    setSearchedMembers(newManagers)
    if (filter.roles.size > 0) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  }

  const onCancelFilter = () => {
    setSearchedMembers([]);
    setIsFiltered(false);
  }

  const applyFilter = (managers, filter) => {
    let newManagers = managers;
    if (filter?.roles && filter?.roles?.length !== 0) {
      newManagers = managers.filter(item => {
        return filter.roles.find(role => role === (item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace('_', ' ').slice(1)))
      })
    }
    setSearchedMembers(newManagers);
    setIsFiltered(true);
  }

  useEffect(() => {
    dispatch(getMemberFirmPotentialUsersRequest(memberFirm.id));
  }, [members?.length])

  useEffect(() => {
    let newSearchedManagers = potentialMembers.filter(item => searchedMembers.find(el => el.id === item.id));
    setSearchedMembers(newSearchedManagers);
  }, [potentialMembers])

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
          <SearchAndFilter
            handleSearch={handleSearch}
            handleFilter={handleFilter}
            onCancelFilter={onCancelFilter}
            dataToFilter={potentialMembers}
            filterTypes={filterTypes}
            applyFilter={applyFilter}
          />

          <MemberFirmModalTable
            array={(searchedMembers?.length > 0 || isFiltered) ? searchedMembers : potentialMembers}
            setArray={setSearchedMembers}
            editUser={(user, newIsEdit) => {
              setIsChangeRoleModalOpen(true);
              setCurrUser(user)
              setIsEdit(newIsEdit)
            }}
            isTitle
            isAddUser
            notFindMessage={isFiltered ? 'No user was found for your query' : 'There are no potential users to add'}
          />
          <div style={{fontWeight: 'bold'}}>Existing</div>
          <MemberFirmModalTable
            array={members}
            deleteUser={(user) => setUserToDelete(user)}
            editUser={(user, newIsEdit) => {
              setIsChangeRoleModalOpen(true);
              setCurrUser(user)
              setIsEdit(newIsEdit)
            }}
            notFindMessage={'There are no users in member firm'}
          />
          <MemberFirmsChangeRoleModal
            isOpen={isChangeRoleModalOpen}
            setIsOpen={setIsChangeRoleModalOpen}
            user={currUser}
            memberFirm={memberFirm}
            allMembers={allMembers}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            principals={principals}
          />

          <Modal className={"organization-remove-modal"} isOpen={userToDelete.hasOwnProperty('id')} fade={false} toggle={()=>{setUserToDelete({})}}>
            <ModalBody>
              <div>
                <span style={{fontSize: "22px"}}>
                Are you sure you want to remove {userToDelete.first_name + ' ' + userToDelete.last_name} from {memberFirm?.main_fields?.name}?
              </span>
              </div>
              <div className={"organization-remove-modal_action-buttons"}>
                <Button className={"remove-button"} onClick={() => {
                  removeUser(userToDelete)
                  setUserToDelete({})
                }}>
                  Remove
                </Button>
                <Button className={"cancel-button"} onClick={() => {
                  setUserToDelete({});
                }}>
                  Cancel
                </Button>
              </div>
            </ModalBody>
          </Modal>

        </ModalBody>
      </Modal>
  )
};

export default MemberFirmEditUsers;
