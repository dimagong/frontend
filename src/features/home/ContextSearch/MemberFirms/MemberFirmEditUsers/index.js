import React, {useEffect, useRef, useState} from 'react';
import {Button, Modal, ModalBody} from "reactstrap";
import MemberFirmModalTable from "./MemberFirmModalTable";
import AutoComplete from "../../../../../components/@vuexy/autoComplete/AutoCompleteComponent";
import FilterIcon from "../../../../../assets/img/svg/filter.svg";
import {X} from "react-feather";
import FilterModal from "../../ContextSearchNav/Filters/FilterModal";
import {useDispatch, useSelector} from "react-redux";
import {selectOrganizations} from "../../../../../app/selectors/groupSelector";
import MemberFirmsChangeRoleModal from "./MemberFirmsChangeRoleModal";
import CloseIcon from "@material-ui/icons/Close";
import appSlice from "../../../../../app/slices/appSlice";
import {getSelectedMemberFirmPotentialUsers} from "../../../../../app/selectors/memberFirmsSelector";
import memberFirmsApi from "../../../../../api/memberFirms";

const {
  addMemberFirmUsersRequest,
  removeMemberFirmUsersRequest,
} = appSlice.actions;


const MemberFirmEditUsers = ({isModalOpen, setIsModalOpen, members, potentialMembers, memberFirm, allMembers, principals}) => {
  const dispatch = useDispatch()
  const [searchedMembers, setSearchedMembers] = useState([])
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [currUser, setCurrUser] = useState({});
  const [filter, setFilter] = useState({roles: new Set(), organizations: new Set(), type: {roles: 'initial', organizations: 'initial'}});
  const wrapperRefFilterButton = useRef(null);
  const [curr, setCurr] = useState('roles');
  const [footerText, setFooterText] = useState({roles: '', organizations: ''});
  const [filterName, setFilterName] = useState('');

  const addUser = (user) => {
    dispatch(addMemberFirmUsersRequest({
      memberFirmId: memberFirm.id,
      users: [{
        id: user.id,
        type: 'member'
      }]
    }))
  }

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
          <div style={{width: 693, marginBottom: 20, marginTop: 10}}>
            <AutoComplete
              placeholder="Search"
              suggestions={[]}
              className="form-control"
              filterKey="name"
              onChange={handleSearch}
              suggestionLimit={4}
              defaultSuggestions={false}
              customRender={() => {}}
              showClear={true}
              hideSuggestions
            />
          </div>
          <img ref={wrapperRefFilterButton}
               className={'filter-icon member-firm-filter-icon'}
               src={FilterIcon} alt={'filter-icon'}
               onClick={() => {setIsFilterBoxOpen(!isFilterBoxOpen)}}
          />
          {isFilterBoxOpen && <FilterModal
            // Temporary using constant managersOut
            managers={potentialMembers}
            handleFilter={(newManagers) => {
              setSearchedMembers(newManagers)
              if (filter.roles.size > 0) {
                setIsFiltered(true);
              } else {
                setIsFiltered(false);
              }
            }}
            wrapperRefFilterButton={wrapperRefFilterButton}
            style={{left: 220, top: 50, marginBottom: 0}}
            filterTypes={['roles']}
            filter={filter}
            setFilter={setFilter}
            setIsFilterBoxOpen={setIsFilterBoxOpen}
            curr={curr}
            setCurr={setCurr}
            footerText={footerText}
            setFooterText={setFooterText}
            filterName={filterName}
            setFilterName={setFilterName}
          />}

          <div style={{textAlign: 'right', paddingRight: 10, height: 30}}>
            {filter.roles.size > 0 && <Button className={'filter-tab member-firm-filter-tab'} variant={'dark'}>
              <span className={'nav-text'}>{footerText.roles.length <= 40 ? footerText.roles : `${filter.roles.size} roles`}</span>
              <span onClick={() => {
                setFilter({roles: new Set(), organizations: new Set(), type: {roles: 'initial', organizations: 'initial'}})
                setSearchedMembers([]);
                setIsFiltered(false)
              }}
                    className={'close-nav'}><CloseIcon/></span>
            </Button>}
          </div>

          <MemberFirmModalTable
            array={(searchedMembers?.length > 0 || isFiltered) ? searchedMembers : potentialMembers}
            setArray={setSearchedMembers}
            changeUser={addUser}
            editUser={(user, newIsEdit) => {
              setIsChangeRoleModalOpen(true);
              setCurrUser(user)
              setIsEdit(newIsEdit)
            }}
            isTitle
            isAddUser
            notFindMessage={isEdit ? 'There are no potential users to add' : 'No user was found for your query'}
          />
          <div style={{fontWeight: 'bold'}}>Existing</div>
          <MemberFirmModalTable
            array={members}
            changeUser={(user) => setUserToDelete(user)}
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
