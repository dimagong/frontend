import authReducer from "./auth/authReducer"
import notificationsReducer from "./onboarding/notificationsReducer"
import userReducers from "./user/userReducers"
import groupReducer from "./group/groupReducers"
import dFormReducer from "./onboarding/dFormReducers"
import workflowReducer from "./onboarding/workflowReducers"

const appReducer = {
...authReducer,
...notificationsReducer,
...userReducers,
...groupReducer,
...dFormReducer,
...workflowReducer,
}

export default appReducer;
