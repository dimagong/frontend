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
import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";

import appSlice from "app/slices/appSlice";
import { useCreateInvitationsMutation, useSendEmailUserMutation } from "api/User/useUserInvitationQuery";

const { deleteInvitationsRequest } = appSlice.actions;

const UserInvitationsCreate = ({ resend }) => {
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
    useCreateInvitations.mutate();
  };

  const getInvitationDate = () => {
    return moment(manager.invited.created_at).add(1, "days").diff(moment());
  };

  const sendEmailUser = useSendEmailUserMutation({ invitationId: manager.invited?.id });
  const sendEmail = (event) => {
    event.preventDefault();
    if (manager.invited?.id) {
      sendEmailUser.mutate();
    } else {
      toast.error("Sending email is impossible", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const startInvitationTimer = () => {
    clearInterval(invitationInterval);
    invitationInterval = setInterval(() => {
      if (!manager.invited) {
        return "";
      }
      const time = getInvitationDate();

      if (moment.duration(time).asSeconds() <= 0) {
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
        <DeprecatedNmpButton
          onClick={remove}
          color="primary"
          className="mr-1 btn-icon"
          size="sm"
          style={{ "font-size": "14px" }}
          id="trash-invitation-btn"
          icon={<Trash />}
        />
      </div>
    );
  };

  const renderTime = () => {
    return (
      <div className="ml-1" style={{ fontWeight: 600 }}>
        {invitationExpiredTime ? invitationExpiredTime : <RefreshCcw size="15" className="rotating" />}
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
        <DeprecatedNmpButton
          onClick={sendEmail}
          color="primary"
          className="mr-1"
          size="sm"
          style={{ "font-size": "14px" }}
          id="send-invitation-btn"
          loading={sendEmailUser.isLoading}
        >
          Send invitation email
        </DeprecatedNmpButton>
      </div>
    );
  };

  const renderCreate = () => {
    return (
      <div>
        <DeprecatedNmpButton
          size="sm"
          color="primary"
          className="mr-1"
          onClick={formSubmit}
          id="send-invitation-btn"
          style={{ "font-size": "14px" }}
          loading={useCreateInvitations.isLoading}
        >
          Create invitation link
        </DeprecatedNmpButton>
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
        <span
          className="mr-1"
          style={{
            // layout
            display: "inline-block",
            textAlign: "center",
            verticalAlign: "middle",
            // font
            color: "var(--white)",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: 1,
            // appearance
            padding: "0.5rem 1.5rem",
            borderColor: "#4839eb",
            borderRadius: "0.25rem",
            backgroundColor: "var(--primary)",
          }}
        >
          {status}
        </span>
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
