import React from "react";
import { Button, Media, Spinner } from "reactstrap";
import noneAvatar from "../../../../assets/img/portrait/none-avatar.png";
import fileService from "../../../../services/file.service";
import { isEqual, debounce, isEmpty } from "lodash";
import { X } from "react-feather";
import UserService from "../../../../services/user.service";
import { setEditUser } from "../../../../redux/actions/user-management/userEditActions";
import { store } from "../../../../redux/storeConfig/store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUserList, updateUserInList, setUserProfile } from "../../../../redux/actions/user/userActions";
import { setInvitationsList } from "../../../../redux/actions/user-management/InvitationsActions";

class UserAvatar extends React.Component {
  state = {
    userAvatar: {},
    isLoading: false,
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.showAvatar();
  }

  async showAvatar() {
    if (isEmpty(this.props.avatar)) {
      return;
    }
    const userId = this.props.userId;
    this.setState({ isLoading: true });
    this.setState({ userAvatar: { ...this.state.userAvatar, [this.props.userId]: await this.getUserAvatar(userId) } });
    this.setState({ isLoading: false });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(prevProps, this.props)) {
      if (!(this.props.userId in this.state.userAvatar)) {
        this.showAvatar();
      }
    }
  }

  changeAvatar(event) {
    event.preventDefault();
    let input = window.document.getElementById("input-user-edit-avatar");
    if (!input) return;
    input.click();
  }

  async getUserAvatar(userId) {
    const response = await fileService.getUserAvatar(userId);
    return response.data.data.avatar;
  }

  async onChangeAvatar(event) {
    let files = event.target.files;
    if (!files.length) {
      return;
    }
    let formData = new FormData();
    formData.set("avatar", files[0]);
    event.target.value = "";
    const userId = this.props.userId;
    this.setState({ isLoading: true });
    const response = await fileService.changeUserAvatar(userId, formData);
    this.setState({ userAvatar: { ...this.state.userAvatar, [userId]: await this.getUserAvatar(userId) } });
    await this.dispatchEditUser();
    this.setState({ isLoading: false });
  }

  async removeAvatar() {
    if (!window.confirm("Are you sure you want to delete avatar?")) {
      return;
    }
    const userId = this.props.userId;
    this.setState({ isLoading: true });
    await fileService.deleteFile(this.props.avatar.id);
    this.setState({ userAvatar: { ...this.state.userAvatar, [userId]: await this.getUserAvatar(userId) } });
    await this.dispatchEditUser();
    this.setState({ isLoading: false });
  }

  isAvatarExist() {
    return this.props.userId in this.state.userAvatar && this.state.userAvatar[this.props.userId];
  }

  dispatchEditUser = async () => {
    const response = await UserService.getUserById(this.props.userId);
    const user = response.data.data;
    this.props.updateUserInList(user);
    this.props.setEditUser(user);
    if (user.id === this.props.userProfile.id) {
      this.props.setUserProfile(user);
    }
  };

  render() {
    return (
      <Media
        className="mt-md-1 mt-0 mr-1"
        left
        style={{ display: "flex", "flex-direction": "column", position: "relative" }}
      >
        <Media
          className="rounded"
          object
          src={this.isAvatarExist() ? this.state.userAvatar[this.props.userId] : noneAvatar}
          alt="Generic placeholder image"
          height="112"
          width="112"
        />

        <div style={{ "margin-top": "5px" }} className="d-flex justify-content-center">
          <Button.Ripple
            disabled={this.state.isLoading}
            onClick={(event) => this.changeAvatar(event)}
            outline
            size="sm"
            color="primary"
          >
            Change
          </Button.Ripple>
          <input id="input-user-edit-avatar" type="file" hidden onChange={(event) => this.onChangeAvatar(event)} />
        </div>

        {!this.isAvatarExist() || this.state.isLoading ? null : (
          <X
            className="x-closer"
            onClick={() => this.removeAvatar()}
            size={15}
            style={{
              position: "absolute",
              right: "5px",
              top: "5px",
              border: "1px",
              "border-radius": "10px",
              color: "#000",
              background: "#fff",
            }}
          />
        )}
        {!this.state.isLoading ? null : (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Spinner color="primary" />
          </div>
        )}
      </Media>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.profile,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    updateUserInList: bindActionCreators(updateUserInList, dispatch),
    setEditUser: bindActionCreators(setEditUser, dispatch),
    setUserProfile: bindActionCreators(setUserProfile, dispatch),
  };
};
export default connect(mapStateToProps, mapActionsToProps)(UserAvatar);
