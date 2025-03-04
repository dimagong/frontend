import "./navBar.scss";

import React from "react";
import { Navbar } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "react-feather";

import { history } from "routes/history";
import appSlice from "app/slices/appSlice";
import { getMemberFirms } from "app/selectors/memberFirmsSelector";
import DeprecatedNmpOrganizationLogo from "components/nmp/DeprecatedNmpOrganizationLogo";
import { selectProfile, selectManagers, selectContextSearchVisibility } from "app/selectors";

import NavbarUser from "./NavbarUser";
import SearchInput from "./SearchInput";

const { logout, toggleContextSearch, setContext } = appSlice.actions;

const UserName = ({ userProfile }) => {
  if (Object.keys(userProfile).length && userProfile.constructor === Object) {
    return userProfile.first_name;
  }
  return "";
};

const ThemeNavbar = () => {
  const dispatch = useDispatch();
  const managers = useSelector(selectManagers);
  const userProfile = useSelector(selectProfile);
  const memberFirms = useSelector(getMemberFirms);
  const isContextSearchVisible = useSelector(selectContextSearchVisibility);

  const logoutJWT = async () => {
    dispatch(logout());
    history.push("/login");
  };

  const handleContextSearchToggle = () => dispatch(toggleContextSearch());

  const handleOrgPictureClick = () => dispatch(setContext("Dashboard"));

  if (!userProfile) {
    return null;
  }

  return (
    <Navbar
      style={{ width: "100%", margin: 0, borderRadius: 0 }}
      className="header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow"
    >
      <div className="navbar-wrapper">
        <div className="navbar-container content">
          <div className="navbar-collapse d-flex justify-content-between align-items-center" id="navbar-mobile">
            <div className="bookmark-wrapper">
              <span className="navbar-brand logo d-flex align-items-center" onClick={handleOrgPictureClick}>
                <DeprecatedNmpOrganizationLogo
                  fileId={userProfile.permissions.logo?.id}
                  isOnboarding={false}
                  organizationId={userProfile.permissions.organization_id}
                  organizationType={userProfile.permissions.organization_type}
                  organizationName={userProfile.permissions.organization}
                  className="brand-logo"
                />
              </span>
            </div>

            <div className="search-input_container">
              <SearchInput
                suggestions={managers
                  .map(({ first_name, last_name, ...rest }) => ({
                    name: first_name + " " + last_name,
                    ...rest,
                  }))
                  .concat(memberFirms.map((item) => ({ ...item, name: item.main_fields.name, isMemberFirm: true })))}
              />
              {isContextSearchVisible ? (
                <ChevronUp className="autocomplete-expand-icon" onClick={handleContextSearchToggle} />
              ) : (
                <ChevronDown className="autocomplete-expand-icon" onClick={handleContextSearchToggle} />
              )}
            </div>

            <NavbarUser
              email={`${userProfile.permissions.organization}`}
              userId={userProfile.id}
              userName={<UserName userProfile={userProfile} />}
              userAvatarId={userProfile.avatar?.id}
              logoutWithJWT={logoutJWT}
            />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ThemeNavbar;
