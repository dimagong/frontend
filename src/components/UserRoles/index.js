import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux'

import {Button, Card, CardBody, Modal, ModalBody} from 'reactstrap'
import {X} from 'react-feather'
import Checkbox from '../@vuexy/checkbox/CheckboxesVuexy'

import VPlogo from 'assets/img/logo/VPlogo.png'
import RimbalLogo from 'assets/img/logo/Rimbal-Logo.png'
import PreferenceLogo from 'assets/img/logo/preferenceLogo.png'

import {
  addUserOrganizationRequest, allowUserAbilityRequest,
  disallowUserAbilityRequest, getOrganizationsRequest, getUserOnboardingRequest, getUserOrganizationsRequest,
  removeUserOrganizationRequest
} from 'app/slices/appSlice'

import {
  selectChildOrganizations, selectOrganizations,
  selectParentOrganizations
} from 'app/selectors/groupSelector'
import {
  selectUserChildOrganizations,
  selectUserParentOrganizations
} from 'app/selectors/userSelectors'

import { Scrollbars } from 'react-custom-scrollbars';

import {capitalizeAll} from '../../utility/common'

import './styles.scss'

const logos = {
  "ValidPath" : VPlogo,
  "Rimbal" : RimbalLogo,
  "Preference": PreferenceLogo,
}

const UserRoles = ({manager, userOrganizations, className}) => {
  const dispatch = useDispatch()
  console.log("DDD", userOrganizations)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] = useState(false)
  const [deletionData, setDeletionData] = useState({name: "", orgName: ""})

  // organizations needs just to check and request organizations if none. Refactor in future
  const organizations = useSelector(selectOrganizations)
  const parentOrganizations = useSelector(selectParentOrganizations);
  const childOrganizations = useSelector(selectChildOrganizations);
  const userParentOrganizations = useSelector(selectUserParentOrganizations(manager.id));
  const userChildOrganizations = useSelector(selectUserChildOrganizations(manager.id));

  const getUniq = (organizations, userOrganizations) => organizations.filter((org) => !userOrganizations.filter((userOrg) => userOrg.name === org.name).length);

  // organization that are allowed to add to user
  const addableParentOrganizations = getUniq(parentOrganizations, userParentOrganizations)
  let addableChildOrganizations;

  // Do not allow add more than one child organization if no parent organization added
  if (!userParentOrganizations.length && userChildOrganizations.length >= 1) {
    addableChildOrganizations = [];
  } else {
    addableChildOrganizations = getUniq(childOrganizations, userChildOrganizations);
  }

  const onOrganizationAdd = (org) => {

    dispatch(addUserOrganizationRequest({id: manager.id, orgId: org.id, type: org.type}))
    setIsAddOrganizationModalOpen(false)
  }

  const handleOrganizationDelete = () => {
    const org = userOrganizations.filter((org) => org.name === deletionData.orgName)[0];

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

  useEffect(()=>{
    if(organizations.length === 0) {
      dispatch(getOrganizationsRequest())
    }
  }, [])

  useEffect(() => {
    dispatch(getUserOrganizationsRequest(manager.id))
  }, [manager.id])

  return (
    <div className={`user-roles ${className ? className : ""}`}>
      <div className="permissions-title">
        <div>
          Organizations
        </div>
        <div>
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
                          label={capitalizeAll(ability.replace("_", " "))}
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
          <>
            <Card>
              <CardBody className="add-organization" onClick={() => {setIsAddOrganizationModalOpen(true)}}>
                <span>+</span>
              </CardBody>
            </Card>

            {!userParentOrganizations.length && !userChildOrganizations.length && (
              <div className="empty-organizations">
                Please select which Organisation this user belongs to
              </div>
            )}
          </>

        )}
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
          <Scrollbars autoHeight autoHeightMax={500}>
            <div className="organization-add-modal_all-addable-list">
              {!!addableParentOrganizations.length && (
                <div className={`organizations-list parent-organizations ${addableChildOrganizations.length ? "with-bottom-border" : ''}`}>
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
                          {logos[org.name] ? <img src={logos[org.name]} alt=""/> : org.name}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Scrollbars>

        </ModalBody>
      </Modal>
    </div>
  )
}

export default UserRoles;
