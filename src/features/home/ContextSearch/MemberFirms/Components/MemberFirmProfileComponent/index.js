import React from 'react';

import ContextTemplate from "components/ContextTemplate";
import {AtSign} from "react-feather";
import {PhoneEnabled} from "@material-ui/icons";

import {Button} from 'reactstrap';
import './styles.scss'


import noneAvatar from "../../../../../../assets/img/portrait/none-avatar.png";


const MemberFirmProfileComponent = ({ data }) => {

  return (
    <ContextTemplate contextTitle={"Member firm"}>
      <div className="member-firm-profile">
        <div className="member-firm-profile_header">
          <div className="member-firm-profile_header_logo">
            <img src={noneAvatar} alt="member firm logo"/>
          </div>
          <div className="member-firm-profile_header_name">
            {data.name}
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
          {["Activity", "Info"].map(tab => (
            <Button className="member-firm-profile_tabs_tab" color="white">
              {tab}
            </Button>
          ))}
        </div>
        <div className="member-firm-profile_tab-content">

        </div>
      </div>
    </ContextTemplate>
  )
};

export default MemberFirmProfileComponent;
