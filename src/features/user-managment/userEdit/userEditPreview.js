import React, {useState, useRef, useEffect} from 'react'
import {
  Card,
  CardTitle,
  CardBody,
  NavItem,
  CardImg,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap"
import {X} from "react-feather";

import { useDispatch, useSelector } from "react-redux";
import {
  selectGroups,
  selectUserDForms,
  selectUserWorkfows,
  selectUserReviewers,
  selectManagers
} from "app/selectors";
import {
  getUserOnboardingRequest,
  getOrganizationsRequest,
  getUserOrganizationsRequest,
  addUserOrganizationRequest,
  removeUserOrganizationRequest,
  allowUserAbilityRequest,
  disallowUserAbilityRequest,
} from "app/slices/appSlice";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";

import {
  selectOrganizations,
  selectParentOrganizations,
  selectChildOrganizations,
} from 'app/selectors/groupSelector'

import {setPreview, setManager} from 'app/slices/appSlice'
import {selectPreview} from '../../../app/selectors/layoutSelector'
import noneAvatar from '../../../assets/img/portrait/none-avatar.png'
import {getGroupName} from '../../../utility/select/prepareSelectData'
import {groupTypes} from '../../../constants/group'

import './userEditPreview.scss'
import {
  selectUserOrganizations,
  selectUserParentOrganizations,
  selectUserChildOrganizations,
} from 'app/selectors/userSelectors'

import VPlogo from 'assets/img/logo/VPlogo.png'
import RimbalLogo from 'assets/img/logo/Rimbal-Logo.png'
import PreferenceLogo from 'assets/img/logo/preferenceLogo.png'

const UserEditPreview = (props, context) => {
  const [activeTab, setActiveTab] = useState("permissions")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] = useState(false)
  const [deletionData, setDeletionData] = useState({name: "", orgName: ""})


  const preview = useSelector(selectPreview);
  const groups = useSelector(selectGroups)
  const dispatch = useDispatch();
  const managers = useSelector(selectManagers)
  const dForms = useSelector(selectUserDForms)
  const workflows = useSelector(selectUserWorkfows)
  const reviewers = useSelector(selectUserReviewers)
  const organizations = useSelector(selectOrganizations)
  const userOrganizations = useSelector(selectUserOrganizations)
  const manager = managers.filter(({ id }) => id === preview.id)[0]
  const isUserHasModules = manager && manager.modules && manager.modules.length > 0;

  const parentOrganizations = useSelector(selectParentOrganizations);
  const childOrganizations = useSelector(selectChildOrganizations);
  const userParentOrganizations = useSelector(selectUserParentOrganizations);
  const userChildOrganizations = useSelector(selectUserChildOrganizations);

  const test = (organizations, userOrganizations) => organizations.filter((org) => !userOrganizations.filter((userOrg) => userOrg.name === org.name).length);

  const addableParentOrganizations = test(parentOrganizations, userParentOrganizations)
  const addableChildOrganizations = test(childOrganizations, userChildOrganizations)

  const logos = {
    "ValidPath" : VPlogo,
    "Rimbal" : RimbalLogo,
    "Preference": PreferenceLogo,
  }

  const initOnboarding = {
    d_form: null,
    is_internal: false,
    reviewers: [],
    user_id: manager.id,
    workflow: null,
  }

  useEffect(()=>{
    if(!dForms.length && !reviewers.length && !workflows.length){
    }
    // todo what is that
    dispatch(getUserOnboardingRequest({userId: manager.id}))
    if(organizations.length === 0) {
      dispatch(getOrganizationsRequest())
    }
  }, [])

  useEffect(() => {
    dispatch(getUserOrganizationsRequest(manager.id))
  }, [manager.id])

  const removeCard = () => {
    dispatch(setPreview(null))
  }

  const onOrganizationAdd = (org) => {

    dispatch(addUserOrganizationRequest({id: manager.id, orgId: org.id, type: org.type}))
    setIsAddOrganizationModalOpen(false)
  }

  const handleOrganizationDelete = () => {
    const org = userOrganizations.filter((org) => org.name === deletionData.orgName)[0];
    console.log(org)
    dispatch(removeUserOrganizationRequest({userId: manager.id, group_id: org.id, type: org.type}))
    setIsDeleteModalOpen(false);
  }

  const onOrganizationDelete = (orgName, managerName) => {
    setDeletionData({
      orgName, name: managerName
    })
    setIsDeleteModalOpen(true)
  }

  const toggleAbility = (userOrg, ability, isChecked) => {
    console.log("sdf")
    const data = {
      ability,
      organization_type:
      userOrg.type,
      organization_id: userOrg.id,
      user_id: manager.id
    }

    if (isChecked) {
      dispatch(disallowUserAbilityRequest(data))
    } else {
      dispatch(allowUserAbilityRequest(data))
    }

  }

  const modalContainer = useRef();

  const selectItems = ["permissions", "activity", "applications", "masterSchema"]

  return (
    <div className="user-managment user-edit-preview" ref={modalContainer}>
      <Card className="tablet-hidden">
        <CardImg variant="top" src={noneAvatar} />
        <CardBody className="user-edit-preview_body">
          <CardTitle className="title">
            {`${manager.first_name} ${manager.last_name}`}
          </CardTitle>
          <CardText className="mb-0 email">
            <span style={{paddingRight: "6px"}}>E:</span> {manager.email ? `${manager.email}` : "email is empty"}
          </CardText>
          <CardText className="mb-3">
            M: {manager.number ? `${manager.number}` : "phone number is empty"}
          </CardText>
          <CardText>
            {/*{manager.roles && !!manager.roles.length && (manager.roles.map((role) => role + " ").join("")) + " at "}*/}
            {/*{(manager.groups && manager.groups.length > 0 && manager.groups.map((group) => <span className="organization-name">{getGroupName(groups, group.group_id, groupTypes[group.group_type])}</span> ))}*/}
            {manager?.permissions?.ability.replace("_", " ") + " at " + manager?.permissions?.organization}
          </CardText>
        </CardBody>
      </Card>
      <Card
        key={manager.email}
        className="flex-row home__card cursor-pointer tablet-visible preview-card"
      >
        <CardImg variant="top" src={noneAvatar} className="user-card-img d-sm-flex d-none" />
        <CardBody className="user-card-body">
          <div className="user-card-body-left">
            <div>
              <CardTitle className="m-0 user-card-body_title">{`${manager.first_name} ${manager.last_name}`}</CardTitle>
              <CardText style={{marginBottom: "5px"}}>
                {/*{manager.roles && manager.roles.length && manager.roles.map((role) => role + " ") || "No roles"}*/}
                {manager.permissions.ability.replace("_", " ")}
              </CardText>
            </div>
            <div>
              <CardText>
                <span style={{paddingRight: "6px"}}>E:</span> {manager.email ? `${manager.email}` : "email is empty"}
              </CardText>
              <CardText>
                M: {manager.number ? `${manager.number}` : "phone number is empty"}
              </CardText>
            </div>
          </div>
          <div className="user-card-body-right">
            <CardText>
              {/*{(manager.groups && manager.groups.length > 0 && manager.groups.map((group) => <span className="organization-name">{getGroupName(groups, group.group_id, groupTypes[group.group_type])}</span> ))}*/}
              {manager.permissions.organization}
            </CardText>
            <UncontrolledDropdown>
              <DropdownToggle nav caret={true} style={{fontSize: "18px"}}>
                {activeTab}
              </DropdownToggle>
              <DropdownMenu right>
                {selectItems.map((item) => (
                  <DropdownItem
                    onClick={() => {setActiveTab(item)}}
                    disabled={item !== "permissions"}
                  >
                    <NavItem style={{fontSize: "16px"}}>
                      {item}
                    </NavItem>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardBody>
      </Card>
      <div>
        <Card className="tablet-hidden">
          <CardBody>
            <UncontrolledDropdown>
              <DropdownToggle style={{fontSize: "22px"}} nav caret={true}>
                {activeTab}
              </DropdownToggle>
              <DropdownMenu left>
                {selectItems.map((item) => (
                  <DropdownItem
                    onClick={() => {setActiveTab(item)}}
                    disabled={item !== "permissions"}
                  >
                    <NavItem style={{fontSize: "18px"}}>
                      {item}
                    </NavItem>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </CardBody>
        </Card>
        <div className="permissions-title">
          <div style={{fontSize: "20px", marginTop: "25px", marginBottom: "20px"}} className={"text-center"}>
            Organizations
          </div>
          <div style={{fontSize: "20px", marginTop: "25px", marginBottom: "20px"}} className={"text-center"}>
            Roles
          </div>
        </div>
        <div className="permissions">

          {!!userOrganizations.length && userOrganizations.map((userOrganization) => {
            return (
              <>
                <Card style={{ minHeight: "100px"}}>
                  <CardBody className="organization-name" onClick={() => {onOrganizationDelete(userOrganization.name, manager.first_name + " " +manager.last_name)}}>
                    {(logos[userOrganization.name] && <img src={logos[userOrganization.name]} alt=""/>) || userOrganization.name}
                  </CardBody>
                </Card>
                <Card style={{ minHeight: "100px"}}>
                  <CardBody className={`abilities ${userOrganization.name === "Rimbal" ? "hot-fix" : ""}`}>
                    {Object.keys(userOrganization.abilities).map((ability) => {
                      return (
                        <>
                          <Checkbox
                            onClick={()=>{toggleAbility(userOrganization, ability, userOrganization.abilities[ability])}}
                            checked={userOrganization.abilities[ability]}
                            color="white"
                            className={userOrganization.abilities[ability] ? "checked" : ""}
                            icon={<X color={"#007BFF"}  size={16}/>}
                            label={ability}
                          />
                        </>
                      )
                    })}
                  </CardBody>
                </Card>
              </>
            )
          })}
          {!!(addableChildOrganizations.length || addableParentOrganizations.length) && (
            <Card>
              <CardBody className="add-organization" onClick={() => {setIsAddOrganizationModalOpen(true)}}>
                <span>+</span>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <Modal className={"organization-remove-modal"} isOpen={isDeleteModalOpen} fade={false} toggle={()=>{setIsDeleteModalOpen(false)}}>
        <ModalBody>
          <div>
            <span style={{fontSize: "22px"}}>
            Are you sure you want to remove {deletionData.name} from {deletionData.orgName} organization ?
          </span>
          </div>
          <div className={"organization-remove-modal_action-buttons"}>
            <Button className={"remove-button"} onClick={() => {handleOrganizationDelete()}}>
              Remove
            </Button>
            <Button className={"cancel-button"} onClick={() => {setIsDeleteModalOpen(false)}}>
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal className="organization-add-modal" isOpen={isAddOrganizationModalOpen} fade={false} toggle={()=>{setIsAddOrganizationModalOpen(false)}}>
        <ModalBody>
          <h1 className="organization-add-modal_title">Organization select</h1>
          <div className="organization-add-modal_all-addable-list">
            {!!addableParentOrganizations.length && (
              <div className="organizations-list parent-organizations">
                <h6 className="organizations-list_title">
                  Parent organizations
                </h6>
                <div className="organizations-list_list">
                  {addableParentOrganizations.map((org) => (
                    <Card className="organizations-list_organization">
                      <CardBody className="organizations-list_organization-body" onClick={() => {onOrganizationAdd(org)}}>
                        <img src={logos[org.name]} alt=""/>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {!!addableChildOrganizations.length && (
              <div className="organizations-list child-organizations">
                <h6 className="organizations-list_title">
                  Child organizations
                </h6>
                <div className="organizations-list_list">
                  {addableChildOrganizations.map((org) => (
                    <Card className="organizations-list_organization">
                      <CardBody className="organizations-list_organization-body" onClick={() => {onOrganizationAdd(org)}}>
                        <img src={logos[org.name]} alt=""/>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default UserEditPreview
