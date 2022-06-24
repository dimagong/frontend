import _ from "lodash/fp";
import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label,
  FormFeedback,
  CardTitle,
  CardHeader,
  CardBody,
  Card,
} from "reactstrap";

import { X, Check } from "react-feather";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectError } from "app/selectors";

import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import UserInvitationsCreate from "../userInvitations/UserInvitationsCreate";

import UserAccessManager from "./components/UserAccessManager";
import { useUserAccessManager } from "./components/UserAccessManager/useUserAccessManager";
import NmpSelect from "../../../components/nmp/NmpSelect";
import { useGenericQuery } from "../../../api/useGenericQuery";
import { createQueryKey } from "../../../api/createQueryKey";
import NmpButton from "../../../components/nmp/NmpButton";
import { useGenericMutation } from "../../../api/useGenericMutation";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

const { updateUserRequest } = appSlice.actions;

const mapUserNotifyEntitiesToOptions = (entities) => {
  return entities.map((entity) => ({ label: entity.intro_title, value: entity }));
};

const findUserNotifyEntity = (manager) => {
  if (!manager) {
    return null;
  }

  if (manager.notify_entries.length === 0) {
    return null;
  }

  const notifyEntity = manager.notify_entries[0];

  return notifyEntity.notify;
};

export const UserQueryKey = createQueryKey("User key");

export const UserQueryKeys = {
  all: () => [UserQueryKey],
  byId: (userId) => [...UserQueryKeys.all(), { userId }],
};

export const UserNotifyEntitiesQueryKey = createQueryKey("UserNotifyEntities key");

export const UserNotifyEntitiesQueryKeys = {
  all: (userId) => [UserNotifyEntitiesQueryKey, { userId }],
};

export const useUserQuery = ({ userId }, options) => {
  return useGenericQuery(
    {
      url: `api/user/${userId}`,
      queryKey: UserQueryKeys.byId(userId),
    },
    options
  );
};

export const useUserNotifyEntitiesQuery = ({ userId }, options) => {
  return useGenericQuery(
    {
      queryKey: UserNotifyEntitiesQueryKeys.all(userId),
      url: `/api/user/${userId}/notify-entries/notify-entities`,
    },
    options
  );
};

export const useAddUserNotifyEntityMutation = ({ userId }, options) => {
  return useGenericMutation(
    {
      method: "post",
      url: `/api/user/${userId}/notify-entries`,
      // ToDo: do not forget to refactor it while user can not be updated in a good way
      // queryKey: UserNotifyEntitiesQueryKeys.all(userId),
    },
    options
  );
};

export const useDeleteUserNotifyEntityMutation = ({ userId }, options) => {
  return useGenericMutation(
    {
      method: "delete",
      url: `/api/user/${userId}/notify-entries`,
      // ToDo: do not forget to refactor it while user can not be updated in a good way
      // queryKey: UserNotifyEntitiesQueryKeys.all(userId),
    },
    options
  );
};

const UserProfileEdit = ({ manager, onEditClose }) => {
  const dispatch = useDispatch();
  const errors = useSelector(selectError) || {};
  const [managerState, setManagerState] = useState(manager);

  // User Bdm
  const [{ data: bdms, error }, { syncBdmUsers }] = useUserAccessManager(manager.id);
  const isBdmVisible = React.useMemo(() => !(!bdms || bdms.potential.length === 0), [bdms]);
  const [bdmsField, setBdmsField] = useFormField([], [Validators.identicalArrayBy([], "id")]);
  const formGroup = useFormGroup({ bdms: bdmsField });

  // User Notify Entities
  const queryClient = useQueryClient();

  const [showIntroPage, setShowIntroPage] = useState(false);

  const userQuery = useUserQuery(
    { userId: manager.id },
    {
      onSuccess: (user) => {
        setShowIntroPage(user.notify_entries.length > 0);
      },
    }
  );
  const userNotify = findUserNotifyEntity(userQuery.data);

  const [notifyEntityOption, setNotifyEntityOption] = useState(null);
  const [notifyEntitiesOptions, setNotifyEntitiesOptions] = useState([]);

  const userNotifyEntitiesQuery = useUserNotifyEntitiesQuery(
    { userId: manager.id },
    {
      staleTime: Infinity,
      enabled: showIntroPage && Boolean(userQuery.data),
      onSuccess: (entities) => {
        const options = mapUserNotifyEntitiesToOptions(entities);

        setNotifyEntitiesOptions(options);
        setNotifyEntityOption(options.find(({ value }) => value.id === userNotify.id));
      },
    }
  );

  const addUserNotifyEntity = useAddUserNotifyEntityMutation(
    { userId: manager.id },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(UserQueryKeys.byId(manager.id));
        await queryClient.invalidateQueries(UserNotifyEntitiesQueryKeys.all(manager.id));
        toast.success("User intro page assigned successfully.");
      },
    }
  );

  const deleteUserNotifyEntity = useDeleteUserNotifyEntityMutation(
    { userId: manager.id },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(UserQueryKeys.byId(manager.id));
        await queryClient.invalidateQueries(UserNotifyEntitiesQueryKeys.all(manager.id));
        toast.success("User intro page unassigned successfully.");
      },
    }
  );

  const onShowIntoPageChange = (value) => {
    if (deleteUserNotifyEntity.isLoading) {
      return;
    }

    // If show intro page is false then remove
    if (!value) {
      deleteUserNotifyEntity.mutate();
    }

    setShowIntroPage(value);
  };

  const onUserNotifyEntitiesSubmit = (event) => {
    event.preventDefault();

    if (!notifyEntityOption) {
      toast.error("Select intro page.");
      return;
    }

    addUserNotifyEntity.mutate({
      notify_id: notifyEntityOption.value.id,
      notify_type: notifyEntityOption.value.user_notify_type,
    });
  };

  // Old stuff

  const onSubmit = (e) => {
    e.preventDefault();

    if (isBdmVisible) {
      const bdmUsersIds = formGroup.values.bdms.map(_.get("id"));
      syncBdmUsers({ userId: manager.id, bdmUsersIds }).subscribe();
    }

    dispatch(updateUserRequest(managerState));
  };

  const handleCardClose = () => {
    onEditClose();
  };

  const handleFieldChange = (fieldName, fieldValue) => {
    setManagerState({
      ...managerState,
      [fieldName]: fieldValue,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setBdmsField(bdms ? bdms.active : []), [bdms]);

  useEffect(() => {
    setManagerState(manager);
  }, [manager]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-weight-bold">User Edit</CardTitle>
          <div>
            <X
              size={15}
              className="cursor-pointer mr-1"
              onClick={() => {
                handleCardClose();
              }}
            />
          </div>
        </CardHeader>
        <CardBody>
          <Form className="user-create" onSubmit={onSubmit}>
            <Row>
              <Col lg={isBdmVisible ? { size: 4, order: 2 } : { size: 6, order: 2 }} xs={{ size: 6, order: 2 }}>
                <FormGroup>
                  <Label for="nameVertical">First Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    placeholder="First Name"
                    value={managerState.first_name}
                    onChange={(event) => handleFieldChange("first_name", event.target.value)}
                    {...{ invalid: errors["first_name"] }}
                  />
                  <FormFeedback>{errors["first_name"] ? errors["first_name"] : ""}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="EmailVertical">Email</Label>
                  <Input
                    type="email"
                    name="Email"
                    id="EmailVertical"
                    placeholder="Email"
                    value={managerState.email}
                    onChange={(event) => handleFieldChange("email", event.target.value)}
                    {...{ invalid: errors["email"] }}
                  />
                  <FormFeedback>{errors["email"] ? errors["email"] : ""}</FormFeedback>
                </FormGroup>
              </Col>
              <Col lg={isBdmVisible ? { size: 4, order: 2 } : { size: 6, order: 2 }} xs={{ size: 6, order: 2 }}>
                <FormGroup>
                  <Label for="lastNameVertical">Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    id="lastNameVertical"
                    placeholder="Last Name"
                    value={managerState.last_name}
                    onChange={(event) => handleFieldChange("last_name", event.target.value)}
                    {...{ invalid: errors["last_name"] }}
                  />
                  <FormFeedback>{errors["last_name"] ? errors["last_name"] : ""}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="mobileVertical">Number</Label>
                  <Input
                    type="text"
                    name="number"
                    id="mobileVertical"
                    placeholder="Mobile"
                    value={managerState.number}
                    onChange={(event) => handleFieldChange("number", event.target.value)}
                    {...{ invalid: errors["number"] }}
                  />
                  <FormFeedback>{errors["number"] ? errors["number"] : ""}</FormFeedback>
                </FormGroup>
              </Col>
              {isBdmVisible ? (
                <Col lg={{ size: 4, order: 3 }} xs={{ size: 12, order: 1 }}>
                  <UserAccessManager
                    active={bdmsField.value}
                    potential={bdms?.potential}
                    error={error}
                    errors={bdmsField.errors}
                    onChange={setBdmsField}
                  />
                </Col>
              ) : null}
            </Row>

            <Row>
              <Col sm="6">
                <p style={{ marginBottom: 5 }}>Portal access:</p>
                {manager.invited && !manager.invited.revoked_at ? (
                  <UserInvitationsCreate
                    user={manager}
                    send={false}
                    resend={true}
                    trash={true}
                    invitationText="Resend invitation"
                  />
                ) : manager.invited && !manager.invited.accepted_at ? (
                  <UserInvitationsCreate
                    user={manager}
                    send={false}
                    resend={true}
                    trash={true}
                    invitationText="Resend invitation"
                  />
                ) : manager?.permissions?.ability !== "lead" &&
                  manager?.permissions?.ability !== "suspect" &&
                  manager?.permissions?.ability !== "archived" &&
                  manager.groups.length ? (
                  <UserInvitationsCreate send={true} resend={false} trash={false} user={manager} />
                ) : (
                  <p className="m-0" style={{ paddingLeft: "0.2rem" }}>
                    User cannot be invited
                  </p>
                )}
              </Col>
              <Col className="d-flex justify-content-end align-items-end" sm="6">
                <Button.Ripple className="m-0" color="primary" type="submit">
                  Save
                </Button.Ripple>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col>
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                label="Show intro page"
                checked={showIntroPage}
                onChange={({ target }) => onShowIntoPageChange(target.checked)}
              />
            </Col>
          </Row>

          {showIntroPage ? (
            <Form className="user-create mt-1" onSubmit={onUserNotifyEntitiesSubmit}>
              <Row>
                <Col>
                  <FormGroup>
                    <NmpSelect
                      options={notifyEntitiesOptions}
                      onChange={setNotifyEntityOption}
                      value={notifyEntityOption}
                      loading={userNotifyEntitiesQuery.isLoading}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-flex justify-content-end">
                    <NmpButton color="primary" loading={addUserNotifyEntity.isLoading}>
                      Save
                    </NmpButton>
                  </div>
                </Col>
              </Row>
            </Form>
          ) : null}
        </CardBody>
      </Card>
    </>
  );
};

export default UserProfileEdit;
