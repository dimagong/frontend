import React from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import {
    Button
} from "reactstrap"
import moment from 'moment';
import {
  Archive,
} from "react-feather"

export const columnDefs = ({revokeInvitation, onCopy}) => [
  { 
      headerName: "Status",
      field: "revoked_at",
      width: 150,
      cellRendererFramework: (params) => {
          return !params.value && !params.data.accepted_at ? (
              <div className="badge badge-pill badge-light-success">
                  active
              </div>
          ) :
              <div className="badge badge-pill badge-light-danger">
                  { params.value ? 'Revoked' : params.data.accepted_at ? 'Accepted' : 'Active' }
              </div>

      },
      suppressSizeToFit: false,
  },
  {
      headerName: "Invitation link",
      field: "invitation_token",
      width: 200,
      cellRendererFramework: params => {
          return <CopyToClipboard
              onCopy={onCopy}
              text={window.location.origin + '/invitation-accept/' + params.value}
          >
              <Button size="sm" color="primary">Copy link</Button>
          </CopyToClipboard>

          //return <Link to={'/api/invitation/' + params.value}>{params.value}</Link>
      },
      suppressSizeToFit: false,
  },
  {
      headerName: "Invited user",
      field: "invited_user",
      width: 200,
      cellRendererFramework: params => {
          return params.value;
      },
      suppressSizeToFit: false,
  },
  {
      headerName: "Accepted at",
      field: "accepted_at",
      width: 200,
      cellRendererFramework: params => {
          return params.value ? moment(params.value).format('YYYY-MM-DD HH:mm:ss') : 'Not set';
      },
      suppressSizeToFit: false,
  },
  
  {
      headerName: "Created at",
      field: "created_at",
      width: 200,
      cellRendererFramework: params => {
          return params.value ? moment(params.value).format('YYYY-MM-DD HH:mm:ss') : 'Not set';
      },
      suppressSizeToFit: false,
  },
  {
      headerName: "Actions",
      field: "transactions",
      width: 150,
      cellRendererFramework: params => {
          return (
              <div className="actions cursor-pointer">
                  <Archive
                      size={15}
                      onClick={revokeInvitation}
                  />
              </div>
          )
      },
      suppressSizeToFit: false,
  }
]