import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { RefreshCcw, Trash } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { selectManager } from "app/selectors";
import moment from "moment";
import "./UserInvitationsCreate.scss";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/scss/plugins/extensions/toastr.scss";

import appSlice from "app/slices/appSlice";
import { useCreateInvitationsMutation } from "api/User/useUserInvitationQuery";

const { createInvitationsRequest, deleteInvitationsRequest } = appSlice.actions;

const UserInvitationsCreate = ({ resend, invitationText }) => {
  const dispatch = useDispatch();
  const manager = useSelector(selectManager);
  const [invitationExpiredTime, setInvitationExpiredTime] = useState("");
  let invitationInterval;

  const remove = (event) => {
    event.preventDefault();
    dispatch(deleteInvitationsRequest({ managerInvitedId: manager.invited.id }));
    setInvitationExpiredTime("");
    clearInterval(invitationInterval);
  };

  const useCreateInvitations = useCreateInvitationsMutation({ managerId: manager.id, resend });
  const formSubmit = (event) => {
    event.preventDefault();
    //dispatch(createInvitationsRequest({ managerId: manager.id, resend }));
    useCreateInvitations.mutate();
  };

  const getInvitationDate = () => {
    return moment(manager.invited.created_at).add(1, "days").diff(moment());
  };

  const startInvitationTimer = () => {
    clearInterval(invitationInterval);
    invitationInterval = setInterval(() => {
      if (!manager.invited) {
        return "";
      }
      const time = getInvitationDate();

      if (moment.duration(time).seconds() <= 0) {
        return setInvitationExpiredTime("Expired");
      }

      return setInvitationExpiredTime(moment.utc(time).format("HH:mm:ss"));
    }, 1000);
    return invitationInterval;
  };

  useEffect(() => {
    startInvitationTimer();
    return () => clearInterval(invitationInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager]);

  const onCopy = () => {
    toast.success("Invitation link copied successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const renderRemove = () => {
    return (
      <div>
        <Button
          onClick={(event) => remove(event)}
          color="primary"
          className="mr-1 btn-icon"
          size="sm"
          style={{ "font-size": "14px" }}
          id="trash-invitation-btn"
        >
          <Trash />
        </Button>
      </div>
    );
  };

  const renderTime = () => {
    return (
      <div className="ml-1" style={{ fontWeight: 600 }}>
        {/* <Button
          color="primary"
          className="mr-1 ml-1"
          size="sm"
          style={{ "font-size": "14px" }}
          id="send-invitation-btn"
        > */}
        {invitationExpiredTime ? invitationExpiredTime : <RefreshCcw size="15" className="rotating" />}
        {/* </Button> */}
      </div>
    );
  };

  const renderTimeButton = () => {
    return (
      <div style={{ display: "flex" }}>
        <CopyToClipboard
          onCopy={onCopy}
          text={window.location.origin + "/invitation-accept/" + manager.invited.invitation_token}
        >
          <Button color="primary" className="mr-1" size="sm" style={{ "font-size": "14px" }}>
            Copy link
          </Button>
        </CopyToClipboard>
        <Button
          onClick={(event) => {}}
          color="primary"
          className="mr-1"
          size="sm"
          style={{ "font-size": "14px" }}
          id="send-invitation-btn"
        >
          {!invitationText ? "Send invatation email" : invitationText}
        </Button>
      </div>
    );
  };

  const renderCreate = () => {
    return (
      <div>
        <Button
          onClick={(event) => formSubmit(event)}
          color="primary"
          className="mr-1"
          size="sm"
          style={{ "font-size": "14px" }}
          id="send-invitation-btn"
        >
          {!invitationText ? "Create invatation link" : invitationText}
        </Button>
      </div>
    );
  };

  const renderStatus = () => {
    let status = "";

    if (manager.invited.accepted_at) {
      status = "Accepted";
    } else if (manager.invited.revoked_at) {
      status = "Revoked";
    } else if (manager.invited.is_expired) {
      status = "Expired";
    }

    return (
      <div>
        <Button color="primary" className="mr-1" size="sm" style={{ "font-size": "14px" }}>
          {status}
        </Button>
      </div>
    );
  };

  const isShowStatus = () => {
    return manager.invited && (manager.invited.accepted_at || manager.invited.is_expired || manager.invited.revoked_at);
  };

  const isShowTimer = () => {
    return manager.invited && !isShowStatus();
  };

  return (
    <>
      <div style={{ marginBottom: 5, display: "flex", alignItems: "center" }}>
        <p style={{ margin: 0 }}>Portal access:</p>
        {isShowTimer() && renderTime()}
      </div>

      <div className="d-flex">
        {isShowStatus() ? (
          <React.Fragment>
            {renderStatus()}
            {renderRemove()}
          </React.Fragment>
        ) : !manager.invited ? (
          renderCreate()
        ) : (
          <React.Fragment>
            {renderTimeButton()}
            {renderRemove()}
          </React.Fragment>
        )}
      </div>
    </>
  );
};

export default UserInvitationsCreate;
