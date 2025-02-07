import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Card, CardBody, Modal, ModalBody } from "reactstrap";
import { X } from "react-feather";
import Checkbox from "../@vuexy/checkbox/CheckboxesVuexy";

import { selectChildOrganizations, selectOrganizations, selectParentOrganizations } from "app/selectors/groupSelector";
import { selectUserChildOrganizations, selectUserParentOrganizations } from "app/selectors/userSelectors";

import { Scrollbars } from "react-custom-scrollbars";

import { capitalizeAll } from "../../utility/common";

import "./styles.scss";

import appSlice from "app/slices/appSlice";
import { toast } from "react-toastify";
import { createLoadingSelector } from "../../app/selectors/loadingSelector";

const {
  addUserOrganizationRequest,
  allowUserAbilityRequest,
  disallowUserAbilityRequest,
  switchUserAbilityInOrganizationRequest,
  getOrganizationsRequest,
  getUserOrganizationsRequest,
  removeUserOrganizationRequest,
  switchUserOrganizationRequest,
} = appSlice.actions;

const UserRoles = ({ manager, userOrganizations, className }) => {
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingOrganization, setIsDeletingOrganization] = useState(false);
  const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] = useState(false);
  const [deletionData, setDeletionData] = useState({ name: "", orgName: "" });

  // organizations needs just to check and request organizations if none. Refactor in future
  const organizations = useSelector(selectOrganizations);
  const parentOrganizations = useSelector(selectParentOrganizations);
  const childOrganizations = useSelector(selectChildOrganizations);
  const userParentOrganizations = useSelector(selectUserParentOrganizations(manager.id));
  const userChildOrganizations = useSelector(selectUserChildOrganizations(manager.id));

  const isLoading = useSelector(
    createLoadingSelector(
      [disallowUserAbilityRequest.type, allowUserAbilityRequest.type, switchUserAbilityInOrganizationRequest.type],
      true
    )
  );

  // WILL BE REFACTORED AFTER STORE REFACTOR AND API REFACTORE
  // correct user organizations are orgs that links to state.app.organizations object,
  // here we just select same orgs but with fresh data.
  // After that we get back abilities object that exist only in user orgs but not in state.app.organizations
  // eslint-disable-next-line no-self-compare
  let correctUserOrganizations = organizations.filter(
    (org) => !!userOrganizations.filter((userOrg) => userOrg.id === org.id && userOrg.type === userOrg.type).length
  );
  // eslint-disable-next-line array-callback-return
  correctUserOrganizations = correctUserOrganizations.map((userOrg) => {
    const sameOrg = userOrganizations.filter((org) => userOrg.id === org.id && userOrg.type === org.type)[0];

    if (sameOrg !== undefined) return { ...userOrg, abilities: sameOrg.abilities };
  });

  correctUserOrganizations = correctUserOrganizations.filter((org) => org !== undefined);

  const getUniq = (organizations, userOrganizations) =>
    organizations.filter((org) => !userOrganizations.filter((userOrg) => userOrg.name === org.name).length);

  // organization that are allowed to add to user
  const addableParentOrganizations = getUniq(parentOrganizations, userParentOrganizations);

  let addableChildOrganizations;

  // Do not allow add more than one child organization if no parent organization added
  if (!userParentOrganizations.length && userChildOrganizations.length >= 1) {
    addableChildOrganizations = [];
  } else {
    addableChildOrganizations = getUniq(childOrganizations, userChildOrganizations);
  }

  const handleOrganizationClick = (org) => {
    if (isDeletingOrganization) {
      const delOrg = correctUserOrganizations.filter((currOrg) => currOrg.name === deletionData.orgName)[0];
      dispatch(
        switchUserOrganizationRequest({
          delOrg: {
            userId: manager.id,
            group_id: delOrg.id,
            type: delOrg.type,
          },
          addOrg: {
            id: manager.id,
            orgId: org.id,
            type: org.type,
          },
        })
      );
    } else {
      dispatch(
        addUserOrganizationRequest({
          id: manager.id,
          orgId: org.id,
          type: org.type,
        })
      );
      setIsAddOrganizationModalOpen(false);
    }
    setIsDeletingOrganization(false);
    setIsAddOrganizationModalOpen(false);
  };

  const handleOrganizationDelete = () => {
    const org = correctUserOrganizations.filter((org) => org.name === deletionData.orgName)[0];

    dispatch(
      removeUserOrganizationRequest({
        userId: manager.id,
        group_id: org.id,
        type: org.type,
      })
    );
    setIsDeleteModalOpen(false);
    setIsAddOrganizationModalOpen(false);
    setIsDeletingOrganization(false);
  };

  const onOrganizationDelete = (orgName, managerName) => {
    setDeletionData({
      orgName,
      name: managerName,
    });
    setIsAddOrganizationModalOpen(true);
    setIsDeletingOrganization(true);
  };

  const toggleAbility = (userOrg, ability) => {
    // Keep in mind that a user is able to have multiple abilities in different organization at one time.
    if (isLoading) return;

    // If there is possibility to change user ability in that organization.

    const abilityInOrg = Object.entries(userOrg.abilities).find(([, value]) => value === true);
    const noAbilityInOrg = abilityInOrg == null;

    // In case if the user have no ability yet - try to allow one.
    if (noAbilityInOrg) {
      dispatch(
        allowUserAbilityRequest({
          ability,
          organization_type: userOrg.type,
          organization_id: userOrg.id,
          user_id: manager.id,
        })
      );

      return;
    }

    const [abilityName] = abilityInOrg;

    if (abilityName === ability) {
      // In case if the user tries to disallow an ability.
      // Check, have user any abilities, and prevent case when user manually disallowing last ability.
      const haveAnyOtherAbilities = correctUserOrganizations
        .filter(({ id, type }) => (type === userOrg.type ? id !== userOrg.id : true))
        .some(({ abilities }) => Object.values(abilities).some(Boolean));

      if (haveAnyOtherAbilities) {
        dispatch(
          disallowUserAbilityRequest({
            ability,
            organization_type: userOrg.type,
            organization_id: userOrg.id,
            user_id: manager.id,
          })
        );
        return;
      }

      toast.error(`The User should have at least one ability.`);
      return;
    }

    if (abilityName !== ability) {
      // In case if the user tries to change his ability in one organization.
      // First disallow the current ability, and then allow the desired ability.
      const toDisallow = {
        ability: abilityName,
        organization_type: userOrg.type,
        organization_id: userOrg.id,
        user_id: manager.id,
      };
      const toAllow = {
        ability,
        organization_type: userOrg.type,
        organization_id: userOrg.id,
        user_id: manager.id,
      };

      dispatch(switchUserAbilityInOrganizationRequest({ toDisallow, toAllow }));
    }
  };

  const ModalOrganization = () => {
    let currChildOrganizations = isDeletingOrganization
      ? getUniq(childOrganizations, userChildOrganizations)
      : addableChildOrganizations;

    return (
      <Modal
        className="organization-add-modal"
        isOpen={isAddOrganizationModalOpen}
        fade={false}
        toggle={() => {
          setIsAddOrganizationModalOpen(false);
          setIsDeletingOrganization(false);
        }}
      >
        <ModalBody>
          <h1 className="organization-add-modal_title">
            {isDeletingOrganization ? "Change organization" : "Organisation select"}
          </h1>
          <Scrollbars autoHeight autoHeightMax={500}>
            <div className="organization-add-modal_all-addable-list">
              {!!addableParentOrganizations.length && (
                <div
                  className={`organizations-list parent-organizations ${
                    addableChildOrganizations.length ? "with-bottom-border" : ""
                  }`}
                >
                  <h6 className="organizations-list_title">Parent organisations</h6>
                  <div className="organizations-list_list">
                    {addableParentOrganizations.map((org) => (
                      <Card className="organizations-list_organization" key={org.id + org.type}>
                        <CardBody
                          className="organizations-list_organization-body"
                          onClick={() => {
                            handleOrganizationClick(org);
                          }}
                        >
                          {org.logo?.base64 ? (
                            <img className={"organization-img"} src={org.logo.base64} alt="" />
                          ) : (
                            org.name
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {!!currChildOrganizations.length && (
                <div className="organizations-list child-organizations">
                  <h6 className="organizations-list_title">Child organisations</h6>
                  <div className="organizations-list_list">
                    {currChildOrganizations.map((org) => (
                      <Card className="organizations-list_organization" key={org.id + org.type}>
                        <CardBody
                          className="organizations-list_organization-body"
                          onClick={() => {
                            handleOrganizationClick(org);
                          }}
                        >
                          {org.logo?.base64 ? (
                            <img className={"organization-img"} src={org.logo.base64} alt="" />
                          ) : (
                            org.name
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Scrollbars>

          {correctUserOrganizations && correctUserOrganizations.length > 1 && isDeletingOrganization && (
            <Button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setIsAddOrganizationModalOpen(false);
              }}
              className={"remove-button remove-org-btn"}
            >
              Remove organization
            </Button>
          )}
        </ModalBody>
      </Modal>
    );
  };

  useEffect(() => {
    if (organizations.length === 0) {
      dispatch(getOrganizationsRequest());
    }
  }, [dispatch, organizations.length]);

  useEffect(() => {
    dispatch(getUserOrganizationsRequest(manager.id));
  }, [dispatch, manager.id]);

  return (
    <div className={`user-roles ${className ? className : ""}`}>
      <div className="permissions-title">
        <div>Organisations</div>
        <div>Roles</div>
      </div>
      <div className="permissions">
        {!!correctUserOrganizations.length &&
          correctUserOrganizations.map((userOrganization) => {
            return (
              <React.Fragment key={userOrganization.id + userOrganization.type}>
                <Card style={{ minHeight: "100px" }}>
                  <CardBody
                    className="organization-name"
                    onClick={() => {
                      onOrganizationDelete(userOrganization.name, manager.first_name + " " + manager.last_name);
                    }}
                  >
                    {userOrganization.logo?.base64 ? (
                      <img className={"organization-img"} src={userOrganization.logo.base64} alt="" />
                    ) : (
                      userOrganization.name
                    )}
                  </CardBody>
                </Card>
                <Card style={{ minHeight: "100px" }}>
                  <CardBody className={`abilities ${userOrganization.name === "Rimbal" ? "hot-fix" : ""}`}>
                    {Object.keys(userOrganization.abilities).map((ability) => {
                      return (
                        <Checkbox
                          onChange={(event) => toggleAbility(userOrganization, ability, event.target.checked)}
                          checked={userOrganization.abilities[ability]}
                          color="white"
                          className={userOrganization.abilities[ability] ? "checked" : ""}
                          icon={<X color={"#007BFF"} size={16} />}
                          label={capitalizeAll(ability.replace("_", " "))}
                          disabled={isLoading}
                          key={ability}
                        />
                      );
                    })}
                  </CardBody>
                </Card>
              </React.Fragment>
            );
          })}
        {!!(addableChildOrganizations.length || addableParentOrganizations.length) &&
          !(
            correctUserOrganizations &&
            correctUserOrganizations.length === 1 &&
            correctUserOrganizations[0].type !== "corporation"
          ) && (
            <>
              <Card>
                <CardBody
                  className="add-organization"
                  onClick={() => {
                    setIsAddOrganizationModalOpen(true);
                  }}
                >
                  <span>+</span>
                </CardBody>
              </Card>

              {!userParentOrganizations.length && !userChildOrganizations.length && (
                <div className="empty-organizations">Please select which Organisation this user belongs to</div>
              )}
            </>
          )}
      </div>
      <Modal
        className={"organization-remove-modal"}
        isOpen={isDeleteModalOpen}
        fade={false}
        toggle={() => {
          setIsDeleteModalOpen(false);
        }}
      >
        <ModalBody>
          <div>
            <span style={{ fontSize: "22px" }}>
              Are you sure you want to remove {deletionData.name} from {deletionData.orgName} organisation ?
            </span>
          </div>
          <div className={"organization-remove-modal_action-buttons"}>
            <Button
              className={"remove-button"}
              onClick={() => {
                handleOrganizationDelete();
              }}
            >
              Remove
            </Button>
            <Button
              className={"cancel-button"}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setIsAddOrganizationModalOpen(true);
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <ModalOrganization />
    </div>
  );
};

export default UserRoles;
