import React from "react";
import { Button, Media } from "reactstrap";
import noneAvatar from "../../../../assets/img/portrait/none-avatar.png";
import fileService from "../../../../services/file.service";
import { isEqual, debounce } from "lodash";

class UserNavAvatar extends React.Component {
  state = {
    userAvatar: {},
  };

  constructor(props) {
    super(props);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(prevProps, this.props)) {
      this.setState({
        userAvatar: { ...this.state.userAvatar, [this.props.userId]: await this.getUserAvatar(this.props.userId) },
      });
    }
  }

  async componentDidMount() {
    this.setState({ userAvatar: { ...this.state.userAvatar, [this.props.userId]: await this.getUserAvatar() } });
  }

  async getUserAvatar() {
    const response = await fileService.getUserAvatar(this.props.userId);
    return response.data.data.avatar;
  }

  render() {
    return (
      <img
        src={
          this.props.userId in this.state.userAvatar && this.state.userAvatar[this.props.userId]
            ? this.state.userAvatar[this.props.userId]
            : noneAvatar
        }
        className="round"
        height="40"
        width="40"
        alt="avatar"
      />
    );
  }
}

export default UserNavAvatar;
