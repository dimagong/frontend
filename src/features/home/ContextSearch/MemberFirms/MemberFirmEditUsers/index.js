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


const MemberFirmEditUsers = ({isModalOpen, setIsModalOpen, members, potentialMembers, memberFirm}) => {
  const dispatch = useDispatch()
  const [searchedMembers, setSearchedMembers] = useState([])
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [filter, setFilter] = useState({roles: new Set(), organizations: new Set(), type: {roles: 'initial', organizations: 'initial'}});
  const wrapperRefFilterButton = useRef(null);
  const [curr, setCurr] = useState('roles');
  const [footerText, setFooterText] = useState({roles: '', organizations: ''});
  const [filterName, setFilterName] = useState('');

  const addUser = (user) => {
    console.log('user', user)
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

  const handleSearch = (inputText) => {
    setSearchedMembers(potentialMembers.filter(item =>
      (item.first_name + item.last_name).toLowerCase().search(inputText.toLowerCase()) !== -1))
  }

  console.log('potentialMembers', potentialMembers)
  console.log('searchedMembers', searchedMembers)
  console.log('memberFirm', memberFirm)
  console.log({isModalOpen, setIsModalOpen, members, potentialMembers, memberFirm})

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
              onEnter={handleSearch}
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
            handleFilter={(newManagers) => {setSearchedMembers(newManagers)}}
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
              }}
                    className={'close-nav'}><CloseIcon/></span>
            </Button>}
          </div>

          <MemberFirmModalTable
            array={searchedMembers?.length > 0 ? searchedMembers : potentialMembers}
            setArray={setSearchedMembers}
            changeUser={addUser}
            isTitle
            isAddUser
          />
          <div style={{fontWeight: 'bold'}}>Existing</div>
          <MemberFirmModalTable
            array={members}
            changeUser={removeUser}
            editUser={() => {setIsChangeRoleModalOpen(true)}}
          />
          <MemberFirmsChangeRoleModal
            isOpen={isChangeRoleModalOpen}
            setIsOpen={setIsChangeRoleModalOpen}
          />
        </ModalBody>
      </Modal>
  )
};

export default MemberFirmEditUsers;
