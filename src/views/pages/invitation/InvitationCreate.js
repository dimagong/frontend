import React from 'react'
import {
  Button,
  UncontrolledTooltip
} from "reactstrap"
import {RefreshCcw, Trash} from "react-feather"
import UserService from '../../../services/user.service'
import InvitationService from '../../../services/invitation.service'
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import "../../../assets/scss/pages/users.scss"
import {connect} from "react-redux"
import {setUserList} from '../../../redux/actions/user/userActions'
import {setEditUser} from '../../../redux/actions/user-management/userEditActions'
import {setInvitationsList} from '../../../redux/actions/user-management/InvitationsActions'
import {bindActionCreators} from "redux"
import {store} from '../../../redux/storeConfig/store'

class InvitationCreate extends React.Component {
  state = {
    user: null,
    errors: {}
  };

  async componentDidMount() {
  }

  dispatchUserList = async () => {
    const nav = store.getState().user.list.nav;
    const response = await UserService.getByEmail(nav.searchVal, nav.currPage);
    const users = response.data.data;
    this.props.setUserList(users, nav);
  };

  dispatchEditUser = async () => {
    const userId = store.getState().userManagement.userEditing.id;
    if (userId > 0) {
      const response = await UserService.getUserById(userId);
      const user = response.data.data;
      store.dispatch(setEditUser(user));
    }
  };

  dispatchInvitationList = async () => {
    let response = await InvitationService.getAll();
    let rowData = response.data.data;
    this.props.setInvitationsList(rowData);
  };

  formSubmit = async (event) => {
    event.preventDefault();
    try {
      await InvitationService.createInvitation(this.props.user.id, this.props.resend);
      this.dispatchUserList();
      this.dispatchInvitationList();
      this.dispatchEditUser();
      toast.success('success');
      this.setState({...this.state, errors: {}})
    } catch (responseError) {
      if ('response' in responseError) {
        // const errorStatus = responseError.response.status;
        const error = responseError.response.data.error;
        toast.error(error.message);
        this.setState({...this.state, errors: {...error.errors}})
      } else {
        console.log(responseError);
      }
    }
  }

  remove = async (event) => {
    event.preventDefault();
    try {
      await InvitationService.delete(this.props.user.invited.id);
      this.dispatchUserList();
      this.dispatchInvitationList();
      this.dispatchEditUser();
      toast.success('success');
      this.setState({...this.state, errors: {}})
    } catch (responseError) {
      if ('response' in responseError) {
        // const errorStatus = responseError.response.status;
        const error = responseError.response.data.error;
        toast.error(error.message);
        this.setState({...this.state, errors: {...error.errors}})
      } else {
        console.log(responseError);
      }
    }
  }

  render() {

    return (
      <div className="d-flex">
        {
          this.props.resend ?
            <div>
              <Button.Ripple
                onClick={(event) => this.formSubmit(event)}
                color="primary"
                type="submit"
                className="mr-1 mb-1 btn-icon"
                size="sm"
                style={{'font-size': '14px'}}
                id="resend-invitation-btn"
              >
                <RefreshCcw></RefreshCcw>
              </Button.Ripple>
              <UncontrolledTooltip placement="top" target="resend-invitation-btn">
                Resend invitation
              </UncontrolledTooltip>
            </div>
            : null
        }
        {
          this.props.trash ?
            <div>
              <Button.Ripple
                onClick={(event) => this.remove(event)}
                color="primary"
                type="submit"
                className="mr-1 mb-1 btn-icon"
                size="sm"
                style={{'font-size': '14px'}}
                id="trash-invitation-btn"
              >
                <Trash></Trash>
              </Button.Ripple>
              <UncontrolledTooltip placement="top" target="trash-invitation-btn">
                Delete invitation
              </UncontrolledTooltip>
            </div>
            : null
        }
        {
          this.props.send ? <div>
              <Button.Ripple
                onClick={(event) => this.formSubmit(event)}
                color="primary"
                type="submit"
                className="mr-1 mb-1"
                size="sm"
                style={{'font-size': '14px'}}
                id="send-invitation-btn"
              >
                {!this.props.invitationText ? 'Send invitation' : this.props.invitationText}
              </Button.Ripple>
              <UncontrolledTooltip placement="top" target="send-invitation-btn">
                Send invitation
              </UncontrolledTooltip>
            </div>
            : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}
const mapActionsToProps = (dispatch) => {
  return {
    setUserList: bindActionCreators(setUserList, dispatch),
    setInvitationsList: bindActionCreators(setInvitationsList, dispatch)
  }
}
export default connect(mapStateToProps, mapActionsToProps)(InvitationCreate)
