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
  sortedArr,
}) => {
  const TableCard = ({ manager }) => {
    return (
      <div className="table-card">

        <img
          src={manager.url ? manager.url : noneAvatar}
          className={"table-card__avatar"}
          alt={"profile-img"}
        />

        <span className={"table-card__user-name"}>
          {manager.first_name + " " + manager.last_name}
        </span>

        <span className={"table-card__user-status"}>
          {
            manager?.status
          }
        </span>

        <span className={"table-card__user-email"}>
          {manager.email}
        </span>

        <span className={"table-card__user-city"}>
          -
        </span>

        <span className={"table-card__user-role"}>
          {manager?.permissions?.ability
            ? manager.permissions.ability.charAt(0).toUpperCase() +
              manager.permissions.ability.slice(1).replace("_", " ")
            : "none"}
        </span>

        <div className={"table-card__delimiter"} />

        {isAddUser ? (
          <span>
            <img
              src={AddUserIcon}
              alt={"add-user"}
              onClick={() => {
                editUser(manager, false);
              }}
              className="cursor-pointer"
            />
          </span>
        ) : (
          <span className="table-card__block">
            <img
              src={SettingsIcon}
              alt={"remove-user"}
              onClick={() => editUser(manager, true)}
              style={{ marginRight: 8 }}
              className="cursor-pointer"
            />
            <img
              src={RemoveUserIcon}
              alt={"settings"}
              onClick={() => {
                deleteUser(manager);
              }}
              className="cursor-pointer"
            />
          </span>
        )}
      </div>
    );
  };

  const TableTitle = () => {
    return (
      <div className={"member-firm-table-title"}>
        <span className="title__user-name" onClick={() => handleSortBy("first_name")}>
          Name
        </span>
        <span className="title__user-status">Status</span>
        <span className="title__user-email" onClick={() => handleSortBy("email")}>
          Email
        </span>
        <span className="title__user-city">City</span>
        <span className="title__user-role" onClick={() => handleSortBy("role")}>
          Firm role
        </span>
      </div>
    );
  };

  const handleSortBy = (parameter) => {
    let newArray;
    switch (parameter) {
      case "role": {
        newArray = [...sortedArr].sort((lhs, rhs) =>
          lhs.permissions?.ability >= rhs.permissions?.ability ? 1 : -1
        );
        break;
      }
      case "memberFirm": {
        newArray = [...sortedArr].sort((lhs, rhs) =>
          lhs.member_firm?.main_fields?.name >=
          rhs.member_firm?.main_fields?.name
            ? 1
            : -1
        );
        break;
      }
      default:
        newArray = [...sortedArr].sort((lhs, rhs) =>
          lhs[parameter] >= rhs[parameter] ? 1 : -1
        );
    }
    if (JSON.stringify(sortedArr) === JSON.stringify(newArray)) {
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
            marginBottom: isTitle ? 50 : 25,
          }}
        >
          {notFindMessage}
        </div>
      )}
    </div>
  );
};

export default MemberFirmModalTable;
