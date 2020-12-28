import React, {useState, useEffect} from 'react'
import {
  Button,
  UncontrolledTooltip
} from "reactstrap"
import {RefreshCcw, Trash, Save} from "react-feather"
import {useDispatch, useSelector} from "react-redux";
import {createInvitationsRequest, deleteInvitationsRequest} from "app/slices/appSlice";
import {selectManager} from "app/selectors";
import moment from "moment";
import './UserInvitationsCreate.scss'
import {CopyToClipboard} from "react-copy-to-clipboard"
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"

const UserInvitationsCreate = ({resend, trash, send, invitationText}) => {
  const dispatch = useDispatch();
  const manager = useSelector(selectManager);
  const [invitationExpiredTime, setInvitationExpiredTime] = useState('');
  let invitationInterval;

  const remove = (event) => {
    event.preventDefault();
    dispatch(deleteInvitationsRequest({managerInvitedId: manager.invited.id}));
    setInvitationExpiredTime('');
    clearInterval(invitationInterval);
  };

  const formSubmit = (event) => {
    event.preventDefault();
    dispatch(createInvitationsRequest({managerId: manager.id, resend}))
  };

  const getInvitationDate = () => {
    return moment(manager.invited.created_at).add(1, 'days').diff(moment())
  };

  const startInvitationTimer = () => {
    clearInterval(invitationInterval);
    invitationInterval = setInterval(() => {
      if (!manager.invited) {
        return '';
      }
      const time = getInvitationDate();

      if (moment.duration(time).seconds() <= 0) {
        return setInvitationExpiredTime('Expired');
      }

      return setInvitationExpiredTime(moment.utc(time).format("HH:mm:ss"));
    }, 1000);
    return invitationInterval;
  };

  useEffect(() => {
    startInvitationTimer();
    return () => clearInterval(invitationInterval);
  }, [manager]);

  const onCopy = () => {
    toast.success("Invitation link copied successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    })
  };

  const renderRemove = () => {
    return <div>
      <Button
        onClick={(event) => remove(event)}
        color="primary"
        className="mr-1 mb-1 btn-icon"
        size="sm"
        style={{'font-size': '14px'}}
        id="trash-invitation-btn"
      >
        <Trash></Trash>
      </Button>
      {/*<UncontrolledTooltip placement="top" target="trash-invitation-btn">*/}
      {/*  Delete invitation*/}
      {/*</UncontrolledTooltip>*/}
    </div>;
  };

  const renderTime = () => {
    return <div>
      <CopyToClipboard
        onCopy={onCopy}
        text={window.location.origin + '/invitation-accept/' + manager.invited.invitation_token}
      >
        <Button
          color="primary"
          className="mr-1 mb-1"
          size="sm"
          style={{'font-size': '14px'}}
          id="send-invitation-btn"
        >
          {
            invitationExpiredTime ? invitationExpiredTime : <RefreshCcw size="15" className="rotating"/>
          }
        </Button>
      </CopyToClipboard>
      {/*<UncontrolledTooltip placement="top" target="resend-invitation-btn">*/}
      {/*  Resend invitation*/}
      {/*</UncontrolledTooltip>*/}
    </div>;
  };


  const renderCreate = () => {
    return <div>
      <Button
        onClick={(event) => formSubmit(event)}
        color="primary"
        className="mr-1 mb-1"
        size="sm"
        style={{'font-size': '14px'}}
        id="send-invitation-btn"
      >
        {!invitationText ? 'Send invitation' : invitationText}
      </Button>
      {/*<UncontrolledTooltip placement="top" target="send-invitation-btn">*/}
      {/*  Send invitation*/}
      {/*</UncontrolledTooltip>*/}
    </div>;
  };

  const renderStatus = () => {
    let status = '';

    if(manager.invited.accepted_at) {
      status = 'Accepted'
    } else if(manager.invited.revoked_at) {
      status = 'Revoked'
    } else if(manager.invited.is_expired) {
      status = 'Expired'
    }

    return <div><Button
      onClick={() => {}}
      color="primary"
      className="mr-1 mb-1"
      size="sm"
      style={{'font-size': '14px'}}
    >
      {status}
    </Button>
    </div>;
  };

  const isShowStatus = () => {

    return  manager.invited && (manager.invited.accepted_at || manager.invited.is_expired || manager.invited.revoked_at);
  }

  return (
    <div className="d-flex">
      {
        isShowStatus() ?
          <React.Fragment>
            {renderStatus()}
            {renderRemove()}
          </React.Fragment>
          : !manager.invited ?
          renderCreate()
          :
          <React.Fragment>
            {renderTime()}
            {renderRemove()}
          </React.Fragment>
      }

      <ToastContainer></ToastContainer>
    </div>
  )
};

export default UserInvitationsCreate
