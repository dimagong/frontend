import authReducer from "./auth/authReducer"
import notificationsReducer from "./onboarding/notificationsReducer"
import userReducers from "./user/userReducers"
import groupReducer from "./group/groupReducers"
import dFormReducer from "./onboarding/dFormReducers"

const appReducer = {
...authReducer,
...notificationsReducer,
...userReducers,
...groupReducer,
...dFormReducer,
}

export default appReducer;
