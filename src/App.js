import React from "react"
import Router from "./Router"
import "./components/@vuexy/rippleButton/RippleButton"
import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import UserService from './services/user.service';
import { store } from './redux/storeConfig/store'
import { setUserProfile } from './redux/actions/user/userActions'
import AuthService from './services/auth.service'

class App extends React.Component {

  async componentDidMount() {
    if(AuthService.isAuth()) {
      this.getUserData();
    }
  }

  getUserData = async () => {
    const response = await UserService.getProfile();
    store.dispatch(setUserProfile(response.data.data));
  };

  render = () => {
    return <Router />;
  }
}

export default App
