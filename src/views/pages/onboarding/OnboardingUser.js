import React from 'react'
import {connect} from "react-redux"
import {bindActionCreators} from "redux";
import OnboardingForm from "./OnboardingForm";

class OnboardingUser extends React.Component {

  state = {

  };

  componentWillMount() {

  }


  render() {

    return (
      <div>
        {
          this.props.user && this.props.user.onboardings && this.props.user.onboardings.length
            ? <OnboardingForm></OnboardingForm> : 'Onboarding not exist'
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.profile
  }
};

export default connect(mapStateToProps)(OnboardingUser)
