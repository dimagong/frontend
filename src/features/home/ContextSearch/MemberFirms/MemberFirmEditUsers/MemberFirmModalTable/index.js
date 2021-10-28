import React from "react";
import noneAvatar from "assets/img/portrait/none-avatar.png";
import AddUserIcon from "assets/img/svg/add-user.svg";
import RemoveUserIcon from "assets/img/svg/remove-user.svg";
import SettingsIcon from "assets/img/svg/settings.svg";
import "./style.scss";

const MemberFirmModalTable = ({
  array,
  isTitle,
  isAddUser,
  setArray,
  deleteUser,
  editUser,
  notFindMessage,
}) => {
  // const TableCard = ({ manager }) => {

  //   return (
  //     <div style={{position: 'relative'}}>
  //       <div className={'dashboard-action'} style={{cursor: 'unset', display: 'inline-block', marginBottom: 0, marginTop: 5}}>
  //         <img src={manager.url ? manager.url : noneAvatar} className={"action-user-avatar"} alt={'profile-img'}/>
  //         <span style={{width: 130}} className={'action-user-name'}>
  //           {manager.first_name + ' ' + manager.last_name}
  //         </span>
  //         <span className={'action-user'}>
  //           {manager?.permissions?.ability ? manager.permissions.ability.charAt(0).toUpperCase()
  //           + manager.permissions.ability.slice(1).replace('_', ' ') : 'none'}
  //         </span>
  //         <span className={'action-user'}>{manager.email}</span>
  //         <span className={'action-user'}>-</span>
  //         <span className={'action-user'} style={{width: 120, paddingRight: 0}}>{manager.member_firm?.main_fields?.name || '-'}</span>
  //       </div>
  //       {isAddUser ? (
  //         (
  //           <span className={'member-firm-table-icons member-firm-table-icons-add'}>
  //             <img src={AddUserIcon} alt={'add-user'} onClick={() => {editUser(manager, false)}}/>
  //           </span>
  //         )
  //       ) : (
  //         <span className={'member-firm-table-icons member-firm-table-icons-remove'}>
  //           <img src={SettingsIcon} alt={'remove-user'} onClick={() => editUser(manager, true)} style={{marginRight: 8}}/>
  //           <img src={RemoveUserIcon} alt={'settings'} onClick={() => {deleteUser(manager)}}/>
  //         </span>
  //       )}
  //     </div>
  //   )
  // }
  const TableCard = ({ manager }) => {
    return (
      <div style={{ position: "relative" }}>
        <div className="table-card">
          <img
            src={manager.url ? manager.url : noneAvatar}
            className={"table-card__avatar"}
            alt={"profile-img"}
          />
          <span style={{ width: 85, paddingRight: 20 }} className={"table-card__user-name"}>
            {manager.first_name + " " + manager.last_name}
          </span>
          <span className={"action-user"} style={{ width: 105, paddingRight: 20 }}>
            {manager?.permissions?.ability
              ? manager.permissions.ability.charAt(0).toUpperCase() +
                manager.permissions.ability.slice(1).replace("_", " ")
              : "none"}
          </span>
          <span
            className={"action-user"}
            style={{
              width: 163,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingRight: 20
            }}
          >
            {manager.email}
          </span>
          <span className={"action-user"} style={{ width: 108, paddingRight: 20 }}>
            -
          </span>
          <span className={"action-user"} style={{ width: 100, paddingRight: 20 }}>
            -
          </span>
          <div style={{ height: 28, width: 2, backgroundColor: '#707070', marginRight: 20 }}/>
          {/* <span className={'action-user'} style={{width: 120, paddingRight: 0}}>{manager.member_firm?.main_fields?.name || '-'}</span> */}
          {isAddUser ? (
            <span
            // className={"member-firm-table-icons member-firm-table-icons-add"}
            >
              <img
                src={AddUserIcon}
                alt={"add-user"}
                onClick={() => {
                  editUser(manager, false);
                }}
              />
            </span>
          ) : (
            <span
            // className={"member-firm-table-icons member-firm-table-icons-remove"}
            style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}
            >
              <img
                src={SettingsIcon}
                alt={"remove-user"}
                onClick={() => editUser(manager, true)}
                style={{ marginRight: 8 }}
              />
              <img
                src={RemoveUserIcon}
                alt={"settings"}
                onClick={() => {
                  deleteUser(manager);
                }}
              />
            </span>
          )}
        </div>
      </div>
    );
  };

  // const TableTitle = () => {
  //   return <div className={'member-firm-table-title'}>
  //     <span onClick={() => handleSortBy('first_name')}>Name</span>
  //     <span onClick={() => handleSortBy('role')}>Role</span>
  //     <span onClick={() => handleSortBy('email')}>Email</span>
  //     <span>Suburb</span>
  //     <span onClick={() => handleSortBy('memberFirm')} style={{width: 120}}>Member Firm</span>
  //   </div>
  // }
  const TableTitle = () => {
    return (
      <div className={"member-firm-table-title"}>
        <span style={{ maxWidth: 85, width: '100%' }} onClick={() => handleSortBy("first_name")}>
          Name
        </span>
        <span style={{ maxWidth: 105, width: '100%' }} onClick={() => handleSortBy("role")}>
          Firm role
        </span>
        <span style={{ maxWidth: 163, width: '100%' }} onClick={() => handleSortBy("email")}>
          Email
        </span>
        <span style={{ maxWidth: 108, width: '100%' }}>City</span>
        {/* <span onClick={() => handleSortBy('memberFirm')} style={{width: 120}}>Member Firm</span> */}
      </div>
    );
  };

  const handleSortBy = (parameter) => {
    let newArray;
    switch (parameter) {
      case "role": {
        newArray = [...array].sort((lhs, rhs) =>
          lhs.permissions?.ability >= rhs.permissions?.ability ? 1 : -1
        );
        break;
      }
      case "memberFirm": {
        newArray = [...array].sort((lhs, rhs) =>
          lhs.member_firm?.main_fields?.name >=
          rhs.member_firm?.main_fields?.name
            ? 1
            : -1
        );
        break;
      }
      default:
        newArray = [...array].sort((lhs, rhs) =>
          lhs[parameter] >= rhs[parameter] ? 1 : -1
        );
    }
    if (JSON.stringify(array) === JSON.stringify(newArray)) {
      setArray(newArray.reverse());
    } else {
      setArray(newArray);
    }
  };

  return (
    <div style={{ marginBottom: 22, marginTop: 26}}>
      {isTitle && <TableTitle />}
      {array?.length > 0 ? (
        array.map((item) => <TableCard manager={item} />)
      ) : (
        <div
          style={{
            textAlign: "center",
            fontSize: "large",
            marginTop: isTitle ? 50 : 25,
          }}
        >
          {notFindMessage}
        </div>
      )}
    </div>
  );
};

export default MemberFirmModalTable;
