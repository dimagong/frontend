import React from 'react';
import noneAvatar from "assets/img/portrait/none-avatar.png";
import AddUserIcon from 'assets/img/svg/add-user.svg';
import RemoveUserIcon from 'assets/img/svg/remove-user.svg';
import SettingsIcon from 'assets/img/svg/settings.svg';
import appSlice from "app/slices/appSlice";
import {useDispatch} from "react-redux";

const {
  setManager,
  setContext,
} = appSlice.actions;

const MemberFirmModalTable = ({array, isTitle, isAddUser, setArray, changeUser}) => {
  const dispatch = useDispatch();

  const TableCard = ({ manager }) => {
    return (
      <div style={{position: 'relative'}}>
        <div onClick={() => {handleCardClick(manager)}} className={'dashboard-action'} style={{display: 'inline-block', marginBottom: 0, marginTop: 5}}>
          <img src={manager.url ? manager.url : noneAvatar} className={"action-user-avatar"} alt={'profile-img'}/>
          <span style={{width: 135}} className={'action-user-name'}>
            {manager.first_name + ' ' + manager.last_name}
          </span>
          <span className={'action-user'}>
            {manager.permissions.ability.charAt(0).toUpperCase()
            + manager.permissions.ability.slice(1).replace('_', ' ')}
          </span>
          <span className={'action-user'}>{manager.email}</span>
          <span className={'action-user'}>Newcastle</span>
          <span className={'action-user'} style={{width: 120, paddingRight: 0}}>-</span>
        </div>
        {isAddUser
          ? <span className={'member-firm-table-icons member-firm-table-icons-add'}>
            <img src={AddUserIcon} alt={'add-user'} onClick={() => {changeUser(manager)}}/>
          </span>
          : <span className={'member-firm-table-icons member-firm-table-icons-remove'}>
            <img src={SettingsIcon} alt={'remove-user'} style={{marginRight: 8}}/>
            <img src={RemoveUserIcon} alt={'settings'} onClick={() => {changeUser(manager)}}/>
          </span>}
      </div>
    )
  }

  const TableTitle = () => {
    return <div className={'member-firm-table-title'}>
      <span onClick={() => handleSortBy('first_name')}>Name</span>
      <span onClick={() => handleSortBy('role')}>Role</span>
      <span onClick={() => handleSortBy('email')}>Email</span>
      <span>Suburb</span>
      <span style={{width: 120}}>Member Firm</span>
    </div>
  }

  const handleSortBy = (parameter) => {
    let newArray;
    switch (parameter) {
      case 'role': {
        newArray = [...array].sort((lhs, rhs) => lhs.permissions.ability >= rhs.permissions.ability ? 1 : -1)
        break;
      }
      default: newArray = [...array].sort((lhs, rhs) => lhs[parameter] >= rhs[parameter] ? 1 : -1)
    }
    if (JSON.stringify(array) === JSON.stringify(newArray)) {
      setArray(newArray.reverse())
    } else {
      setArray(newArray)
    }
  }

  const handleCardClick = (manager) => {
    dispatch(setManager(manager));
    dispatch(setContext('User'));
  }

  return (
    <div style={{marginBottom: '5vh', marginTop: '3vh'}}>
      {isTitle && <TableTitle/>}
      {array?.length > 0
        ? array.map(item =>
            <TableCard manager={item}/>
          )
        : <div style={{textAlign: 'center', fontSize: 'large'}}>No user found</div>
      }
    </div>
  )
};

export default MemberFirmModalTable;
