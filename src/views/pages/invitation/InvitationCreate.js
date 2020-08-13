import React from 'react'
import {
    Button,
} from "reactstrap"

import UserService from '../../../services/user.service'
import InvitationService from '../../../services/invitation.service'
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import "../../../assets/scss/pages/users.scss"
import { connect } from "react-redux"
import { setUserList } from '../../../redux/actions/user/userActions'
import { setEditUser } from '../../../redux/actions/user-management/userEditActions'
import { setInvitationsList } from '../../../redux/actions/user-management/InvitationsActions'
import { bindActionCreators } from "redux"
import { store } from '../../../redux/storeConfig/store'

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
    }

    dispatchEditUser = async () => {
        const userId = store.getState().userManagement.userEditing.id;
        if(userId > 0) {
            const response = await UserService.getUserById(userId);
            const user = response.data.data;
            store.dispatch(setEditUser(user));
        }        
    }

    dispatchInvitationList = async () => {
        let response = await InvitationService.getAll();
        let rowData = response.data.data;
        this.props.setInvitationsList(rowData);
    }

    formSubmit = async (event) => {
        event.preventDefault();
        try {
            await InvitationService.createInvitation(this.props.user.id);
            this.dispatchUserList();
            this.dispatchInvitationList();
            this.dispatchEditUser();
            toast.success('success')
            this.setState({ ...this.state, errors: {} })
        } catch (responseError) {
            if('response' in responseError) {
                // const errorStatus = responseError.response.status;
                const error = responseError.response.data.error;
                toast.error(error.message)
                this.setState({ ...this.state, errors: { ...error.errors } })
            } else {
                console.log(responseError);
            }     
        }
    }

    render() {

        return (
            <Button.Ripple
                onClick={(event) => this.formSubmit(event)}
                color="primary"
                type="submit"
                className="mr-1 mb-1"
                size="sm"
                style={{ 'font-size': '14px'}}
            >
                Send invitation
            </Button.Ripple>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}
const mapActionsToProps = (dispatch) => {
    return {
        setUserList: bindActionCreators(setUserList, dispatch),
        setInvitationsList: bindActionCreators(setInvitationsList, dispatch)
    }
}
export default connect(mapStateToProps, mapActionsToProps)(InvitationCreate)