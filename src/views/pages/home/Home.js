import React from 'react'
import userService from "../../../services/user.service";
import {history} from "../../../history"
import {connect} from "react-redux";
import {isEmpty} from "lodash"

class Home extends React.Component {

  componentDidMount() {
    this.redirectingByUserRoles();
  }

  componentDidUpdate() {
    this.redirectingByUserRoles();
  }

  redirectingByUserRoles() {
    if (isEmpty(this.props.userProfile)) return false;

    if (userService.isOnboarding(this.props.userProfile)) {
      history.push('/onboarding-process')
    } else {
      history.push('/user-management')
    }
  }

  render() {
    return <div></div>
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.user.profile
  }
};

export default connect(mapStateToProps)(Home)
