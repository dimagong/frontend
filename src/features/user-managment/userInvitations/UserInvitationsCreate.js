import React from 'react'
import {
  Button,
  UncontrolledTooltip
} from "reactstrap"
import {RefreshCcw, Trash} from "react-feather"
import { useDispatch, useSelector } from "react-redux";
import { createInvitationsRequest, deleteInvitationsRequest } from "app/slices/appSlice";
import { selectManager } from "app/selectors";

const UserInvitationsCreate = ({resend, trash, send, invitationText, }) => {
    const dispatch = useDispatch();
  const manager = useSelector(selectManager);
  const remove = (event) => {
        event.preventDefault();
        dispatch(deleteInvitationsRequest({managerInvitedId:manager.invited.id}))

    }
    const formSubmit = (event) => {
        event.preventDefault();
        dispatch(createInvitationsRequest({managerId: manager.id, resend}))
    }
    return (
        <div className="d-flex">
        {
          resend ?
            <div>
              <Button
                onClick={formSubmit}
                color="primary"
                type="submit"
                className="mr-1 mb-1 btn-icon"
                size="sm"
                style={{'font-size': '14px'}}
                id="resend-invitation-btn"
              >
                <RefreshCcw></RefreshCcw>
              </Button>
              <UncontrolledTooltip placement="top" target="resend-invitation-btn">
                Resend invitation
              </UncontrolledTooltip>
            </div>
            : null
        }
        {
          trash ?
            <div>
              <Button
                onClick={(event) => remove(event)}
                color="primary"
                type="submit"
                className="mr-1 mb-1 btn-icon"
                size="sm"
                style={{'font-size': '14px'}}
                id="trash-invitation-btn"
              >
                <Trash></Trash>
              </Button>
              <UncontrolledTooltip placement="top" target="trash-invitation-btn">
                Delete invitation
              </UncontrolledTooltip>
            </div>
            : null
        }
        {
          send ? <div>
              <Button
                onClick={(event) =>formSubmit(event)}
                color="primary"
                type="submit"
                className="mr-1 mb-1"
                size="sm"
                style={{'font-size': '14px'}}
                id="send-invitation-btn"
              >
                {!invitationText ? 'Send invitation' : invitationText}
              </Button>
              <UncontrolledTooltip placement="top" target="send-invitation-btn">
                Send invitation
              </UncontrolledTooltip>
            </div>
            : null
        }
      </div>
    )
}

export default UserInvitationsCreate
