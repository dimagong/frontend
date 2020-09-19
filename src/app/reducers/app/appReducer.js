import authReducer from "./auth/authReducer"
import notificationsReducer from "./onboarding/notificationsReducer"
import userReducers from "./user/userReducers"
import groupReducer from "./group/groupReducers"

const appReducer = {
...authReducer,
...notificationsReducer,
...userReducers,
...groupReducer
}

export default appReducer;
