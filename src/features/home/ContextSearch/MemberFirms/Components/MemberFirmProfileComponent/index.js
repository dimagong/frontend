import "./styles.scss";

import React from "react";
import { Button } from "reactstrap";
import { AtSign } from "react-feather";
import { PhoneEnabled } from "@material-ui/icons";

import Timeline from "components/Timeline";
import ContextTemplate from "components/ContextTemplate";
import DeprecatedNmpMemberFirmLogo from "components/nmp/DeprecatedNmpMemberFirmLogo";

import MemberFirmInfoForm from "./Components/MemberFirmInfoForm";
import MFAccessManager from "./Components/MFAccessManager";

const memberFirmProfileTabs = ["Activity", "Info"];

const MemberFirmProfileComponent = (props) => {
  const {
    data,
    isMemberFirmFormFieldsLoading,
    isMasterSchemaFieldsForMemberFirmLoading,
    memberFirmFormFields,
    masterSchemaMemberFirmFields,
    memberFirmId,
    onLoadMoreDataForActivities,
    memberFirmActivities,
  } = props;

  const [selectedTab, setSelectedTab] = React.useState(memberFirmProfileTabs[0]);

  return (
    <ContextTemplate contextTitle={"Member firm"}>
      <div className="member-firm-profile_header-info-name">
        <p>{data.main_fields.name}</p>
      </div>

      <div className="member-firm-profile">
        <div className="member-firm-profile__header">
          <div className="member-firm-profile_header_logo">
            <DeprecatedNmpMemberFirmLogo fileId={data.logo?.id} memberFirmId={memberFirmId} isEditable />
          </div>

          <MFAccessManager memberFirmId={memberFirmId} />

          <div className="member-firm-profile__header-info">
            <div className="member-firm-profile_header-info-contact_data">
              {!!data.main_fields.email && (
                <div className="member-firm-profile_header-info-contact_data-info_tile">
                  <AtSign className="member-firm-profile_header-info-contact_data-info_tile-icon" />{" "}
                  {data.main_fields.email}
                </div>
              )}

              {!!data.main_fields.contactNumber && (
                <div className="member-firm-profile_header-info-contact_data-info_tile">
                  <PhoneEnabled className="member-firm-profile_header-info-contact_data-info_tile-icon" />{" "}
                  {data.main_fields.contactNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="member-firm-profile_tabs">
          {memberFirmProfileTabs.map((tab) => (
            <Button
              className="member-firm-profile_tabs_tab"
              color={selectedTab === tab ? "primary" : "default"}
              onClick={() => setSelectedTab(tab)}
              key={tab}
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="member-firm-profile_tab-content">
          {
            {
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
              ),
            }[selectedTab]
          }
        </div>
      </div>
    </ContextTemplate>
  );
};

export default MemberFirmProfileComponent;
