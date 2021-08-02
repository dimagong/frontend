import React, { useState } from 'react';

import ContextTemplate from "components/ContextTemplate";
import {AtSign} from "react-feather";
import {PhoneEnabled} from "@material-ui/icons";

import {Button} from 'reactstrap';
import './styles.scss'

import Timeline from "components/Timeline";
import FormComponent from "./Components/FormComponent";

import noneAvatar from "../../../../../../assets/img/portrait/none-avatar.png";


const memberFirmProfileTabs = ["Activity", "Info"];

const MemberFirmProfileComponent = ({
  data,
  isMemberFirmFormFieldsLoading,
  isMasterSchemaFieldsForMemberFirmLoading,
  memberFirmFormFields,
  masterSchemaMemberFirmFields,
  memberFirmId,
}) => {
  const [selectedTab, setSelectedTab] = useState(memberFirmProfileTabs[0]);

  return (
    <ContextTemplate contextTitle={"Member firm"}>
      <div className="member-firm-profile">
        <div className="member-firm-profile_header">
          <div className="member-firm-profile_header_logo">
            <img src={noneAvatar} alt="member firm logo"/>
          </div>
          <div className="member-firm-profile_header_name">
            {data.main_fields.name}
          </div>
        </div>
        <div className="member-firm-profile_info">
          <div className="member-firm-profile_info_tile">
            <AtSign className="member-firm-profile_info_tile_icon" /> info@citycapital.co.uk
          </div>
          {/*<div className="member-firm-profile_info_tile">*/}
          {/*  info@citycapital.co.uk*/}
          {/*</div>*/}
          <div className="member-firm-profile_info_tile">
            <PhoneEnabled className="member-firm-profile_info_tile_icon" /> 815 474 125 53
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
            Activity: <Timeline noActivitiesMessage={"There was no activity in that member firm"} loadMoreData={() => {}} />,
            Info: (
              <FormComponent
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
