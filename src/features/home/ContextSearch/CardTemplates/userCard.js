import React, {useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Media, Spinner} from 'reactstrap'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

import useWindowSize from 'hooks/windowWidth'
import { X, Edit } from "react-feather";
import './userCard.scss'
import {capitalizeAll} from '../../../../utility/common'
import {selectLoading} from 'app/selectors'

import appSlice from 'app/slices/appSlice'

const {
  deleteUserAvatarRequest,
  getUserAvatarRequest,
  updateUserAvatarRequest,
  setContext,
  setSelectedMemberFirmId,
} = appSlice.actions;

const UserCardTemplate = ({className, oneColumn, onClick, editable = false, onEdit = () => {}, ...manager }) => {
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null)

  useEffect(() => {
    manager.avatar && dispatch(getUserAvatarRequest({managerId: manager.id}))
  },[manager.avatar])

  const handleNavigateToMemberFirm = (e, memberFirmId) => {
    e.stopPropagation();
    dispatch(setSelectedMemberFirmId(memberFirmId));
    dispatch(setContext("Member Firms"));
  };

  const changeAvatar = () => {
    fileInputRef.current.click()
  }

  const onChangeAvatar = (event) => {
    if(event.target.files.length){
      dispatch(updateUserAvatarRequest({managerId: manager.id, files: event.target.files}))
    }
  }

  const removeAvatar = () => {
    dispatch(deleteUserAvatarRequest({avatarId: manager.avatar.id, managerId: manager.id}))
  }
  return (
    <div>
      <Card
        key={manager.email}
        className={"flex-row home__card user-card " + className}
        onClick={(e) => {
          onClick(e, manager)
        }}
      >

        <div className="user-avatar-management">
          <CardImg variant="top" src={manager.url ? manager.url : noneAvatar} className="user-card-img d-sm-flex d-none" />
          {!!editable && (
            <>
              <Button
                className="user-avatar-management_change-button"
                disabled={isLoading}
                onClick={(event) => changeAvatar(event)}
                outline
                size="sm"
                color="primary"
              >
                Change
              </Button>
              <input
                id="input-user-edit-avatar"
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(event) => onChangeAvatar(event)}
              />

              {!!manager.url && !isLoading && (
                <X
                  className="x-closer"
                  onClick={removeAvatar}
                  size={15}
                />
              )}

              {!!isLoading && (
                <div
                  className="user-edit__user-avatar_spinner-wrapper"
                >
                  <Spinner color="primary" />
                </div>
              )}
            </>
          )}

        </div>

        <CardBody className="user-card-body">
          <div className="user-card-body-left">
            <div>
              <CardTitle className="m-0 user-card-body_title">
                {`${manager.first_name} ${manager.last_name}`}
                {!!editable && <Edit onClick={() => {onEdit()}} style={{marginLeft: "5px", marginBottom: "3px", cursor: "pointer"}} size={15}/>}
              </CardTitle>
              <CardText style={{marginBottom: "5px"}}>
                {manager?.permissions?.ability && capitalizeAll(manager.permissions.ability.replace("_", " "))}
              </CardText>
            </div>
            <div>
              <CardText>
                <span style={{paddingRight: "6px"}}>E:</span> {manager.email ? `${manager.email}` : "email is empty"}
              </CardText>
              {!!manager.number && (
                <CardText>
                  M: {manager.number}
                </CardText>
              )}
            </div>
          </div>
          <div className="user-card-body-right">
            <CardText>
              {manager.permissions?.organization} <br/>
              {!!manager.member_firm && (
                <span onClick={(e) => {handleNavigateToMemberFirm(e, manager.member_firm.id)}} className="user-card-body-right-member_firm_name">
                  {manager.member_firm.main_fields.name}
                </span>
              )}
            </CardText>
            <CardText className="user-card-body_last-seen">
              {/*Last seen 3 days ago*/}
            </CardText>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}


export default UserCardTemplate;
