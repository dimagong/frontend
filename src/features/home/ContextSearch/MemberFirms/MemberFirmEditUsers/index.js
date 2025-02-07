import "./style.scss";

import { X } from "react-feather";
import { useDispatch } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";

import appSlice from "app/slices/appSlice";
import SearchAndFilter from "components/SearchAndFilter";

import MemberFirmModalTable from "./MemberFirmModalTable";
import MemberFirmsChangeRoleModal from "./MemberFirmsChangeRoleModal";

const { removeMemberFirmUsersRequest, getMemberFirmPotentialUsersRequest } = appSlice.actions;

const MemberFirmEditUsers = ({
  isModalOpen,
  setIsModalOpen,
  members,
  potentialMembers,
  memberFirm,
  allMembers,
  principals,
}) => {
  const dispatch = useDispatch();
  const [searchedMembers, setSearchedMembers] = useState([]);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [currUser, setCurrUser] = useState({});

  const filterTypes = {
    roles: ["Admin", "Corporation manager", "Prospect", "Suspect", "Archived", "Network manager", "Member", "Lead"],
  };

  const removeUser = (user) => {
    dispatch(
      removeMemberFirmUsersRequest({
        memberFirmId: memberFirm.id,
        users: [user.id],
      })
    );
  };

  const handleSearch = (e) => {
    setSearchedMembers(
      potentialMembers.filter(
        (item) => (item.first_name + item.last_name).toLowerCase().search(e.target.value.toLowerCase()) !== -1
      )
    );
    if (e.target.value.length > 0) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  };

  const applyFilter = (filter, managers) => {
    let newManagers = managers;
    let currRolesFilter = filter.selectedFilters.find((item) => item.name === "roles");
    if (currRolesFilter.selected.length !== 0) {
      newManagers = managers.filter((item) => {
        return currRolesFilter.selected.find(
          (role) =>
            role ===
            item?.permissions?.ability.charAt(0).toUpperCase() + item?.permissions?.ability.replace("_", " ").slice(1)
        );
      });
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
    setSearchedMembers(newManagers);
  };

  useEffect(() => {
    dispatch(getMemberFirmPotentialUsersRequest(memberFirm.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members?.length]);

  useEffect(() => {
    let newSearchedManagers = potentialMembers.filter((item) => searchedMembers.find((el) => el.id === item.id));
    setSearchedMembers(newSearchedManagers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentialMembers]);

  return (
    <Modal
      size="lg"
      className={"member-firm__modal"}
      isOpen={isModalOpen}
      fade={false}
      toggle={() => {
        setIsModalOpen(false);
      }}
    >
      <div className="custom-modal_header">
        <div className="custom-modal_header_title">Edit member firm</div>
        <div className={"custom-modal_header_cross"}>
          <X
            size={26}
            className={"custom-modal_header_cross-icon"}
            onClick={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
      </div>
      <ModalBody className={"member-firm-users-modal-body"} style={{ marginLeft: 15 }}>
        <SearchAndFilter
          handleSearch={handleSearch}
          dataToFilter={potentialMembers}
          filterTypes={filterTypes}
          applyFilter={applyFilter}
        />

        <MemberFirmModalTable
          array={members}
          deleteUser={(user) => setUserToDelete(user)}
          editUser={(user, newIsEdit) => {
            setIsChangeRoleModalOpen(true);
            setCurrUser(user);
            setIsEdit(newIsEdit);
          }}
          notFindMessage={"There are no users in member firm"}
          isTitle
          setArray={setSearchedMembers}
          arrayForSort={potentialMembers}
        />
        <div className={"member-firm__text"}>Other members</div>
        <Scrollbars autoHeight autoHeightMax={300}>
          <MemberFirmModalTable
            array={searchedMembers?.length > 0 || isFiltered ? searchedMembers : potentialMembers}
            editUser={(user, newIsEdit) => {
              setIsChangeRoleModalOpen(true);
              setCurrUser(user);
              setIsEdit(newIsEdit);
            }}
            isAddUser
            notFindMessage={isFiltered ? "No user was found for your query" : "There are no potential users to add"}
          />
        </Scrollbars>

        <MemberFirmsChangeRoleModal
          isOpen={isChangeRoleModalOpen}
          setIsOpen={setIsChangeRoleModalOpen}
          user={currUser}
          memberFirm={memberFirm}
          allMembers={allMembers}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          principals={principals}
        />

        <Modal
          className={"organization-remove-modal"}
          isOpen={userToDelete.hasOwnProperty("id")}
          fade={false}
          toggle={() => {
            setUserToDelete({});
          }}
        >
          <ModalBody>
            <div>
              <span style={{ fontSize: "22px" }}>
                Are you sure you want to remove {userToDelete.first_name + " " + userToDelete.last_name} from{" "}
                {memberFirm?.main_fields?.name}?
              </span>
            </div>
            <div className={"organization-remove-modal_action-buttons"}>
              <Button
                className={"remove-button"}
                onClick={() => {
                  removeUser(userToDelete);
                  setUserToDelete({});
                }}
              >
                Remove
              </Button>
              <Button
                className={"cancel-button"}
                onClick={() => {
                  setUserToDelete({});
                }}
              >
                Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </ModalBody>
    </Modal>
  );
};

export default MemberFirmEditUsers;
