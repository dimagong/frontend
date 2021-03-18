import React, {useRef, useEffect} from "react";
import { Button, Media, Spinner } from "reactstrap";
import noneAvatar from "assets/img/portrait/none-avatar.png";
import { X } from "react-feather";
import { selectLoading } from "app/selectors/authSelectors";
import { selectManager } from "app/selectors/userSelectors";
import { useDispatch, useSelector } from "react-redux";

import appSlice from 'app/slices/appSlice'

const {
  updateUserAvatarRequest,
  deleteUserAvatarRequest,
  getUserAvatarRequest,
} = appSlice.actions;

const UserAvatar = () => {
  const isLoading = useSelector(selectLoading);
  const manager = useSelector(selectManager);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null)

  useEffect(() => {
    manager.avatar && dispatch(getUserAvatarRequest({managerId: manager.id}))
  },[manager.avatar])

  const changeAvatar = () => {
    fileInputRef.current.click()
  }

  const onChangeAvatar = (event) => {
      if(event.target.files.length){
        dispatch(updateUserAvatarRequest({managerId: manager.id, files: event.target.files}))
      }
  }

  const removeAvatar = () => {
        dispatch(deleteUserAvatarRequest({avatarId: manager.avatar.id}))
  }

  return (
    <Media left className="user-edit__user-avatar mt-md-1 mt-0 mr-1">
      <Media
        className="rounded"
        object
        src={
            manager.url
            ?  manager.url
            : noneAvatar
        }
        alt="Generic placeholder image"
        height="112"
        width="112"
      />

      <div
        className="user-edit__user-avatar_button-wrapper"
      >
        <Button
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
      </div>

      {
        manager.url && !isLoading ? (
        <X
          className="x-closer"
          onClick={removeAvatar}
          size={15}
        />
      )
    :null}
      {isLoading ? (
        <div
        className="user-edit__user-avatar_spinner-wrapper"
        >
          <Spinner color="primary" />
        </div>
      ) : null}
    </Media>
  );
};

export default UserAvatar;
