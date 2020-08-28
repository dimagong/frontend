import React from "react"
import {
    Card,
    CardBody,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap"
import classnames from "classnames"
import { User, Info } from "react-feather"
import "../../../assets/scss/pages/users.scss"
import UserCreate from './UserCreate'
import UserList from './UserList'
import InvitationList from '../invitation/InvitationList'
import UserEdit from './UserEdit'
import { connect } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"


class UserManagement extends React.Component {
    state = {
        activeTab: "1"
    }

    toggle = tab => {
        this.setState({
            activeTab: tab
        })
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userEditing.id === this.props.userEditing.id && this.props.userEditing.id > 0) {
            // console.log('componentWillReceiveProps', this.props.userEditing);
        }
    }

    render() {
        return (
            <Row>
                <Col sm="12" md="12" lg="12" xl="5">
                    <Card>
                        <CardBody className="pt-2">
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({
                                            active: this.state.activeTab === "1"
                                        })}
                                        onClick={() => {
                                            this.toggle("1")
                                        }}
                                    >
                                        <User size={16} />
                                        <span className="align-middle ml-50">Users</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({
                                            active: this.state.activeTab === "2"
                                        })}
                                        onClick={() => {
                                            this.toggle("2")
                                        }}
                                    >
                                        <User size={16} />
                                        <span className="align-middle ml-50">Create user</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({
                                            active: this.state.activeTab === "3"
                                        })}
                                        onClick={() => {
                                            this.toggle("3")
                                        }}
                                    >
                                        <Info size={16} />
                                        <span className="align-middle ml-50">Invitations</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <UserList />
                                </TabPane>
                                <TabPane tabId="2">
                                    <UserCreate />
                                </TabPane>
                                <TabPane tabId="3">
                                    <InvitationList />
                                </TabPane>
                            </TabContent>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="12" md="12" lg="12" xl="7">
                    {this.props.userEditing.id > 0 ? <UserEdit /> : null}
                </Col>
                <ToastContainer />
            </Row>
        )
    }
}

const mapStateToProps = state => {
    return {
        userEditing: state.userManagement.userEditing
    }
};

export default connect(mapStateToProps)(UserManagement)
