import React from "react"
import {
    Input,
    Row,
    Col,
    ListGroupItem,
    ListGroup,
    Media,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from "reactstrap"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import UserService from '../../../../services/user.service'
import userImg from "../../../../assets/img/portrait/small/avatar-s-11.jpg"
import * as Icon from "react-feather"
import { connect } from "react-redux"
import { store } from '../../../../redux/storeConfig/store'
import { setUserList } from '../../../../redux/actions/user/userActions'
import { setEditUser } from '../../../../redux/actions/user-management/userEditActions'
import { bindActionCreators } from "redux"

class UsersList extends React.Component {
    state = {

    }

    constructor() {
        super();

        this.searchTimeout = null;
    }

    getListCount() {
        return this.props.nav.total;
    }

    getLeftPage() {
        return this.props.nav.currPage === 1 ? 1 : (this.props.nav.currPage - 1) * this.props.nav.pageSize;
    }

    getRightPage() {
        const rightPage = this.props.nav.pageSize * this.props.nav.currPage;
        if (rightPage > this.getListCount()) {
            return this.getListCount();
        }
        return rightPage;
    }

    nextPage() {
        const rightPage = this.props.nav.pageSize * this.props.nav.currPage;
        if (rightPage > this.getListCount()) {
            return;
        }
        this.props.setUserList(this.props.users, {...this.props.nav, currPage: this.props.nav.currPage + 1});
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.getUserByEmail();
        }, 500);
    }

    previousPage() {
        if (this.props.nav.currPage < 2) {
            return;
        }
        this.props.setUserList(this.props.users, {...this.props.nav, currPage: this.props.nav.currPage - 1});
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.getUserByEmail();
        }, 500);
    }

    async getUserByEmail() {
        const response = await UserService.getByEmail(this.props.nav.searchVal, this.props.nav.currPage)
        const users = response.data.data;
        const total = response.data.meta.total;
        this.props.setUserList(users, {...this.props.nav, total});
    }

    searchChange = (event) => {
        this.props.setUserList(this.props.users, {...this.props.nav, searchVal: event.target.value});
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {

            this.getUserByEmail();
        }, 500);
    }

    componentWillReceiveProps(nextProps) {

    }

    async componentDidMount() {
        await this.getUserByEmail();
    }

    componentWillUnmount() {
    }

    openUserEdit = (user) => {
        this.props.setEditUser(user);
    }

    render() {

        return (
            <Row>
                <Col md="12" sm="12">
                    {/* <h4 className="my-1">Search</h4> */}
                    <InputGroup>
                        <Input
                            type="email"
                            name="Email"
                            id="EmailVertical"
                            placeholder="Search by email"
                            value={this.state.searchVal}
                            onChange={(event) => this.searchChange(event)}
                        />
                        <InputGroupAddon addonType="append">
                            <InputGroupText style={{ padding: 0 }}>
                                <span className="ml-1 mr-1">
                                    {this.getLeftPage() + '-' + this.getRightPage() + ' of ' + this.getListCount()}
                                </span>
                                <Button.Ripple onClick={() => this.previousPage()} className="btn-icon square" color="flat-primary"><Icon.ChevronLeft /></Button.Ripple>
                                <Button.Ripple onClick={() => this.nextPage()} className="btn-icon" color="flat-primary"><Icon.ChevronRight /></Button.Ripple>
                            </InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
                <Col md="12" sm="12">
                    {/* <h4 className="my-1">Users list</h4> */}
                    <ListGroup flush>
                        <Row>
                            {
                                this.props.users && this.props.users.map((user, index) => {
                                    return (<Col onClick={() => this.openUserEdit(user)} md="12" sm="12" lg="6" className="mt-1" key={index}>
                                        <ListGroupItem className={{ 'cursor-pointer': true, 'bg-gradient-primary': this.props.userEditing.id === user.id, 'user-bg-select': this.props.userEditing.id === user.id }}>
                                            <Media>
                                                <Media left tag="div">
                                                    <Media
                                                        object
                                                        src={userImg}
                                                        className="rounded-circle mr-2"
                                                        alt="Generic placeholder image"
                                                        height="50"
                                                        width="50"
                                                    />
                                                </Media>
                                                <Media body>
                                                    <h5 className="mt-0">{user.first_name + ' ' + user.first_name}</h5>
                                                    {user.number}
                                                </Media>
                                            </Media>
                                        </ListGroupItem>
                                    </Col>
                                    )
                                })
                            }
                        </Row>
                    </ListGroup>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = state => {

    return {
        users: state.user.list.data,
        nav: state.user.list.nav,
        userEditing: state.userManagement.userEditing
    }
}
const mapActionsToProps = (dispatch) => {
    return {
        setUserList: bindActionCreators(setUserList, dispatch),
        setEditUser: bindActionCreators(setEditUser, dispatch)
    }
}
export default connect(mapStateToProps, mapActionsToProps)(UsersList)
