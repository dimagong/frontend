import React, { useState, useRef } from 'react';

import ContextTemplate from "components/ContextTemplate";
import {AtSign, X, Plus} from "react-feather";
import {PhoneEnabled} from "@material-ui/icons";
import { Scrollbars } from 'react-custom-scrollbars';

import {Button, Spinner} from 'reactstrap';
import Timeline from "components/Timeline";
import MemberFirmInfoForm from "./Components/MemberFirmInfoForm";

import FormComponent from "./Components/MemberFirmInfoForm/Components/FormComponent";
import noneAvatar from "../../../../../../assets/img/portrait/none-avatar.png";
import {HEADER_HEIGHT} from "constants/header";

import './styles.scss'


const memberFirmProfileTabs = ["Activity", "Info"];

const MemberFirmProfileComponent = ({
  data,
  isMemberFirmFormFieldsLoading,
  isMasterSchemaFieldsForMemberFirmLoading,
  memberFirmFormFields,
  masterSchemaMemberFirmFields,
  memberFirmId,
  logoFileInputRef,
  onFileInputDialogOpen,
  onLogoChange,
  onLogoRemove,
  isMemberFirmActivitiesLoading,
  onLoadMoreDataForActivities,
  memberFirmActivities,
}) => {
  const [selectedTab, setSelectedTab] = useState(memberFirmProfileTabs[0]);

  const isProfilePhotoChangeProceeding = false;

  return (
    <ContextTemplate contextTitle={"Member firm"}>
        <div className="member-firm-profile">
          <div className="member-firm-profile_header">
            <div className="member-firm-profile_header_logo">
              <img src={data.logo_path || noneAvatar} alt="member firm logo" />

              <Button
                className="member-firm-profile_header_logo-change_button"
                disabled={isProfilePhotoChangeProceeding}
                onClick={(event) => onFileInputDialogOpen(event)}
                outline
                size="sm"
                color="primary"
              >
                Change
              </Button>
              <input
                ref={logoFileInputRef}
                type="file"
                hidden
                onChange={(event) => onLogoChange(event)}
              />

              {/*HANDLE HERE DELETING OF AVATAR*/}

              {!!data.logo_path && !isProfilePhotoChangeProceeding && (
                <X
                  className="x-closer"
                  onClick={onLogoRemove}
                  size={25}
                />
              )}

              {isProfilePhotoChangeProceeding && (
                <div
                  className="user-edit__user-avatar_spinner-wrapper"
                >
                  <Spinner color="primary" />
                </div>
              )}
            </div>
            <div className="member-firm-profile_header-info">
              <div className="member-firm-profile_header-info-name">
                <p>
                  {data.main_fields.name}
                </p>
              </div>
              <div className="member-firm-profile_header-info-contact_data">
                {!!data.main_fields.email && (
                  <div className="member-firm-profile_header-info-contact_data-info_tile">
                    <AtSign className="member-firm-profile_header-info-contact_data-info_tile-icon" /> {data.main_fields.email}
                  </div>
                )}

                {!!data.main_fields.contactNumber && (
                  <div className="member-firm-profile_header-info-contact_data-info_tile">
                    <PhoneEnabled className="member-firm-profile_header-info-contact_data-info_tile-icon" /> {data.main_fields.contactNumber}
                  </div>
                )}

              </div>
            </div>

          </div>

          <div className="member-firm-profile_tabs">
            {memberFirmProfileTabs.map(tab => (
              <Button className="member-firm-profile_tabs_tab" color={selectedTab === tab ? "primary" : "default"} onClick={() => setSelectedTab(tab)}>
                {tab}
              </Button>
            ))}
          </div>
          <div className="member-firm-profile_tab-content">
            {{
              Activity: (
                <Timeline
                  className="member-firm-profile-activities"
                  noActivitiesMessage={"There was no activity in that member firm"}
                  loadMoreData={onLoadMoreDataForActivities}
                  activity={memberFirmActivities}
                />
              ),
              Info: (
                <MemberFirmInfoForm
                  memberFirmId={memberFirmId}
                  isMemberFirmFormFieldsLoading={isMemberFirmFormFieldsLoading}
                  isMasterSchemaFieldsForMemberFirmLoading={isMasterSchemaFieldsForMemberFirmLoading}
                  memberFirmFormFields={memberFirmFormFields}
                  masterSchemaMemberFirmFields={masterSchemaMemberFirmFields}
                />
              )
            }[selectedTab]}
          </div>
        </div>
    </ContextTemplate>
  )
};

export default MemberFirmProfileComponent;
