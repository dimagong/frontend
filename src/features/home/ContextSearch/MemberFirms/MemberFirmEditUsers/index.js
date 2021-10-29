import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import MemberFirmModalTable from "./MemberFirmModalTable";
import AutoComplete from "components/@vuexy/autoComplete/AutoCompleteComponent";
import FilterIcon from "assets/img/svg/filter.svg";
import { X } from "react-feather";
import FilterModal from "../../ContextSearchNav/Filters/FilterModal";
import { useDispatch } from "react-redux";
import MemberFirmsChangeRoleModal from "./MemberFirmsChangeRoleModal";
import CloseIcon from "@material-ui/icons/Close";
import appSlice from "app/slices/appSlice";
import "./style.scss";
import Scrollbars from "react-custom-scrollbars";

const { removeMemberFirmUsersRequest, getMemberFirmPotentialUsersRequest } =
  appSlice.actions;

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
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const [currUser, setCurrUser] = useState({});
  const wrapperRefFilterButton = useRef(null);
  const [curr, setCurr] = useState("roles");
  const [filter, setFilter] = useState({
    roles: new Set(),
    organizations: new Set(),
    memberFirms: new Set(),
    type: {
      roles: "initial",
      organizations: "initial",
      memberFirms: "initial",
    },
  });
  const [footerText, setFooterText] = useState({
    roles: "",
    organizations: "",
    memberFirms: "",
  });
  const [filterName, setFilterName] = useState("");

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
        (item) =>
          (item.first_name + item.last_name)
            .toLowerCase()
            .search(e.target.value.toLowerCase()) !== -1
      )
    );
    if (e.target.value.length > 0) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  };

  const handleFilter = (newManagers) => {
    setSearchedMembers(newManagers);
    if (filter.roles.size > 0) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  };

  useEffect(() => {
    dispatch(getMemberFirmPotentialUsersRequest(memberFirm.id));
  }, [members?.length]);

  useEffect(() => {
    let newSearchedManagers = potentialMembers.filter((item) =>
      searchedMembers.find((el) => el.id === item.id)
    );
    setSearchedMembers(newSearchedManagers);
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
      <div className="survey-modal_header">
        <div className="member-firm__title">Firm Member Management</div>
        <div className={"member-firm__close"}>
          <X
            size={26}
            className={"survey-modal_header_cross-icon member-firm__close-icon"}
            onClick={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
      </div>
      <ModalBody className="member-firm__body">
        <div
          style={{
            display: "flex",
            gap: 25,
            alignItems: "center",
            paddingRight: 13,
          }}
        >
          <div style={{ width: "100%" }}>
            <AutoComplete
              placeholder="Search"
              suggestions={[]}
              className="member-firm__input"
              filterKey="name"
              onChange={handleSearch}
              suggestionLimit={4}
              defaultSuggestions={false}
              customRender={() => {}}
              showClear={true}
              hideSuggestions
            />
          </div>

          <div>
            <img
              ref={wrapperRefFilterButton}
              className={"filter-icon member-firm-filter-icon"}
              src={FilterIcon}
              alt={"filter-icon"}
              onClick={() => {
                setIsFilterBoxOpen(!isFilterBoxOpen);
              }}
            />
          </div>
        </div>

        {isFilterBoxOpen && (
          <FilterModal
            managers={potentialMembers}
            handleFilter={handleFilter}
            wrapperRefFilterButton={wrapperRefFilterButton}
            style={{ left: 220, top: 50, marginBottom: 0 }}
            filterTypes={["roles"]}
            filter={filter}
            setFilter={setFilter}
            setIsFilterBoxOpen={setIsFilterBoxOpen}
            curr={curr}
            setCurr={setCurr}
            footerText={footerText}
            setFooterText={setFooterText}
            filterName={filterName}
            setFilterName={setFilterName}
          />
        )}

        {filter.roles.size > 0 && (
          <div style={{ textAlign: "right", marginTop: 16, height: 30 }}>
            <Button
              className={"filter-tab member-firm-filter-tab"}
              variant={"dark"}
            >
              <span className={"nav-text"}>
                {footerText.roles.length <= 40
                  ? footerText.roles
                  : `${filter.roles.size} roles`}
              </span>

              <span
                onClick={() => {
                  setFilter({
                    roles: new Set(),
                    organizations: new Set(),
                    memberFirms: new Set(),
                    type: {
                      roles: "initial",
                      organizations: "initial",
                      memberFirms: "initial",
                    },
                  });
                  setSearchedMembers([]);
                  setIsFiltered(false);
                }}
                className={"close-nav"}
              >
                <CloseIcon />
              </span>
            </Button>
          </div>
        )}

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
        <div className={'member-firm__text'}>
          Other members
        </div>
        <Scrollbars autoHeight autoHeightMax={200}>
          <MemberFirmModalTable
            array={
              searchedMembers?.length > 0 || isFiltered
                ? searchedMembers
                : potentialMembers
            }
            editUser={(user, newIsEdit) => {
              setIsChangeRoleModalOpen(true);
              setCurrUser(user);
              setIsEdit(newIsEdit);
            }}
            isAddUser
            notFindMessage={
              isFiltered
                ? "No user was found for your query"
                : "There are no potential users to add"
            }
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
                Are you sure you want to remove{" "}
                {userToDelete.first_name + " " + userToDelete.last_name} from{" "}
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
